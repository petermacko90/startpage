import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { removeImage, saveImage } from "../../storage/indexedDB";
import { BACKGROUND_KEY, ERROR_TIMEOUT } from "../../constants";
import { useTimer } from "../../hooks/useTimer";
import Button from "../Button/Button";
import Form from "../Form/Form";
import Toast from "../Toast/Toast";
import Dialog from "../Dialog/Dialog";
import "./BackgroundUpload.css";

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
  focusRef: RefObject<HTMLInputElement | null>;
  close: () => void;
}) {
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { clearTimer, startTimer } = useTimer();

  async function handleBackgroundUpload(e: ChangeEvent<HTMLInputElement>) {
    setIsError(false);
    clearTimer();

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setIsError(true);
      setErrorMessage("Please select an image");
      startTimer(() => setIsError(false), ERROR_TIMEOUT);
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
      setIsError(true);
      setErrorMessage("Failed to set background");
      startTimer(() => setIsError(false), ERROR_TIMEOUT);
      return;
    }
  }

  async function handleBackgroundRemove() {
    setIsError(false);
    clearTimer();

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
      setIsError(true);
      setErrorMessage("Failed to remove background");
      startTimer(() => setIsError(false), ERROR_TIMEOUT);
      return;
    }
  }

  return (
    <Dialog
      closedby="closerequest"
      onClose={close}
      ref={dialogRef}
      title="Set Background"
    >
      <Form>
        <input
          type="file"
          accept="image/*"
          ref={focusRef}
          onChange={(e) => handleBackgroundUpload(e)}
        />
        {backgroundUrl && (
          <Button action={() => handleBackgroundRemove()}>
            Remove Background
          </Button>
        )}
      </Form>
      <Toast type="error" show={isError} text={errorMessage!} />
    </Dialog>
  );
}
