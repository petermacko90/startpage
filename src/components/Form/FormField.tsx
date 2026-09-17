import type { ChangeEventHandler } from "react";
import "./FormField.css";

export default function FormField({
  id,
  labelText,
  value,
  onChange,
  onPressEnter,
  error,
  maxLength,
}: {
  id: string;
  labelText: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
  onPressEnter: () => void;
  error?: string;
  maxLength?: number;
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
        />
        {error && <div className="error-text">{error}</div>}
      </div>
    </div>
  );
}
