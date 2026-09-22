import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { StateContext } from "../context.ts";
import { type Category, type Link } from "../reducer/models.ts";
import { LOCALHOST } from "../constants.ts";
import { selectLink } from "../reducer/selectors.ts";
import { getState, setState } from "../storage.ts";
import Button from "./Button/Button.tsx";
import Form from "./Form/Form.tsx";
import FormField from "./Form/FormField.tsx";
import "./AddEditLink.css";

export default function AddEditLink({
  categoryId,
  linkCount,
  linkId,
  cancel,
}: {
  categoryId: Category["id"];
  linkCount: number;
  linkId: Link["id"] | null;
  cancel: () => void;
}) {
  const state = useContext(StateContext);

  let link: Link | undefined = undefined;
  if (linkId) {
    link = selectLink(state)(categoryId, linkId);
  }

  const [text, setText] = useState(link ? link.text : "");
  const [url, setUrl] = useState(link ? link.url : "");
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
      const updatedLink: Link = {
        icon: link.icon,
        id: link.id,
        order: link.order,
        text: text.trim() || formattedUrl,
        url: formattedUrl,
      };

      getState().then((state) => {
        const updatedItems = state.categories[categoryId].items.map((item) => {
          return item.id === link.id ? updatedLink : item;
        });

        setState({
          ...state,
          categories: {
            ...state.categories,
            [categoryId]: {
              ...state.categories[categoryId],
              items: updatedItems,
            },
          },
        });
      });

      cancel();
    } else {
      getState().then((state) => {
        setState({
          ...state,
          categories: {
            ...state.categories,
            [categoryId]: {
              ...state.categories[categoryId],
              items: [
                ...state.categories[categoryId].items,
                {
                  icon: "",
                  id: uuidv4(),
                  order: linkCount + 1,
                  text: text.trim() || formattedUrl,
                  url: formattedUrl,
                },
              ],
            },
          },
        });
      });

      setText("");
      setUrl("");
      setUrlError("");
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
        <FormField
          id="text"
          labelText="Text:"
          onChange={(e) => setText(e.target.value)}
          onPressEnter={handleSave}
          value={text}
        />
        <FormField
          id="url"
          labelText="URL:"
          onChange={(e) => {
            setUrl(e.target.value);
            setUrlError("");
          }}
          onPressEnter={handleSave}
          value={url}
          error={urlError}
        />
      </Form>
      <div className="add-edit-link-actions">
        <Button action={() => handleSave()}>Save</Button>
        <Button action={cancel}>Cancel</Button>
      </div>
    </div>
  );
}
