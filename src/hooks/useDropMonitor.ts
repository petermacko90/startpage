import { useEffect, useRef } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { Category, Link } from "../state/models";
import { reorderItems } from "../storage/localStorage/common";

export function useDropMonitor<T extends Category | Link>(
  items: T[],
  captureFirst: () => void,
  updateAction: (items: T[]) => void,
  disabled: boolean = false,
) {
  const eventCache = useRef({ items, captureFirst, updateAction });

  useEffect(() => {
    eventCache.current = { items, captureFirst, updateAction };
  }, [items, captureFirst, updateAction]);

  useEffect(() => {
    if (disabled) return;

    return monitorForElements({
      onDrop({ source, location }) {
        const dropTargets = location.current.dropTargets;
        if (dropTargets.length === 0) return;

        const destination = dropTargets[0];
        const sourceId = source.data.id as string;
        const destinationId = destination.data.id as string;
        if (sourceId === destinationId) return;

        const {
          items: currentItems,
          captureFirst: currentCaptureFirst,
          updateAction: currentUpdateAction,
        } = eventCache.current;

        const oldIndex = currentItems.findIndex((c) => c.id === sourceId);
        const newIndex = currentItems.findIndex((c) => c.id === destinationId);

        if (oldIndex !== -1 && newIndex !== -1) {
          currentCaptureFirst();
          const items = [...currentItems];
          const movedItem = items.splice(oldIndex, 1);
          items.splice(newIndex, 0, ...movedItem);
          const updatedItems = reorderItems(items);
          currentUpdateAction(updatedItems);
        }
      },
    });
  }, [disabled]);
}
