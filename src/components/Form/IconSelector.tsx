import type { ChangeEvent, Dispatch, RefObject, SetStateAction } from "react";
import type { Category, Link } from "../../state/models";
import type { IconType } from "../../utils/getIconType";
import FormField from "./FormField";
import ImageUpload from "./ImageUpload";
import TextInput from "./TextInput";

export default function IconSelector<T extends Category | Link>({
  iconType,
  setIconType,
  customIconId,
  uploadedImage,
  uploadedImageUrl,
  savedIconUrl,
  handleIconUpload,
  handleIconDelete,
  uploadIconRef,
  customIconError,
  emoji,
  setEmoji,
  emojiError,
  setEmojiError,
  handleSave,
}: {
  iconType: IconType;
  setIconType: Dispatch<SetStateAction<IconType>>;
  customIconId: T["customIconId"] | undefined;
  uploadedImage: File | null;
  uploadedImageUrl: string | null;
  savedIconUrl: string | null;
  handleIconUpload: (e: ChangeEvent<HTMLInputElement, Element>) => void;
  handleIconDelete: () => void;
  uploadIconRef: RefObject<HTMLElement | null>;
  customIconError: string;
  emoji: string | null;
  setEmoji: Dispatch<SetStateAction<string | null>>;
  emojiError: string;
  setEmojiError: Dispatch<SetStateAction<string>>;
  handleSave: () => void;
}) {
  return (
    <>
      <div className="form-field">
        <div className="label">Icon:</div>
        <label>
          <input
            type="radio"
            name="iconType"
            value="default"
            checked={iconType === "default"}
            onChange={() => setIconType("default")}
          />
          Defaut
        </label>
        <label>
          <input
            type="radio"
            name="iconType"
            value="upload"
            checked={iconType === "upload"}
            onChange={() => setIconType("upload")}
          />
          Upload Image
        </label>
        <label>
          <input
            type="radio"
            name="iconType"
            value="emoji"
            checked={iconType === "emoji"}
            onChange={() => setIconType("emoji")}
          />
          Use Emoji
        </label>
      </div>
      {iconType === "upload" && (
        <>
          <ImageUpload
            label="Upload Icon"
            showDelete={!!customIconId || uploadedImage !== null}
            deleteLabel="Remove Icon"
            previewUrl={uploadedImageUrl ?? savedIconUrl}
            handleUpload={handleIconUpload}
            handleDelete={handleIconDelete}
            focusRef={uploadIconRef}
          />
          {customIconError.length > 0 && (
            <div className="error-text">{customIconError}</div>
          )}
        </>
      )}
      {iconType === "emoji" && (
        <FormField id="emoji" labelText="Emoji:" error={emojiError}>
          <TextInput
            id="emoji"
            value={emoji ?? ""}
            onChange={(e) => {
              setEmoji(e.target.value);
              setEmojiError("");
            }}
            onPressEnter={handleSave}
          />
        </FormField>
      )}
    </>
  );
}
