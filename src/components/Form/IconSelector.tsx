import type { Dispatch, SetStateAction } from "react";
import type { IconType } from "../../utils/getIconType";
import { t } from "../../utils/i18n";
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
      <div className="label">{t("iconTypeLabel")}</div>
      <label>
        <input
          type="radio"
          name="iconType"
          value="default"
          checked={iconType === "default"}
          onChange={() => setIconType("default")}
        />
        <span>{t("iconTypeDefault")}</span>
      </label>
      <label>
        <input
          type="radio"
          name="iconType"
          value="upload"
          checked={iconType === "upload"}
          onChange={() => setIconType("upload")}
        />
        <span>{t("uploadImage")}</span>
      </label>
      <label>
        <input
          type="radio"
          name="iconType"
          value="emoji"
          checked={iconType === "emoji"}
          onChange={() => setIconType("emoji")}
        />
        <span>{t("iconTypeUseEmoji")}</span>
      </label>
    </div>
  );
}
