import type { MouseEvent } from "react";
import type { Link } from "../../state/models";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { useErrorToast } from "../../hooks/useErrorToast";
import { getHostname } from "../../utils/getHostname";
import { isBlockedUrl } from "../../utils/isBlockedUrl";
import PageIcon from "../PageIcon/PageIcon";
import Toast from "../Toast/Toast";
import "./LinkItem.css";

export default function LinkItem({
  link,
  refCallback,
}: {
  link: Link;
  refCallback: (node: HTMLElement | null, itemId: string) => void;
}) {
  const { isDragging, isOver, dndRef } = useDragAndDrop<HTMLAnchorElement>(
    link.id,
  );

  const { isError, errorMessage, clearError, showErrorToast } =
    useErrorToast(10000);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    clearError();

    if (isBlockedUrl(link.url)) {
      e.preventDefault();

      showErrorToast(
        "Browsers block opening of internal system pages. You can copy the link from right-click menu and paste it into the address bar.",
      );
    }
  };

  return (
    <>
      <a
        href={link.url}
        className={`link${isOver ? " is-over" : ""}${isDragging ? " is-dragging" : ""}`}
        title={link.title}
        ref={(node) => {
          if (dndRef) {
            dndRef.current = node;
          }

          refCallback(node, link.id);
        }}
        data-flip-id={link.id}
        onClick={handleClick}
        onAuxClick={handleClick}
      >
        <span className="link-icon-container">
          <PageIcon
            domain={getHostname(link.url)}
            id={link.customIconId}
            emoji={link.emoji}
          />
        </span>
        <span className="link-title">{link.title}</span>
      </a>
      <Toast type="error" show={isError} text={errorMessage} />
    </>
  );
}
