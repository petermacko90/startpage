import Button from "../Button/Button";
import "./UndoToast.css";

export default function UndoToast({
  text,
  undo,
}: {
  text: string;
  undo: () => void;
}) {
  return (
    <div className="undo-toast">
      <span className="undo-text">{text}</span>
      <Button action={() => undo()}>Undo</Button>
    </div>
  );
}
