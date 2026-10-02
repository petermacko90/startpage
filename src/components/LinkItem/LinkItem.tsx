import type { Link } from "../../state/models";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import PageIcon from "../PageIcon/PageIcon";
import "./LinkItem.css";

export default function LinkItem({ link }: { link: Link }) {
  const { isDragging, isOver, ref } = useDragAndDrop<HTMLAnchorElement>(
    link.id,
  );

  return (
    <a
      id={`link-${link.id}`}
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
