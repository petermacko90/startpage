import type { ReactNode } from "react";
import "./FormField.css";

export default function FormField({
  id,
  labelText,
  error,
  children,
}: {
  id: string;
  labelText: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{labelText}</label>
      <div>
        {children}
        {error && <div className="error-text">{error}</div>}
      </div>
    </div>
  );
}
