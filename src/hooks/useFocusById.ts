import { useEffect, useState } from "react";
import type { Category, Link } from "../state/models";

export function useFocusById(item: "link" | "category") {
  const [idToFocus, setIdToFocus] = useState<
    Link["id"] | Category["id"] | null
  >(null);

  useEffect(() => {
    if (idToFocus) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`${item}-${idToFocus}`);
        if (element) {
          (element as HTMLElement).focus();
        }
        setIdToFocus(null);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [item, idToFocus]);

  return setIdToFocus;
}
