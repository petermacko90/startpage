import type { Dispatch, SetStateAction } from "react";
import type { IconType } from "../../utils/getIconType";

export default function IconSelector({
  iconType,
  setIconType,
}: {
  iconType: IconType;
  setIconType: Dispatch<SetStateAction<IconType>>;
}) {
  return (
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
  );
}
