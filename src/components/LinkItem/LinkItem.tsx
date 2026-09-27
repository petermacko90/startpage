import { useEffect, useRef, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import type { Link } from "../../state/models";
import PageIcon from "../PageIcon/PageIcon";
import "./LinkItem.css";

export default function LinkItem({ link }: { link: Link }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return combine(
      draggable({
        element,
        getInitialData: () => ({ id: link.id }),
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
              const clone = element.cloneNode(true) as HTMLElement;
              clone.style.width = `${element.offsetWidth}px`;
              clone.style.height = `${element.offsetHeight}px`;
              clone.style.opacity = "0.7";
              clone.style.transform = "scale(1.05)";
              clone.style.boxShadow = "var(--box-shadow-m)";
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
        getData: () => ({ id: link.id }),
        onDragEnter: () => setIsOver(true),
        onDragLeave: () => setIsOver(false),
        onDrop: () => setIsOver(false),
      }),
    );
  }, [link.id]);

  return (
    <a
      href={link.url}
      className={`link ${isOver ? "is-over" : ""} ${isDragging ? "is-dragging" : ""}`}
      title={link.title}
      ref={ref}
      data-flip-id={link.id}
    >
      <span className="link-icon-container">
        <PageIcon domain={new URL(link.url).hostname} />
      </span>
      <span className="link-title">{link.title}</span>
    </a>
  );
}
