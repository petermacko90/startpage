import Button from "../Button/Button";
import "./Toast.css";

interface ToastProps {
  show: boolean;
  text: string;
}

interface UndoToastProps extends ToastProps {
  type: "undo";
  undo: () => void;
}

interface ErrorToastProps extends ToastProps {
  type: "error";
}

export default function Toast(props: UndoToastProps | ErrorToastProps) {
  return (
    <div className={`toast ${props.show ? "show" : "hide"}`}>
      <span className={`toast-text${props.type === "error" ? " error" : ""}`}>
        {props.text}
      </span>
      {props.type === "undo" && (
        <Button action={() => props.undo()}>Undo</Button>
      )}
    </div>
  );
}
