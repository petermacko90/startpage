import { useRef, type ChangeEvent, type RefObject } from "react";
import "./ImageUpload.css";
import Button from "../Button/Button";

export default function ImageUpload({
  label,
  showDelete,
  deleteLabel,
  handleUpload,
  handleDelete,
  previewUrl,
  focusRef,
}: {
  label: string;
  showDelete: boolean;
  deleteLabel: string;
  handleUpload: (e: ChangeEvent<HTMLInputElement, Element>) => void;
  handleDelete: () => void;
  previewUrl?: string | null;
  focusRef?: RefObject<HTMLElement | null>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="buttons-container">
      <label
        htmlFor="image-upload"
        className="image-upload"
        tabIndex={0}
        role="button"
        ref={focusRef as RefObject<HTMLLabelElement>}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        {label}
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="overflow"
        ref={inputRef}
        onChange={handleUpload}
      />
      {previewUrl && (
        <img src={previewUrl} alt="custom icon" className="icon-preview" />
      )}
      {showDelete && (
        <Button type="danger" action={handleDelete}>
          {deleteLabel}
        </Button>
      )}
    </div>
  );
}
