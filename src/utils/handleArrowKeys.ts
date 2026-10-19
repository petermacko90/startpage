import type { KeyboardEvent, RefObject } from "react";
import {
  KEY_ARROW_DOWN,
  KEY_ARROW_LEFT,
  KEY_ARROW_RIGHT,
  KEY_ARROW_UP,
} from "../constants";

export function handleArrowKeys<
  T extends HTMLAnchorElement | HTMLButtonElement,
>(
  e: KeyboardEvent<HTMLDivElement>,
  containerRef: RefObject<HTMLDivElement | null>,
  itemSelector: string,
) {
  if (e.altKey || e.ctrlKey || e.metaKey) return;

  if (
    ![KEY_ARROW_LEFT, KEY_ARROW_RIGHT, KEY_ARROW_UP, KEY_ARROW_DOWN].includes(
      e.key,
    )
  ) {
    return;
  }

  const container = containerRef.current;
  if (!container) return;

  const currentItem = document.activeElement as T;
  if (!currentItem) return;

  const items = Array.from(container.querySelectorAll(itemSelector)) as T[];
  const currentIndex = items.indexOf(currentItem);
  if (currentIndex === -1) return;

  e.preventDefault();

  const gridComputedStyle = window.getComputedStyle(container);

  const gridTemplateColumns = gridComputedStyle.getPropertyValue(
    "grid-template-columns",
  );

  const columnsCount =
    gridTemplateColumns.split(" ").filter(Boolean).length || 1;

  let nextIndex = currentIndex;

  switch (e.key) {
    case KEY_ARROW_RIGHT:
      nextIndex = (currentIndex + 1) % items.length;
      break;
    case KEY_ARROW_LEFT:
      nextIndex = (currentIndex - 1 + items.length) % items.length;
      break;
    case KEY_ARROW_DOWN:
      if (currentIndex + columnsCount < items.length) {
        nextIndex = currentIndex + columnsCount;
      }
      break;
    case KEY_ARROW_UP:
      if (currentIndex - columnsCount >= 0) {
        nextIndex = currentIndex - columnsCount;
      }
      break;
  }

  items[nextIndex]?.focus();
}
