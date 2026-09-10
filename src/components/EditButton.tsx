import type { Dispatch, SetStateAction } from "react";
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
      <span className="edit-button-icon">✏️</span>
      <span className="edit-button-text">{isEditMode ? "Done" : "Edit"}</span>
    </button>
  );
}
