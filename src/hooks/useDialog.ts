import { useCallback, useRef, type RefObject } from "react";

export function useDialog(
  itemSelector?: string,
  fallbackRef?: RefObject<HTMLButtonElement | null>,
) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const setDialogRef = useCallback(
    (node: HTMLDialogElement | null) => {
      if (node) {
        dialogRef.current = node;

        if (!node.open) {
          node.showModal();
        }

        if (!itemSelector) return;

        const elementToFocus: HTMLAnchorElement | HTMLInputElement | null =
          node.querySelector<HTMLAnchorElement | HTMLInputElement>(
            itemSelector,
          );

        elementToFocus?.focus();

        if (!elementToFocus) {
          fallbackRef?.current?.focus();
        }
      } else {
        dialogRef.current = null;
      }
    },
    [itemSelector, fallbackRef],
  );

  return { setDialogRef, dialogRef };
}
