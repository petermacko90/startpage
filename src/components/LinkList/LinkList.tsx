import {
  type Dispatch,
  type KeyboardEvent,
  type RefObject,
  type SetStateAction,
} from "react";
import type { Category, Link } from "../../state/models";
import { updateLinks } from "../../storage/localStorage";
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
  function sortLinks(links: Link[]): Link[] {
    return links.toSorted((a, b) => a.order - b.order);
  }

  const { containerRef, captureFirst } = useFlipAnimation(category.links);

  useDropMonitor(category.links, captureFirst, (updatedLinks) =>
    updateLinks(category.id, updatedLinks),
  );

  function handleEditLink(linkId: Link["id"]) {
    setIsAddingLink(false);
    setEditLinkId(linkId);
    setTimeout(() => textInputRef.current?.focus());
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    handleArrowKeys<HTMLAnchorElement>(e, containerRef, ".link");
  }

  return (
    <div
      className={`links-container${category.links.length === 0 ? "" : " not-empty"}`}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {sortLinks(category.links).map((link, index) => (
        <div key={link.id} className="link-container">
          {shouldShowBadge && index <= 9 && <NumberBadge index={index} />}
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
