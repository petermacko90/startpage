import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Edit } from "@material-symbols-svg/react/icons/edit";
import { EditOff } from "@material-symbols-svg/react/icons/edit-off";
import { Wallpaper } from "@material-symbols-svg/react/icons/wallpaper";
import { BACKGROUND_KEY } from "../../constants";
import { getImage } from "../../storage/indexedDB";
import { useDialog } from "../../hooks/useDialog";
import BackgroundUpload from "../BackgroundUpload/BackgroundUpload";
import "./EditButtons.css";

export default function EditButtons({
  isEditMode,
  setIsEditMode,
}: {
  isEditMode: boolean;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
}) {
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadBackground() {
      const blob = await getImage(BACKGROUND_KEY);
      if (blob) {
        const objectUrl = URL.createObjectURL(blob);
        setBackgroundUrl(objectUrl);
      }
    }

    loadBackground();
  }, []);

  useEffect(() => {
    if (backgroundUrl) {
      document.body.style.backgroundImage = `url(${backgroundUrl})`;
    } else {
      document.body.style.backgroundImage = "none";
    }
  }, [backgroundUrl]);

  const { dialogRef, focusRef, setShowDialog, showDialog } = useDialog();

  return (
    <div className="edit-buttons-container">
      <button
        className="edit-button"
        onClick={() => setIsEditMode((prevValue) => !prevValue)}
      >
        <span className="edit-button-icon">
          {isEditMode ? <EditOff /> : <Edit />}
        </span>
        <span className="edit-button-text">{isEditMode ? "Done" : "Edit"}</span>
      </button>

      <button className="edit-button" onClick={() => setShowDialog(true)}>
        <span className="edit-button-icon">
          <Wallpaper />
        </span>
        <span className="edit-button-text">Set Background</span>
      </button>

      {showDialog && (
        <BackgroundUpload
          backgroundUrl={backgroundUrl}
          setBackgroundUrl={setBackgroundUrl}
          dialogRef={dialogRef}
          focusRef={focusRef}
          close={() => setShowDialog(false)}
        />
      )}
    </div>
  );
}
