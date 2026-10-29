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
  const neighborsMapRef = useRef<Map<T["id"], T["id"] | null>>(new Map());
  const timersRef = useRef<Map<T["id"], number>>(new Map());

  function handleToastClose(id: T["id"]) {
    const specificNeighborId = neighborsMapRef.current.get(id);
    removeCustomIcons(id);
    timersRef.current.delete(id);
    neighborsMapRef.current.delete(id);

    setPendingDeletes((prev) => {
      const nextPendingDeletes = prev.filter((pendingId) => pendingId !== id);

      if (document.activeElement === undoButtonRef.current) {
        if (nextPendingDeletes.length > 0) {
          return nextPendingDeletes;
        }

        if (specificNeighborId) {
          setIdToFocus(specificNeighborId);
        } else {
          addItemButtonRef.current?.focus();
        }
      }

      return nextPendingDeletes;
    });
  }

  function deleteItem(id: T["id"], index: number) {
    const neighborId = getNeighborId(index);
    neighborsMapRef.current.set(id, neighborId);
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
