import Button from "../Button/Button";
import "./UndoToast.css";

export default function UndoToast({
  show,
  text,
  undo,
}: {
  show: boolean;
  text: string;
  undo: () => void;
}) {
  return (
    <div className={`undo-toast ${show ? "show" : "hide"}`}>
      <span className="undo-text">{text}</span>
      <Button action={() => undo()}>Undo</Button>
    </div>
  );
}
