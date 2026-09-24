import type { DialogHTMLAttributes, ReactNode, RefObject } from "react";
import { createPortal } from "react-dom";
import CloseButton from "../Button/CloseButton";
import "./Dialog.css";

export default function Dialog({
  closedby,
  ref,
  onClose,
  title,
  children,
  className,
}: {
  closedby: DialogHTMLAttributes<HTMLDialogElement>["closedby"];
  ref: RefObject<HTMLDialogElement | null>;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return createPortal(
    <dialog
      closedby={closedby}
      ref={ref}
      onClose={onClose}
      className={className}
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
