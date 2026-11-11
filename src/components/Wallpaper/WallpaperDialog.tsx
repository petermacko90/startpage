import {
  useRef,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { removeImage, saveImage } from "../../storage/indexedDB";
import { BACKGROUND_KEY, IMAGE_FILETYPE } from "../../constants";
import { t } from "../../utils/i18n";
import { useDialog } from "../../hooks/useDialog";
import { useErrorToast } from "../../hooks/useErrorToast";
import Button from "../Button/Button";
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
      showErrorToast(t("pleaseSelectImage"));
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
      console.error(t("failedToSetWallpaper"), error);
      showErrorToast(t("failedToSetWallpaper"));
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
      console.error(t("failedToRemoveWallpaper"), error);
      showErrorToast(t("failedToRemoveWallpaper"));
      return;
    }
  }

  return (
    <Dialog
      onClose={close}
      onCloseButtonClick={() => dialogRef.current?.close()}
      ref={setDialogRef}
      title={t("wallpaperTitle")}
    >
      <ImageUpload
        label={t("uploadImage")}
        showDelete={backgroundUrl !== null}
        deleteLabel={t("wallpaperRemove")}
        handleUpload={handleBackgroundUpload}
        handleDelete={() => handleBackgroundRemove()}
        focusRef={uploadButtonRef}
      >
        <Button action={close}>Close</Button>
      </ImageUpload>
      <Toast type="error" show={isError} text={errorMessage} />
    </Dialog>
  );
}
