import type { MouseEventHandler, ReactNode } from "react";
import "./Button.css";

export default function Button({
  action,
  children,
  disabled,
}: {
  action: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="button"
      onClick={action}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
