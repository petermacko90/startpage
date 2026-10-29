import { useEffect, type RefObject } from "react";

export function useFocusAfterLoading({
  isLoading,
  containerRef,
  itemSelector,
  fallbackRef,
}: {
  isLoading: boolean;
  containerRef: RefObject<HTMLDivElement | HTMLDialogElement | null>;
  itemSelector: string;
  fallbackRef?: RefObject<HTMLButtonElement | null>;
}) {
  useEffect(() => {
    if (isLoading || !containerRef.current) return;

    const firstItem = containerRef.current.querySelector(
      itemSelector,
    ) as HTMLButtonElement;

    if (firstItem) {
      firstItem.focus();
    } else {
      fallbackRef?.current?.focus();
    }
  }, [isLoading, containerRef, itemSelector, fallbackRef]);
}
