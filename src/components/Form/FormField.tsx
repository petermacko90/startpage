import type { ChangeEventHandler, RefObject } from "react";
import "./FormField.css";

export default function FormField({
  id,
  labelText,
  value,
  onChange,
  onPressEnter,
  error,
  maxLength,
  inputRef,
}: {
  id: string;
  labelText: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
  onPressEnter: () => void;
  error?: string;
  maxLength?: number;
  inputRef?: RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{labelText}</label>
      <div>
        <input
          id={id}
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={(e) => e.key === "Enter" && onPressEnter()}
          maxLength={maxLength}
          ref={inputRef}
        />
        {error && <div className="error-text">{error}</div>}
      </div>
    </div>
  );
}
