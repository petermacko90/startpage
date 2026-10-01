import type { MouseEventHandler, ReactNode, Ref } from "react";
import "./Button.css";

export default function Button({
  action,
  children,
  disabled,
  ref,
}: {
  action: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  disabled?: boolean;
  ref?: Ref<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      className="button"
      onClick={action}
      disabled={disabled}
      ref={ref}
    >
      {children}
    </button>
  );
}
