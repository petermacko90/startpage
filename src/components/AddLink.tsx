import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatchContext } from "../context";
import { type Category } from "../reducer/models.ts";
import Button from "./Button/Button.tsx";
import Form from "./Form/Form.tsx";
import FormField from "./Form/FormField.tsx";
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
      <Button action={() => handleSave()}>Save</Button>
    </Form>
  );
}
