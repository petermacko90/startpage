import {
  useRef,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { removeImage, saveImage } from "../../storage/indexedDB";
import { BACKGROUND_KEY, IMAGE_FILETYPE } from "../../constants";
import { useDialog } from "../../hooks/useDialog";
import { useErrorToast } from "../../hooks/useErrorToast";
import Dialog from "../Dialog/Dialog";
import ImageUpload from "../Form/ImageUpload";
import Toast from "../Toast/Toast";

export default function WallpaperDialog({
  backgroundUrl,
  setBackgroundUrl,
  close,
}: {
  backgroundUrl: string | null;
  setBackgroundUrl: Dispatch<SetStateAction<string | null>>;
  close: () => void;
}) {
  const { isError, errorMessage, showErrorToast, clearError } = useErrorToast();
  const uploadButtonRef = useRef<HTMLLabelElement | null>(null);
  const { dialogRef, setDialogRef } = useDialog(".image-upload");

  async function handleBackgroundUpload(e: ChangeEvent<HTMLInputElement>) {
    clearError();

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith(IMAGE_FILETYPE)) {
      showErrorToast("Please select an image");
      return;
    }

    try {
      await saveImage(BACKGROUND_KEY, file);

      setBackgroundUrl((prevValue) => {
        if (prevValue) {
          URL.revokeObjectURL(prevValue);
        }
        return URL.createObjectURL(file);
      });
    } catch (error) {
      console.error("failed to set wallpaper", error);
      showErrorToast("Failed to set wallpaper");
      return;
    }
  }

  async function handleBackgroundRemove() {
    clearError();

    try {
      await removeImage(BACKGROUND_KEY);
      uploadButtonRef.current?.focus();

      setBackgroundUrl((prevValue) => {
        if (prevValue) {
          URL.revokeObjectURL(prevValue);
        }
        return null;
      });
    } catch (error) {
      console.error("failed to remove wallpaper", error);
      showErrorToast("Failed to remove wallpaper");
      return;
    }
  }

  return (
    <Dialog
      onClose={close}
      onCloseButtonClick={() => dialogRef.current?.close()}
      ref={setDialogRef}
      title="Wallpaper"
    >
      <ImageUpload
        label="Upload Image"
        showDelete={backgroundUrl !== null}
        deleteLabel="Remove Wallpaper"
        handleUpload={handleBackgroundUpload}
        handleDelete={() => handleBackgroundRemove()}
        focusRef={uploadButtonRef}
      />
      <Toast type="error" show={isError} text={errorMessage} />
    </Dialog>
  );
}
