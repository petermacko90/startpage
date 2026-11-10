import { useEffect, useRef, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";

export function useDragAndDrop<T extends HTMLDivElement | HTMLAnchorElement>(
  id: string,
  disabled?: boolean,
) {
  const dndRef = useRef<T>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const element = dndRef.current;
    if (!element || disabled) return;

    return combine(
      draggable({
        element,
        getInitialData: () => ({ id }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: ({ container }) => {
              return {
                x: container.offsetWidth / 2,
                y: container.offsetHeight / 2,
              };
            },
            render({ container }) {
              const clone = element.cloneNode(true) as T;
              clone.style.width = `${element.offsetWidth}px`;
              clone.style.height = `${element.offsetHeight}px`;
              clone.style.opacity = "0.7";
              clone.style.transform = "scale(1.05)";
              clone.style.boxShadow = "var(--box-shadow)";
              container.appendChild(clone);

              return () => {
                container.removeChild(clone);
              };
            },
          });
        },
      }),
      dropTargetForElements({
        element,
        getData: () => ({ id }),
        onDragEnter: () => setIsOver(true),
        onDragLeave: () => setIsOver(false),
        onDrop: () => setIsOver(false),
      }),
    );
  }, [id, disabled]);

  return { dndRef, isDragging, isOver };
}
