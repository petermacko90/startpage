import type { Dispatch, SetStateAction } from "react";
import type { IconType } from "../../utils/getIconType";
import "./IconSelector.css";

export default function IconSelector({
  iconType,
  setIconType,
}: {
  iconType: IconType;
  setIconType: Dispatch<SetStateAction<IconType>>;
}) {
  return (
    <div className="form-field radio-group">
      <div className="label">Icon:</div>
      <label>
        <input
          type="radio"
          name="iconType"
          value="default"
          checked={iconType === "default"}
          onChange={() => setIconType("default")}
        />
        <span>Defaut</span>
      </label>
      <label>
        <input
          type="radio"
          name="iconType"
          value="upload"
          checked={iconType === "upload"}
          onChange={() => setIconType("upload")}
        />
        <span>Upload Image</span>
      </label>
      <label>
        <input
          type="radio"
          name="iconType"
          value="emoji"
          checked={iconType === "emoji"}
          onChange={() => setIconType("emoji")}
        />
        <span>Use Emoji</span>
      </label>
    </div>
  );
}
