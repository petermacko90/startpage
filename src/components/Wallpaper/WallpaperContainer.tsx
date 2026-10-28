import { useEffect, useRef, useState } from "react";
import { Wallpaper } from "@material-symbols-svg/react/icons/wallpaper";
import { BACKGROUND_KEY } from "../../constants";
import { getImage } from "../../storage/indexedDB";
import WallpaperDialog from "./WallpaperDialog";
import "./WallpaperContainer.css";

export default function WallpaperContainer() {
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    async function loadBackground() {
      const blob = await getImage(BACKGROUND_KEY);
      if (blob) {
        objectUrl = URL.createObjectURL(blob);
        setBackgroundUrl(objectUrl);
      }
    }

    loadBackground();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  useEffect(() => {
    if (backgroundUrl) {
      document.body.style.backgroundImage = `url(${backgroundUrl})`;
    } else {
      document.body.style.backgroundImage = "none";
    }
  }, [backgroundUrl]);

  const [showDialog, setShowDialog] = useState(false);
  const wallpaperButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="wallpaper-container">
      <button
        className="expanding-button"
        onClick={() => setShowDialog(true)}
        ref={wallpaperButtonRef}
      >
        <span className="expanding-button-icon">
          <Wallpaper />
        </span>
        <span className="expanding-button-text">
          {backgroundUrl ? "Change Wallpaper" : "Add Wallpaper"}
        </span>
      </button>

      {showDialog && (
        <WallpaperDialog
          backgroundUrl={backgroundUrl}
          setBackgroundUrl={setBackgroundUrl}
          close={() => {
            setShowDialog(false);
            wallpaperButtonRef.current?.focus();
          }}
        />
      )}
    </div>
  );
}
