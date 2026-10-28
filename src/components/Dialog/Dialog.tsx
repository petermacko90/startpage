import type {
  DialogHTMLAttributes,
  KeyboardEventHandler,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import CloseButton from "./CloseButton";
import "./Dialog.css";

export default function Dialog({
  closedby,
  ref,
  onClose,
  title,
  children,
  className,
  onKeyDown,
}: {
  closedby: DialogHTMLAttributes<HTMLDialogElement>["closedby"];
  ref: (node: HTMLDialogElement | null) => void;
  onClose: () => void;
  title: string;
  children: ReactNode;
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
        <CloseButton action={() => onClose()} />
      </div>
      <div className="dialog-content">{children}</div>
    </dialog>,
    document.body,
  );
}
