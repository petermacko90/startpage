import type { ReactElement, RefObject } from "react";
import type { MaterialSymbolsComponent } from "@material-symbols-svg/react";
import "./AddImportCategoryButton.css";

export default function AddImportCategoryButton({
  action,
  icon,
  text,
  buttonRef,
}: {
  action: () => void;
  icon: ReactElement<MaterialSymbolsComponent>;
  text: string;
  buttonRef?: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      className="add-import-category category-item"
      onClick={action}
      ref={buttonRef}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}
