import { useRef, useState, type RefObject, type SetStateAction } from "react";
import type { Category, Link } from "../state/models";
import { UNDO_TIMEOUT } from "../constants";
import { undoState } from "../storage/localStorage/common";
import { useTimer } from "./useTimer";

export function useDeleteWithUndo<T extends Category | Link>(
  onDelete: (id: T["id"]) => void,
  getNeighborId: (index: number) => T["id"] | null,
  setIdToFocus: (value: SetStateAction<string | null>) => void,
  addItemButtonRef: RefObject<HTMLButtonElement | null>,
) {
  const [isShowUndo, setIsShowUndo] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState<T["id"] | null>(null);
  const undoButtonRef = useRef<HTMLButtonElement | null>(null);
  const neighborIdRef = useRef<T["id"] | null>(null);
  const { clearTimer, startTimer } = useTimer();

  function handleToastClose() {
    setIsShowUndo(false);

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
    setDeletedItemId(id);
    onDelete(id);
    setIsShowUndo(true);
    startTimer(() => handleToastClose(), UNDO_TIMEOUT);
    setTimeout(() => undoButtonRef.current?.focus(), 50);
  }

  function undo() {
    clearTimer();
    undoState();
    setIsShowUndo(false);
    setIdToFocus(deletedItemId);
  }

  return {
    isShowUndo,
    undoButtonRef,
    deleteItem,
    undo,
  };
}
