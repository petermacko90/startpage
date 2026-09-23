import { useLayoutEffect, useRef } from "react";

export function useFlipAnimation<T>(dependencies: T[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rectsRef = useRef<Map<string, DOMRect>>(new Map());

  const captureFirst = () => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll("[data-flip-id]");
    const newRects = new Map<string, DOMRect>();

    cards.forEach((card) => {
      const id = card.getAttribute("data-flip-id");
      if (id) {
        newRects.set(id, card.getBoundingClientRect());
      }
    });

    rectsRef.current = newRects;
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll("[data-flip-id]");

    cards.forEach((card) => {
      const id = card.getAttribute("data-flip-id");
      if (!id) return;

      const firstRect = rectsRef.current.get(id);
      const lastRect = card.getBoundingClientRect();

      if (firstRect) {
        const deltaX = firstRect.left - lastRect.left;
        const deltaY = firstRect.top - lastRect.top;

        if (deltaX !== 0 || deltaY !== 0) {
          card.animate(
            [
              { transform: `translate(${deltaX}px, ${deltaY}px)` },
              { transform: "translate(0, 0)" },
            ],
            {
              duration: 250,
              easing: "cubic-bezier(0.2, 0, 0, 1)",
              fill: "both",
            },
          );
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { containerRef, captureFirst };
}
