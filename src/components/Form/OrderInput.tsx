import type { Dispatch, SetStateAction } from "react";
import { ChevronLeft } from "@material-symbols-svg/react/icons/chevron-left";
import { ChevronRight } from "@material-symbols-svg/react/icons/chevron-right";
import type { Link } from "../../state/models";
import Button from "../Button/Button";
import "./OrderInput.css";

export default function OrderInput({
  id,
  value,
  max,
  setValue,
  links,
  linkId,
  isEditing,
}: {
  id: string;
  value: number;
  max: number;
  setValue: Dispatch<SetStateAction<number>>;
  links: Link[];
  linkId: Link["id"] | null;
  isEditing: boolean;
}) {
  const min = 0;

  function getOrderHint(): string {
    if (value === min) return "(first)";
    if (value === max) return "(last)";

    if (isEditing) {
      const oldIndex = links.findIndex((link) => link.id === linkId);
      links.splice(oldIndex, 1);
    }

    const linkBefore = links[value - 1];
    const linkAfter = links[value];

    return `(between ${linkBefore.text} and ${linkAfter.text})`;
  }

  return (
    <div className="order-input">
      <Button
        action={() => setValue((prevValue) => prevValue - 1)}
        disabled={value <= min}
      >
        <ChevronLeft size={16} />
      </Button>
      <input
        type="number"
        id={id}
        value={value}
        min={min}
        max={max}
        onChange={(e) => setValue(Number(e.target.value))}
        hidden
      />
      <Button
        action={() => setValue((prevValue) => prevValue + 1)}
        disabled={value >= max}
      >
        <ChevronRight size={16} />
      </Button>
      <span className="hint">{`${value + 1} ${getOrderHint()}`}</span>
    </div>
  );
}
