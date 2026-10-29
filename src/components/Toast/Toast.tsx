import type { RefObject } from "react";
import Button from "../Button/Button";
import "./Toast.css";

interface ToastProps {
  show: boolean;
  text: string;
}

interface UndoToastProps extends ToastProps {
  type: "undo";
  undo: () => void;
  undoButtonRef: RefObject<HTMLButtonElement | null>;
}

interface ErrorToastProps extends ToastProps {
  type: "error";
}

export default function Toast(props: UndoToastProps | ErrorToastProps) {
  return (
    <div
      className={`toast ${props.show ? "show" : "hide"}${props.type === "error" ? " error" : ""}`}
    >
      <span className="toast-text">{props.text}</span>
      {props.type === "undo" && (
        <Button action={() => props.undo()} buttonRef={props.undoButtonRef}>
          Undo
        </Button>
      )}
    </div>
  );
}
