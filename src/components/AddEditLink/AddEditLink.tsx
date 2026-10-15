import {
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type RefObject,
} from "react";
import { StateContext } from "../../state/context.ts";
import { type Category, type Link } from "../../state/models.ts";
import { IMAGE_FILETYPE, LOCALHOST } from "../../constants.ts";
import { selectLink, selectLinks } from "../../state/selectors.ts";
import { createLink, updateLink } from "../../storage/localStorage.ts";
import { getImage } from "../../storage/indexedDB.ts";
import { useErrorToast } from "../../hooks/useToastError.ts";
import Button from "../Button/Button.tsx";
import Form from "../Form/Form.tsx";
import FormField from "../Form/FormField.tsx";
import ImageUpload from "../Form/ImageUpload.tsx";
import OrderInput from "../Form/OrderInput.tsx";
import TextInput from "../Form/TextInput.tsx";
import Toast from "../Toast/Toast.tsx";
import "./AddEditLink.css";

export default function AddEditLink({
  categoryId,
  linkCount,
  linkId,
  cancel,
  textInputRef,
  handleDeleteLink,
}: {
  categoryId: Category["id"];
  linkCount: number;
  linkId: Link["id"] | null;
  cancel: () => void;
  textInputRef: RefObject<HTMLInputElement | null>;
  handleDeleteLink?: (linkId: Link["id"], index: number) => void;
}) {
  const state = useContext(StateContext);
  const links = selectLinks(state)(categoryId);

  let link: Link | undefined = undefined;
  if (linkId) {
    link = selectLink(state)(categoryId, linkId);
  }

  const [title, setTitle] = useState(link ? link.title : "");
  const [url, setUrl] = useState(link ? link.url : "");
  const [urlError, setUrlError] = useState("");
  const [order, setOrder] = useState(link ? link.order : linkCount);
  const [customIcon, setCustomIcon] = useState<File | null>(null);
  const [customIconId, setCustomIconId] = useState(link?.customIconId);

  function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  function handleSave() {
    if (!url.trim()) {
      setUrlError("URL is required");
      return;
    }

    const formattedUrl = formatUrl(url.trim());

    if (!isValidUrl(formattedUrl)) {
      setUrlError("URL is not valid");
      return;
    }

    if (link) {
      updateLink(
        categoryId,
        {
          customIconId: link.customIconId,
          id: link.id,
          order,
          title: title.trim() || formattedUrl,
          url: formattedUrl,
        },
        customIcon,
      );

      cancel();
    } else {
      createLink(
        categoryId,
        order,
        title.trim() || formattedUrl,
        formattedUrl,
        customIcon,
        linkCount,
      );

      setTitle("");
      setUrl("");
      setOrder(linkCount);
      setUrlError("");

      setTimeout(() => textInputRef.current?.focus(), 50);
    }
  }

  function formatUrl(url: string): string {
    const https = "https://";
    const http = "http://";

    if (
      url.startsWith(https) ||
      url.startsWith(http) ||
      url.startsWith("about:")
    ) {
      return url;
    }

    if (url.startsWith(`${LOCALHOST}:`)) return `${http}${url}`;
    return `${https}${url}`;
  }

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { isError, errorMessage, showErrorToast, clearError } = useErrorToast();

  function handleIconUpload(e: ChangeEvent<HTMLInputElement>) {
    clearError();

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith(IMAGE_FILETYPE)) {
      showErrorToast("Please select an image");
      return;
    }

    setCustomIcon(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
  }

  const uploadIconRef = useRef<HTMLElement>(null);

  function handleIconDelete() {
    setCustomIcon(null);
    setCustomIconId(null);
    setPreviewUrl(null);
    setCustomIconSrc(null);
    uploadIconRef.current?.focus();
  }

  const [customIconSrc, setCustomIconSrc] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl = "";

    async function loadCustomIcon() {
      if (link?.customIconId) {
        try {
          const blob = await getImage(link.customIconId);

          if (blob) {
            objectUrl = URL.createObjectURL(blob);
            setCustomIconSrc(objectUrl);
          }
        } catch (e) {
          console.error("failed to fetch image from IndexedDB", e);
        }
      }
    }

    loadCustomIcon();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [link?.customIconId]);

  return (
    <div className="add-edit-link-container">
      <h1 className="add-edit-link-heading">
        {link ? "Edit Link" : "Add Link"}
      </h1>
      <Form>
        <FormField id="title" labelText="Text:">
          <TextInput
            id="title"
            onChange={(e) => setTitle(e.target.value)}
            onPressEnter={handleSave}
            value={title}
            inputRef={textInputRef}
          />
        </FormField>
        <FormField id="url" labelText="URL:" error={urlError}>
          <TextInput
            id="url"
            onChange={(e) => {
              setUrl(e.target.value);
              setUrlError("");
            }}
            onPressEnter={handleSave}
            value={url}
            type="url"
          />
        </FormField>
        <OrderInput
          value={order}
          max={link ? linkCount - 1 : linkCount}
          setValue={setOrder}
          items={[...links!]}
          itemId={linkId}
        />
        <ImageUpload
          label="Upload Icon"
          showDelete={!!customIconId || customIcon !== null}
          deleteLabel="Remove Icon"
          previewUrl={previewUrl ?? customIconSrc}
          handleUpload={handleIconUpload}
          handleDelete={handleIconDelete}
          focusRef={uploadIconRef}
        />
        <div className="buttons-container">
          <Button action={() => handleSave()}>Save</Button>
          <Button action={cancel}>Cancel</Button>
          {linkId && (
            <Button
              type="danger"
              action={() => {
                handleDeleteLink!(linkId, order);
                cancel();
              }}
            >
              Delete Link
            </Button>
          )}
        </div>
      </Form>
      <Toast type="error" show={isError} text={errorMessage} />
    </div>
  );
}
