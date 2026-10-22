import { useContext, useState, type RefObject } from "react";
import { StateContext } from "../../state/context";
import { type Category, type Link } from "../../state/models";
import { LOCALHOST } from "../../constants";
import { selectLink, selectLinks } from "../../state/selectors";
import { createLink, updateLink } from "../../storage/localStorage/links";
import { useImageUpload } from "../../hooks/useImageUpload";
import { getIconType, type IconType } from "../../utils/getIconType";
import { isBlockedUrl } from "../../utils/isBlockedUrl";
import { isValidEmoji } from "../../utils/isValidEmoji";
import Button from "../Button/Button";
import Form from "../Form/Form";
import FormField from "../Form/FormField";
import ImageUpload from "../Form/ImageUpload";
import OrderInput from "../Form/OrderInput/OrderInput";
import TextInput from "../Form/TextInput";
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
  const [emoji, setEmoji] = useState(link ? link.emoji : null);
  const [emojiError, setEmojiError] = useState("");
  const [customIconError, setCustomIconError] = useState("");

  const [iconType, setIconType] = useState<IconType>(
    link ? getIconType(link) : "default",
  );

  const {
    customIconId,
    uploadedImage,
    uploadedImageUrl,
    savedIconUrl,
    uploadIconRef,
    handleIconUpload,
    handleIconDelete,
  } = useImageUpload(link?.customIconId, setCustomIconError);

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

    if (iconType === "emoji" && !isValidEmoji(emoji?.trim() ?? "")) {
      setEmojiError("Emoji is not valid");
      return;
    }

    if (iconType === "upload" && !uploadedImage) {
      setCustomIconError("Icon is not uploaded");
      return;
    }

    if (link) {
      updateLink({
        categoryId,
        link: {
          customIconId: link.customIconId,
          emoji: iconType === "emoji" ? emoji : null,
          id: link.id,
          order,
          title: title.trim() || formattedUrl,
          url: formattedUrl,
        },
        customIcon: iconType === "upload" ? uploadedImage : null,
        shouldRemove: iconType !== "upload",
      });

      cancel();
    } else {
      createLink({
        categoryId,
        order,
        title: title.trim() || formattedUrl,
        url: formattedUrl,
        emoji: iconType === "emoji" ? emoji : null,
        customIcon: iconType === "upload" ? uploadedImage : null,
        linkCount,
      });

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

    if (url.startsWith(https) || url.startsWith(http) || isBlockedUrl(url)) {
      return url;
    }

    if (url.startsWith(`${LOCALHOST}:`)) return `${http}${url}`;
    return `${https}${url}`;
  }

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
        <div className="form-field">
          <div className="label">Icon:</div>
          <label>
            <input
              type="radio"
              name="iconType"
              value="default"
              checked={iconType === "default"}
              onChange={() => setIconType("default")}
            />
            Defaut Web Icon
          </label>
          <label>
            <input
              type="radio"
              name="iconType"
              value="upload"
              checked={iconType === "upload"}
              onChange={() => setIconType("upload")}
            />
            Upload Image
          </label>
          <label>
            <input
              type="radio"
              name="iconType"
              value="emoji"
              checked={iconType === "emoji"}
              onChange={() => setIconType("emoji")}
            />
            Use Emoji
          </label>
        </div>
        {iconType === "upload" && (
          <>
            <ImageUpload
              label="Upload Icon"
              showDelete={!!customIconId || uploadedImage !== null}
              deleteLabel="Remove Icon"
              previewUrl={uploadedImageUrl ?? savedIconUrl}
              handleUpload={handleIconUpload}
              handleDelete={handleIconDelete}
              focusRef={uploadIconRef}
            />
            {customIconError.length > 0 && (
              <div className="error-text">{customIconError}</div>
            )}
          </>
        )}
        {iconType === "emoji" && (
          <FormField id="emoji" labelText="Emoji:" error={emojiError}>
            <TextInput
              id="emoji"
              value={emoji ?? ""}
              onChange={(e) => {
                setEmoji(e.target.value);
                setEmojiError("");
              }}
              onPressEnter={handleSave}
            />
          </FormField>
        )}
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
    </div>
  );
}
