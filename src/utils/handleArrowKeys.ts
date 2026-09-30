import type { KeyboardEvent, RefObject } from "react";

export function handleArrowKeys<
  T extends HTMLAnchorElement | HTMLButtonElement,
>(
  e: KeyboardEvent<HTMLDivElement>,
  containerRef: RefObject<HTMLDivElement | null>,
  itemSelector: string,
) {
  if (e.altKey || e.ctrlKey || e.metaKey) return;

  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

  const container = containerRef.current;
  if (!container) return;

  const currentItem = document.activeElement as T;
  if (!currentItem) return;

  const items = Array.from(container.querySelectorAll(itemSelector)) as T[];

  const currentIndex = items.indexOf(currentItem);
  if (currentIndex === -1) return;

  e.preventDefault();

  const nextIndex =
    e.key === "ArrowRight"
      ? (currentIndex + 1) % items.length
      : (currentIndex - 1 + items.length) % items.length;

  items[nextIndex]?.focus();
}
