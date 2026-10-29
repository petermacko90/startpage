import { useRef, useState, type RefObject, type SetStateAction } from "react";
import type { Category, Link } from "../state/models";
import { UNDO_TIMEOUT } from "../constants";
import { undoState } from "../storage/localStorage/common";

export function useDeleteWithUndo<T extends Category | Link>({
  onDelete,
  getNeighborId,
  setIdToFocus,
  removeCustomIcons,
  addItemButtonRef,
}: {
  onDelete: (id: T["id"]) => void;
  getNeighborId: (index: number) => T["id"] | null;
  setIdToFocus: (value: SetStateAction<string | null>) => void;
  removeCustomIcons: (id: T["id"]) => void;
  addItemButtonRef: RefObject<HTMLButtonElement | null>;
}) {
  const [pendingDeletes, setPendingDeletes] = useState<T["id"][]>([]);
  const undoButtonRef = useRef<HTMLButtonElement | null>(null);
  const neighborIdRef = useRef<T["id"] | null>(null);
  const timersRef = useRef<Map<T["id"], number>>(new Map());

  function handleToastClose(id: T["id"]) {
    setPendingDeletes((prev) => prev.filter((pendingId) => pendingId !== id));
    removeCustomIcons(id);
    timersRef.current.delete(id);

    if (document.activeElement === undoButtonRef.current) {
      if (neighborIdRef.current) {
        setIdToFocus(neighborIdRef.current);
      } else {
        addItemButtonRef.current?.focus();
      }
    }

    neighborIdRef.current = null;
  }

  function deleteItem(id: T["id"], index: number) {
    neighborIdRef.current = getNeighborId(index);
    onDelete(id);
    setPendingDeletes((prev) => [...prev, id]);

    const timer = setTimeout(() => {
      handleToastClose(id);
    }, UNDO_TIMEOUT);

    timersRef.current.set(id, timer);
    setTimeout(() => undoButtonRef.current?.focus(), 50);
  }

  function undo(id: T["id"]) {
    const timer = timersRef.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }

    undoState();
    setPendingDeletes((prev) => prev.filter((pendingId) => pendingId !== id));
    setIdToFocus(id);
  }

  const isShowUndo = pendingDeletes.length > 0;
  const deletedItemId = pendingDeletes[pendingDeletes.length - 1] || null;

  return {
    isShowUndo,
    undoButtonRef,
    deleteItem,
    undo: () => deletedItemId && undo(deletedItemId),
  };
}
