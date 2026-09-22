import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Edit } from "@material-symbols-svg/react/icons/edit";
import { EditOff } from "@material-symbols-svg/react/icons/edit-off";
import { Wallpaper } from "@material-symbols-svg/react/icons/wallpaper";
import { BACKGROUND_KEY } from "../../constants";
import { getImage } from "../../indexedDB";
import Button from "../Button/Button";
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

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!dialogRef.current) return;

    if (showDialog) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [showDialog]);

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
      {isEditMode && (
        <Button action={() => setShowDialog(true)}>
          <span className="edit-button-icon">
            <Wallpaper />
          </span>
          <span>Set Background</span>
        </Button>
      )}
      {showDialog && (
        <BackgroundUpload
          backgroundUrl={backgroundUrl}
          setBackgroundUrl={setBackgroundUrl}
          dialogRef={dialogRef}
          close={() => setShowDialog(false)}
        />
      )}
    </div>
  );
}
