import type { MouseEventHandler, ReactNode } from "react";
import "./Button.css";

export default function Button({
  action,
  children,
}: {
  action: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}) {
  return (
    <button type="button" className="button" onClick={action}>
      {children}
    </button>
  );
}
