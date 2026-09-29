import {
  type Dispatch,
  type KeyboardEvent,
  type RefObject,
  type SetStateAction,
} from "react";
import { Edit } from "@material-symbols-svg/react/icons/edit";
import type { Category, Link } from "../../state/models";
import { updateLinks } from "../../storage/localStorage";
import { useDropMonitor } from "../../hooks/useDropMonitor";
import { useFlipAnimation } from "../../hooks/useFlipAnimation";
import FloatingButton from "../Button/FloatingButton";
import LinkItem from "../LinkItem/LinkItem";
import "./LinkList.css";

export default function LinkList({
  category,
  setIsAddingLink,
  setEditLinkId,
  textInputRef,
}: {
  category: Category;
  setIsAddingLink: Dispatch<SetStateAction<boolean>>;
  setEditLinkId: Dispatch<SetStateAction<Link["id"] | null>>;
  textInputRef: RefObject<HTMLInputElement | null>;
}) {
  function sortItems(items: Link[]): Link[] {
    return items.toSorted((a, b) => a.order - b.order);
  }

  const { containerRef, captureFirst } = useFlipAnimation([category.items]);

  useDropMonitor(category.items, captureFirst, (updatedLinks) =>
    updateLinks(category.id, updatedLinks),
  );

  function handleEditLink(linkId: Link["id"]) {
    setIsAddingLink(false);
    setEditLinkId(linkId);
    setTimeout(() => textInputRef.current?.focus());
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

    const container = containerRef.current;
    if (!container) return;

    const currentLink = document.activeElement as HTMLAnchorElement;
    if (!currentLink) return;

    const links = Array.from(
      container.querySelectorAll(".link"),
    ) as HTMLAnchorElement[];
    const currentIndex = links.indexOf(currentLink);

    if (currentIndex === -1) return;

    e.preventDefault();

    let nextIndex: number = NaN;

    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % links.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + links.length) % links.length;
    }

    links.at(nextIndex)?.focus();
  }

  return (
    <div
      className={`links-container${category.items.length === 0 ? "" : " not-empty"}`}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {sortItems(category.items).map((link) => (
        <div key={link.id} className="link-container">
          <LinkItem key={link.id} link={link} />
          <div className="edit-button-container">
            <FloatingButton
              action={() => handleEditLink(link.id)}
              position="right"
              tooltip="Edit"
              type="edit"
            >
              <Edit />
            </FloatingButton>
          </div>
        </div>
      ))}
    </div>
  );
}
