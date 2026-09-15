import type { MouseEventHandler, ReactElement } from "react";
import type { MaterialSymbolsComponent } from "@material-symbols-svg/react";
import "./FloatingButton.css";

export default function FloatingButton({
  tooltip,
  action,
  position,
  type,
  children,
}: {
  tooltip: string;
  action: MouseEventHandler<HTMLButtonElement>;
  position: "left" | "right";
  type: "edit" | "delete";
  children: ReactElement<MaterialSymbolsComponent>;
}) {
  return (
    <button
      className={`floating-button ${position} ${type}`}
      title={tooltip}
      onClick={action}
    >
      {children}
    </button>
  );
}
