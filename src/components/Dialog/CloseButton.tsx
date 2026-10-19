import type { MouseEventHandler } from "react";
import { Close } from "@material-symbols-svg/react/icons/close";
import "./CloseButton.css";

export default function CloseButton({
  action,
}: {
  action: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button title="Close" className="close-button" onClick={action}>
      <Close size={20} />
    </button>
  );
}
