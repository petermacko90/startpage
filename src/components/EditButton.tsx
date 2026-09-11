import type { Dispatch, SetStateAction } from "react";
import { Edit } from "@material-symbols-svg/react/icons/edit";
import { EditOff } from "@material-symbols-svg/react/icons/edit-off";
import "./EditButton.css";

export default function EditButton({
  isEditMode,
  setIsEditMode,
}: {
  isEditMode: boolean;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <button
      className="edit-button"
      onClick={() => setIsEditMode((prevValue) => !prevValue)}
    >
      <span className="edit-button-icon">
        {isEditMode ? <EditOff /> : <Edit />}
      </span>
      <span className="edit-button-text">{isEditMode ? "Done" : "Edit"}</span>
    </button>
  );
}
