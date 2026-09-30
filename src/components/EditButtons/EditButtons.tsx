import { useEffect, useState } from "react";
import { Wallpaper } from "@material-symbols-svg/react/icons/wallpaper";
import { BACKGROUND_KEY } from "../../constants";
import { getImage } from "../../storage/indexedDB";
import { useDialog } from "../../hooks/useDialog";
import BackgroundUpload from "../BackgroundUpload/BackgroundUpload";
import "./EditButtons.css";

export default function EditButtons() {
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
      <button className="expanding-button" onClick={() => setShowDialog(true)}>
        <span className="expanding-button-icon">
          <Wallpaper />
        </span>
        <span className="expanding-button-text">Set Background</span>
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
