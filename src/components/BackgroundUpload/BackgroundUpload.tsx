import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { createPortal } from "react-dom";
import { removeImage, saveImage } from "../../indexedDB";
import { BACKGROUND_KEY, ERROR_TIMEOUT } from "../../constants";
import Button from "../Button/Button";
import CloseButton from "../Button/CloseButton";
import Form from "../Form/Form";
import Toast from "../Toast/Toast";
import "./BackgroundUpload.css";

export default function BackgroundUpload({
  backgroundUrl,
  setBackgroundUrl,
  dialogRef,
  close,
}: {
  backgroundUrl: string | null;
  setBackgroundUrl: Dispatch<SetStateAction<string | null>>;
  dialogRef: RefObject<HTMLDialogElement | null>;
  close: () => void;
}) {
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const errorTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  async function handleBackgroundUpload(e: ChangeEvent<HTMLInputElement>) {
    setIsError(false);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setIsError(true);
      setErrorMessage("Please select an image");
      errorTimerRef.current = setTimeout(
        () => setIsError(false),
        ERROR_TIMEOUT,
      );
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
      errorTimerRef.current = setTimeout(
        () => setIsError(false),
        ERROR_TIMEOUT,
      );
      return;
    }
  }

  async function handleBackgroundRemove() {
    setIsError(false);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);

    try {
      await removeImage(BACKGROUND_KEY);

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
      errorTimerRef.current = setTimeout(
        () => setIsError(false),
        ERROR_TIMEOUT,
      );
      return;
    }
  }

  return createPortal(
    <dialog closedby="any" ref={dialogRef} onClose={close}>
      <div className="dialog-header">
        <div></div>
        <div className="dialog-title overflow">Set Background</div>
        <CloseButton action={() => close()} />
      </div>
      <div className="dialog-content">
        <Form>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleBackgroundUpload(e)}
          />
          {backgroundUrl && (
            <Button action={() => handleBackgroundRemove()}>
              Remove Background
            </Button>
          )}
        </Form>
      </div>
      <Toast type="error" show={isError} text={errorMessage!} />
    </dialog>,
    document.body,
  );
}
