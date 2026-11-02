import type { Dispatch, SetStateAction } from "react";
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
          setEmoji(e.target.value);
          setEmojiError("");
        }}
        onPressEnter={handleSave}
      />
    </FormField>
  );
}
