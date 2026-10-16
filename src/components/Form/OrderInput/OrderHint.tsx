import { NO_TITLE } from "../../../constants";
import type { Category, Link } from "../../../state/models";
import "./OrderHint.css";

export default function OrderHint<T extends Category | Link>({
  value,
  items,
}: {
  value: number;
  items: T[];
}) {
  const itemBefore = items[value - 1];
  const itemAfter = items[value];
  if (!itemBefore && !itemAfter) return null;

  const titleText =
    itemBefore && itemAfter
      ? `${value + 1} (between ${getTitle(itemBefore)} and ${getTitle(itemAfter)})`
      : itemBefore
        ? `${value + 1} (after ${getTitle(itemBefore)})`
        : `${value + 1} (before ${getTitle(itemAfter)})`;

  function getTitle(item: T): string {
    return item.title || NO_TITLE;
  }

  return (
    <div className="order-hint overflow" title={titleText}>
      {value + 1}{" "}
      {itemBefore && itemAfter ? (
        <>
          (between <strong>{getTitle(itemBefore)}</strong> and{" "}
          <strong>{getTitle(itemAfter)}</strong>)
        </>
      ) : itemBefore ? (
        <>
          (after <strong>{getTitle(itemBefore)}</strong>)
        </>
      ) : (
        <>
          (before <strong>{getTitle(itemAfter)}</strong>)
        </>
      )}
    </div>
  );
}
