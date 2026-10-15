import type { MouseEventHandler, ReactNode, RefObject } from "react";
import "./Button.css";

export default function Button({
  action,
  children,
  type = "default",
  disabled,
  buttonRef,
}: {
  action: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  type?: "default" | "danger";
  disabled?: boolean;
  buttonRef?: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      type="button"
      className={`button ${type}`}
      onClick={action}
      disabled={disabled}
      ref={buttonRef}
    >
      {children}
    </button>
  );
}
