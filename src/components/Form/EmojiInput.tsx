import type { Dispatch, SetStateAction } from "react";
import { KEY_BACKSPACE } from "../../constants";
import { getLastGrapheme } from "../../utils/emojiUtils";
import { t } from "../../utils/i18n";
import FormField from "./FormField";
import TextInput from "./TextInput";

export default function EmojiInput({
  emoji,
  setEmoji,
  emojiError,
  setEmojiError,
  handleSave,
}: {
  emoji: string | null;
  setEmoji: Dispatch<SetStateAction<string | null>>;
  emojiError: string;
  setEmojiError: Dispatch<SetStateAction<string>>;
  handleSave: () => void;
}) {
  return (
    <FormField id="emoji" labelText={t("emoji")} error={emojiError}>
      <TextInput
        id="emoji"
        value={emoji ?? ""}
        onChange={(e) => {
          setEmoji(getLastGrapheme(e.target.value));
          setEmojiError("");
        }}
        onPressEnter={handleSave}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (
            e.key === KEY_BACKSPACE &&
            e.currentTarget.selectionStart === e.currentTarget.selectionEnd
          ) {
            e.preventDefault();
            setEmoji("");
          }
        }}
      />
    </FormField>
  );
}
