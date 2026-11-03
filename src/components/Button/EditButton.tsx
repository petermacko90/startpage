import type { MouseEventHandler } from "react";
import { EditSquare } from "@material-symbols-svg/react/icons/edit-square";
import { t } from "../../utils/i18n";
import "./EditButton.css";

export default function EditButton({
  action,
}: {
  action: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button className="edit-button" title={t("edit")} onClick={action}>
      <EditSquare size={20} />
    </button>
  );
}
