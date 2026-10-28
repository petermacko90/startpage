import type {
  DialogHTMLAttributes,
  KeyboardEventHandler,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import CloseButton from "./CloseButton";
import "./Dialog.css";

export default function Dialog({
  ref,
  onClose,
  onCloseButtonClick,
  title,
  children,
  closedby = "closerequest",
  className,
  onKeyDown,
}: {
  ref: (node: HTMLDialogElement | null) => void;
  onClose: () => void;
  onCloseButtonClick: () => void;
  title: string;
  children: ReactNode;
  closedby?: DialogHTMLAttributes<HTMLDialogElement>["closedby"];
  className?: string;
  onKeyDown?: KeyboardEventHandler<HTMLDialogElement>;
}) {
  return createPortal(
    <dialog
      closedby={closedby}
      ref={ref}
      onClose={onClose}
      className={className}
      onKeyDown={onKeyDown}
    >
      <div className="dialog-header">
        <div></div>
        <div className="dialog-title overflow">{title}</div>
        <CloseButton action={() => onCloseButtonClick()} />
      </div>
      <div className="dialog-content">{children}</div>
    </dialog>,
    document.body,
  );
}
