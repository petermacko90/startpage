import type { Category, Link } from "../../../state/models";
import { t } from "../../../utils/i18n";
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
      ? t("orderHintItemBetween", [
          value + 1,
          getTitle(itemBefore),
          getTitle(itemAfter),
        ])
      : itemBefore
        ? t("orderHintItemLast", [value + 1, getTitle(itemBefore)])
        : t("orderHintItemFirst", getTitle(itemAfter));

  function getTitle(item: T): string {
    return item.title || t("noTitle");
  }

  return (
    <div className="order-hint overflow" title={titleText}>
      {value + 1}{" "}
      {itemBefore && itemAfter ? (
        <>
          ({t("orderHintBetween")} <strong>{getTitle(itemBefore)}</strong>{" "}
          {t("orderHintAnd")} <strong>{getTitle(itemAfter)}</strong>)
        </>
      ) : itemBefore ? (
        <>
          ({t("orderHintAfter")} <strong>{getTitle(itemBefore)}</strong>)
        </>
      ) : (
        <>
          ({t("orderHintBefore")} <strong>{getTitle(itemAfter)}</strong>)
        </>
      )}
    </div>
  );
}
