import {
  type ChangeEvent,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { removeImage, saveImage } from "../../storage/indexedDB";
import { BACKGROUND_KEY, IMAGE_FILETYPE } from "../../constants";
import { useErrorToast } from "../../hooks/useToastError";
import Dialog from "../Dialog/Dialog";
import ImageUpload from "../Form/ImageUpload";
import Toast from "../Toast/Toast";

export default function BackgroundUpload({
  backgroundUrl,
  setBackgroundUrl,
  dialogRef,
  focusRef,
  close,
}: {
  backgroundUrl: string | null;
  setBackgroundUrl: Dispatch<SetStateAction<string | null>>;
  dialogRef: RefObject<HTMLDialogElement | null>;
  focusRef: RefObject<HTMLElement | null>;
  close: () => void;
}) {
  const { isError, errorMessage, showErrorToast, clearError } = useErrorToast();

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
      console.error("failed to set background", error);
      showErrorToast("Failed to set background");
      return;
    }
  }

  async function handleBackgroundRemove() {
    clearError();

    try {
      await removeImage(BACKGROUND_KEY);
      focusRef.current?.focus();

      setBackgroundUrl((prevValue) => {
        if (prevValue) {
          URL.revokeObjectURL(prevValue);
        }
        return null;
      });
    } catch (error) {
      console.error("failed to remove background", error);
      showErrorToast("Failed to remove background");
      return;
    }
  }

  return (
    <Dialog
      closedby="closerequest"
      onClose={close}
      ref={dialogRef}
      title="Set Wallpaper"
    >
      <ImageUpload
        label="Upload Wallpaper"
        showDelete={backgroundUrl !== null}
        deleteLabel="Remove Wallpaper"
        handleUpload={handleBackgroundUpload}
        handleDelete={() => handleBackgroundRemove()}
        focusRef={focusRef}
      />
      <Toast type="error" show={isError} text={errorMessage} />
    </Dialog>
  );
}
