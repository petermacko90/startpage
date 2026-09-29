import type { Dispatch, SetStateAction } from "react";
import { ChevronLeft } from "@material-symbols-svg/react/icons/chevron-left";
import { ChevronRight } from "@material-symbols-svg/react/icons/chevron-right";
import type { Category, Link } from "../../state/models";
import Button from "../Button/Button";
import "./OrderInput.css";

export default function OrderInput<T extends Category | Link>({
  id,
  value,
  max,
  setValue,
  items,
  itemId,
}: {
  id: string;
  value: number;
  max: number;
  setValue: Dispatch<SetStateAction<number>>;
  items: T[];
  itemId: T["id"] | null;
}) {
  const min = 0;

  function getOrderHint(): string {
    if (value === min) return "(first)";
    if (value === max) return "(last)";

    if (itemId) {
      const oldIndex = items.findIndex((link) => link.id === itemId);
      items.splice(oldIndex, 1);
    }

    const linkBefore = items[value - 1];
    const linkAfter = items[value];

    return `(between ${linkBefore.title} and ${linkAfter.title})`;
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
