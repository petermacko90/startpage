import {
  type ChangeEvent,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { createPortal } from "react-dom";
import { removeImage, saveImage } from "../../indexedDB";
import { BACKGROUND_KEY } from "../../constants";
import Button from "../Button/Button";
import CloseButton from "../Button/CloseButton";
import Form from "../Form/Form";

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
  async function handleBackgroundUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      console.error("not an image");
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
      console.error("error uploading background", error);
    }
  }

  async function handleBackgroundRemove() {
    try {
      await removeImage(BACKGROUND_KEY);

      setBackgroundUrl((prevValue) => {
        if (prevValue) {
          URL.revokeObjectURL(prevValue);
        }
        return null;
      });
    } catch (error) {
      console.error("error removing background", error);
    }
  }

  return createPortal(
    <dialog closedby="any" ref={dialogRef} onClose={close}>
      <div className="dialog-header">
        <div></div>
        <div className="dialog-title overflow">Upload Background</div>
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
    </dialog>,
    document.body,
  );
}
