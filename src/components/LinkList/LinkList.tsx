import {
  type Dispatch,
  type KeyboardEvent,
  type RefObject,
  type SetStateAction,
} from "react";
import { EditSquare } from "@material-symbols-svg/react/icons/edit-square";
import type { Category, Link } from "../../state/models";
import { updateLinks } from "../../storage/localStorage";
import { useDropMonitor } from "../../hooks/useDropMonitor";
import { useFlipAnimation } from "../../hooks/useFlipAnimation";
import FloatingButton from "../Button/FloatingButton";
import LinkItem from "../LinkItem/LinkItem";
import NumberBadge from "../NumberBadge/NumberBadge";
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
    handleArrowKeys(e);
    handleNumericKeys(e);
  }

  function handleArrowKeys(e: KeyboardEvent<HTMLDivElement>) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;

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

    const nextIndex =
      e.key === "ArrowRight"
        ? (currentIndex + 1) % links.length
        : (currentIndex - 1 + links.length) % links.length;

    links[nextIndex]?.focus();
  }

  function handleNumericKeys(e: KeyboardEvent<HTMLDivElement>) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;

    if (
      e.key !== "1" &&
      e.key !== "2" &&
      e.key !== "3" &&
      e.key !== "4" &&
      e.key !== "5" &&
      e.key !== "6" &&
      e.key !== "7" &&
      e.key !== "8" &&
      e.key !== "9" &&
      e.key !== "0"
    ) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const links = Array.from(
      container.querySelectorAll(".link"),
    ) as HTMLAnchorElement[];

    e.preventDefault();

    const linkIndex = e.key === "0" ? 9 : Number(e.key) - 1;
    links[linkIndex]?.focus();
    links[linkIndex]?.click();
  }

  return (
    <div
      className={`links-container${category.items.length === 0 ? "" : " not-empty"}`}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {sortItems(category.items).map((link, index) => (
        <div key={link.id} className="link-container">
          <LinkItem key={link.id} link={link} />
          {index <= 9 && <NumberBadge index={index} />}
          <div className="edit-button-container">
            <FloatingButton
              action={() => handleEditLink(link.id)}
              position="right"
              tooltip="Edit"
              type="edit"
            >
              <EditSquare size={20} />
            </FloatingButton>
          </div>
        </div>
      ))}
    </div>
  );
}
