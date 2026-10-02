import type { MouseEventHandler, ReactNode, RefObject } from "react";
import "./Button.css";

export default function Button({
  action,
  children,
  disabled,
  buttonRef,
}: {
  action: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  disabled?: boolean;
  buttonRef?: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      type="button"
      className="button"
      onClick={action}
      disabled={disabled}
      ref={buttonRef}
    >
      {children}
    </button>
  );
}
