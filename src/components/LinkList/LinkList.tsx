import { type Dispatch, type RefObject, type SetStateAction } from "react";
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

  return (
    <div
      className={`links-container${category.items.length === 0 ? "" : " not-empty"}`}
      ref={containerRef}
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
