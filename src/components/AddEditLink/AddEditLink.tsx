import { useContext, useState, type RefObject } from "react";
import { StateContext } from "../../state/context.ts";
import { type Category, type Link } from "../../state/models.ts";
import { LOCALHOST } from "../../constants.ts";
import { selectLink, selectLinks } from "../../state/selectors.ts";
import { createLink, updateLink } from "../../storage/localStorage.ts";
import Button from "../Button/Button.tsx";
import Form from "../Form/Form.tsx";
import FormField from "../Form/FormField.tsx";
import TextInput from "../Form/TextInput.tsx";
import OrderInput from "../Form/OrderInput.tsx";
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
  const [order, setOrder] = useState(link ? link.order : linkCount);
  const [urlError, setUrlError] = useState("");

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
      updateLink(categoryId, {
        icon: link.icon,
        id: link.id,
        order,
        title: title.trim() || formattedUrl,
        url: formattedUrl,
      });

      cancel();
    } else {
      createLink(
        categoryId,
        order,
        title.trim() || formattedUrl,
        formattedUrl,
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
          />
        </FormField>
        <FormField id="order" labelText="Order:">
          <OrderInput
            id="order"
            value={order}
            max={link ? linkCount - 1 : linkCount}
            setValue={setOrder}
            items={[...links!]}
            itemId={linkId}
          />
        </FormField>
      </Form>
      <div className="add-edit-link-actions">
        <Button action={() => handleSave()}>Save</Button>
        <Button action={cancel}>Cancel</Button>
        {linkId && (
          <Button
            action={() => {
              handleDeleteLink!(linkId, order);
              cancel();
            }}
          >
            Delete Link
          </Button>
        )}
      </div>
    </div>
  );
}
