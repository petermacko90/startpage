import { type Dispatch, type RefObject, type SetStateAction } from "react";
import type { Category, Link } from "../../state/models";
import { MAX_INDEX_FOR_NUMBER_BADGE } from "../../constants";
import { updateLinks } from "../../storage/localStorage/links";
import { useDropMonitor } from "../../hooks/useDropMonitor";
import { useFlipAnimation } from "../../hooks/useFlipAnimation";
import { handleArrowKeys } from "../../utils/handleArrowKeys";
import EditButton from "../Button/EditButton";
import LinkItem from "../LinkItem/LinkItem";
import NumberBadge from "../NumberBadge/NumberBadge";
import "./LinkList.css";

export default function LinkList({
  category,
  setIsAddingLink,
  setEditLinkId,
  textInputRef,
  shouldShowBadge,
  lastActiveLinkRef,
}: {
  category: Category;
  setIsAddingLink: Dispatch<SetStateAction<boolean>>;
  setEditLinkId: Dispatch<SetStateAction<Link["id"] | null>>;
  textInputRef: RefObject<HTMLInputElement | null>;
  shouldShowBadge: boolean;
  lastActiveLinkRef: RefObject<Link["id"] | null>;
}) {
  const { containerRef, captureFirst } = useFlipAnimation(category.links);

  useDropMonitor(category.links, captureFirst, (updatedLinks) =>
    updateLinks(category.id, updatedLinks),
  );

  function handleEditLink(linkId: Link["id"]) {
    setIsAddingLink(false);
    setEditLinkId(linkId);
    setTimeout(() => textInputRef.current?.focus());
  }

  return (
    <div
      className={`links-container${category.links.length === 0 ? "" : " not-empty"}`}
      ref={containerRef}
      onKeyDown={(e) => handleArrowKeys(e, containerRef, ".link")}
    >
      {category.links.map((link, index) => (
        <div key={link.id} className="link-container">
          {shouldShowBadge && index <= MAX_INDEX_FOR_NUMBER_BADGE && (
            <NumberBadge index={index} />
          )}
          <LinkItem key={link.id} link={link} />
          <EditButton
            action={() => {
              lastActiveLinkRef.current = link.id;
              handleEditLink(link.id);
            }}
          />
        </div>
      ))}
    </div>
  );
}
