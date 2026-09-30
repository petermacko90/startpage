import type { MouseEventHandler } from "react";
import { EditSquare } from "@material-symbols-svg/react/icons/edit-square";
import "./EditButton.css";

export default function EditButton({
  action,
}: {
  action: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button className="edit-button" title="Edit" onClick={action}>
      <EditSquare size={20} />
    </button>
  );
}
