import type { Dispatch, SetStateAction } from "react";
import { ChevronLeft } from "@material-symbols-svg/react/icons/chevron-left";
import { ChevronRight } from "@material-symbols-svg/react/icons/chevron-right";
import type { Category, Link } from "../../../state/models";
import Button from "../../Button/Button";
import OrderHint from "./OrderHint";
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
  let hintItems = [...items];

  if (itemId) {
    const oldIndex = hintItems.findIndex((i) => i.id === itemId);
    hintItems = hintItems.toSpliced(oldIndex, 1);
  }

  function isDisabled(): boolean {
    if (itemId && items.length <= 1) return true;
    if (!itemId && items.length <= 0) return true;
    return false;
  }

  return (
    <div className="order-input-container">
      <div className="order-form-field">
        <label htmlFor="order-input">Order:</label>
        <Button
          disabled={isDisabled()}
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
          disabled={isDisabled()}
          action={() => {
            if (value >= max) return;
            setValue((prevValue) => prevValue + 1);
          }}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
      <OrderHint value={value} items={hintItems} />
    </div>
  );
}
