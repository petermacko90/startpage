import { useCallback, useState } from "react";
import type { Category, Link } from "../state/models";

export function useFocusById() {
  const [idToFocus, setIdToFocus] = useState<
    Link["id"] | Category["id"] | null
  >(null);

  const refCallback = useCallback(
    (node: HTMLElement | null, itemId: string) => {
      if (node && idToFocus === itemId) {
        node.focus();
        setIdToFocus(null);
      }
    },
    [idToFocus],
  );

  return { setIdToFocus, refCallback };
}
