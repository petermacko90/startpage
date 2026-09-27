import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { Delete } from "@material-symbols-svg/react/icons/delete";
import { Edit } from "@material-symbols-svg/react/icons/edit";
import type { Category, Link } from "../../state/models";
import { UNDO_TIMEOUT } from "../../constants";
import { deleteLink, undoState, updateLinks } from "../../storage/localStorage";
import { useDropMonitor } from "../../hooks/useDropMonitor";
import { useFlipAnimation } from "../../hooks/useFlipAnimation";
import FloatingButton from "../Button/FloatingButton";
import LinkItem from "../LinkItem/LinkItem";
import Toast from "../Toast/Toast";
import "./LinkList.css";

export default function LinkList({
  category,
  isEditMode,
  setIsAddingLink,
  setEditLinkId,
  textInputRef,
}: {
  category: Category;
  isEditMode: boolean;
  setIsAddingLink: Dispatch<SetStateAction<boolean>>;
  setEditLinkId: Dispatch<SetStateAction<Link["id"] | null>>;
  textInputRef: RefObject<HTMLInputElement | null>;
}) {
  const [isShowUndo, setIsShowUndo] = useState(false);
  const undoTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  function handleDeleteLink(linkId: Link["id"]) {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    deleteLink(category.id, linkId);
    setIsShowUndo(true);
    undoTimerRef.current = setTimeout(() => setIsShowUndo(false), UNDO_TIMEOUT);
  }

  function undo() {
    undoState();
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setIsShowUndo(false);
  }

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
          {isEditMode && (
            <FloatingButton
              action={() => handleEditLink(link.id)}
              position="left"
              tooltip="Edit"
              type="edit"
            >
              <Edit />
            </FloatingButton>
          )}
          {isEditMode && (
            <FloatingButton
              action={() => handleDeleteLink(link.id)}
              position="right"
              tooltip="Delete"
              type="delete"
            >
              <Delete />
            </FloatingButton>
          )}
          <LinkItem key={link.id} link={link} />
        </div>
      ))}
      <Toast type="undo" show={isShowUndo} text="Link deleted" undo={undo} />
    </div>
  );
}
