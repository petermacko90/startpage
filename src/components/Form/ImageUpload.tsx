import {
  useRef,
  type ChangeEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { KEY_ENTER, KEY_SPACE } from "../../constants";
import { t } from "../../utils/i18n";
import Button from "../Button/Button";
import "./ImageUpload.css";

export default function ImageUpload({
  label,
  showDelete,
  deleteLabel,
  handleUpload,
  handleDelete,
  previewUrl,
  focusRef,
  customIconError,
  children,
}: {
  label: string;
  showDelete: boolean;
  deleteLabel: string;
  handleUpload: (e: ChangeEvent<HTMLInputElement, Element>) => void;
  handleDelete: () => void;
  previewUrl?: string | null;
  focusRef?: RefObject<HTMLElement | null>;
  customIconError?: string;
  children?: ReactNode;
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
          if (e.key === KEY_ENTER || e.key === KEY_SPACE) {
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
        <img
          src={previewUrl}
          alt={t("pageIconCustom")}
          className="icon-preview"
        />
      )}
      {showDelete && (
        <Button type="danger" action={handleDelete}>
          {deleteLabel}
        </Button>
      )}
      {children}
      {(customIconError?.length ?? 0) > 0 && (
        <div className="error-text">{customIconError}</div>
      )}
    </div>
  );
}
