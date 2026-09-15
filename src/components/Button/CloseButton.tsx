import type { MouseEventHandler } from "react";
import "./CloseButton.css";

export default function CloseButton({
  action,
}: {
  action: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button title="Close" className="close-button" onClick={action}>
      &times;
    </button>
  );
}
