import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatchContext } from "../context";
import { type Category } from "../reducer/models.ts";
import "./AddLink.css";

export default function AddLink({
  categoryId,
  linkCount,
}: {
  categoryId: Category["id"];
  linkCount: number;
}) {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const dispatch = useDispatchContext();

  function handleSave() {
    if (!url) {
      setUrlError("URL is required");
      return;
    }

    const formattedUrl = formatUrl(url);

    dispatch({
      type: "link added",
      payload: {
        categoryId,
        link: {
          icon: "",
          id: uuidv4(),
          order: linkCount + 1,
          text: text.trim() || formattedUrl,
          url: formattedUrl,
        },
      },
    });

    setText("");
    setUrl("");
    setUrlError("");
  }

  function formatUrl(url: string): string {
    const prefix = "https://";
    if (url.startsWith(prefix)) return url;
    return `${prefix}${url}`;
  }

  return (
    <div className="add-link-form">
      <div className="add-link-form-field">
        <label htmlFor="text">Text:</label>
        <input
          id="text"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
      </div>
      <div className="add-link-form-field">
        <label htmlFor="url">URL:</label>
        <div>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setUrlError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          <div className="error-text">{urlError}</div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => handleSave()}
        className="save-button"
      >
        Save
      </button>
    </div>
  );
}
