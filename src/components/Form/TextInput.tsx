import type { ChangeEventHandler, RefObject } from "react";
import "./TextInput.css";

export default function TextInput({
  id,
  value,
  onChange,
  onPressEnter,
  maxLength,
  inputRef,
}: {
  id: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
  onPressEnter: () => void;
  maxLength?: number;
  inputRef?: RefObject<HTMLInputElement | null>;
}) {
  return (
    <input
      type="text"
      id={id}
      value={value}
      onChange={onChange}
      onKeyDown={(e) => e.key === "Enter" && onPressEnter()}
      maxLength={maxLength}
      ref={inputRef}
    />
  );
}
