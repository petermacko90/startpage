import type { ChangeEventHandler, KeyboardEvent, RefObject } from "react";
import "./TextInput.css";

export default function TextInput({
  id,
  value,
  onChange,
  onPressEnter,
  maxLength,
  inputRef,
  type = "text",
}: {
  id: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
  onPressEnter: () => void;
  type?: "text" | "url";
  maxLength?: number;
  inputRef?: RefObject<HTMLInputElement | null>;
}) {
  function handlePressEnter(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onPressEnter();
    }
  }

  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      onKeyDown={handlePressEnter}
      maxLength={maxLength}
      ref={inputRef}
    />
  );
}
