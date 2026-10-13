import type { Dispatch, SetStateAction } from "react";
import { ChevronLeft } from "@material-symbols-svg/react/icons/chevron-left";
import { ChevronRight } from "@material-symbols-svg/react/icons/chevron-right";
import type { Category, Link } from "../../state/models";
import { NO_TITLE } from "../../constants";
import Button from "../Button/Button";
import "./OrderInput.css";

export default function OrderInput<T extends Category | Link>({
  value,
  max,
  setValue,
  items,
  itemId,
}: {
  value: number;
  max: number;
  setValue: Dispatch<SetStateAction<number>>;
  items: T[];
  itemId: T["id"] | null;
}) {
  const min = 0;

  function getOrderHint(): string {
    if (value === min) return `${value + 1} (first)`;
    if (value === max) return `${value + 1} (last)`;

    let hintItems = [...items];

    if (itemId) {
      const oldIndex = hintItems.findIndex((i) => i.id === itemId);
      hintItems = hintItems.toSpliced(oldIndex, 1);
    }

    const itemBefore = hintItems[value - 1];
    const itemAfter = hintItems[value];

    return `${value + 1} (between ${itemBefore.title || NO_TITLE} and ${itemAfter?.title || NO_TITLE})`;
  }

  return (
    <div className="order-input-container">
      <div className="order-form-field">
        <label htmlFor="order-input">Order:</label>
        <Button
          action={() => {
            if (value <= min) return;
            setValue((prevValue) => prevValue - 1);
          }}
        >
          <ChevronLeft size={16} />
        </Button>
        <input
          type="number"
          id="order-input"
          value={value}
          min={min}
          max={max}
          onChange={(e) => setValue(Number(e.target.value))}
          hidden
        />
        <Button
          action={() => {
            if (value >= max) return;
            setValue((prevValue) => prevValue + 1);
          }}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
      <div className="order-hint overflow" title={getOrderHint()}>
        {getOrderHint()}
      </div>
    </div>
  );
}
