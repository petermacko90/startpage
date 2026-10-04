import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { Add } from "@material-symbols-svg/react/icons/add";
import { Close } from "@material-symbols-svg/react/icons/close";
import type { Category, Link } from "../../state/models";
import { UNDO_TIMEOUT } from "../../constants";
import { deleteLink, undoState } from "../../storage/localStorage";
import { handleNumericKeys } from "../../utils/handleNumericKeys";
import AddEditLink from "../AddEditLink/AddEditLink";
import Button from "../Button/Button";
import LinkList from "../LinkList/LinkList";
import Dialog from "../Dialog/Dialog";
import Toast from "../Toast/Toast";
import "./CategoryModal.css";

export default function CategoryModal({
  category,
  dialogRef,
  close,
}: {
  category: Category;
  dialogRef: RefObject<HTMLDialogElement | null>;
  close: () => void;
}) {
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editLinkId, setEditLinkId] = useState<Link["id"] | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);

  function handleAddLink() {
    setEditLinkId(null);
    setIsAddingLink(true);
    setTimeout(() => textInputRef.current?.focus());
  }

  const [isShowUndo, setIsShowUndo] = useState(false);
  const undoTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  function handleDeleteLink(linkId: Link["id"], index: number) {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    let neighborId: Link["id"] | null = null;

    if (category.items.length > 1) {
      if (index < category.items.length - 1) {
        neighborId = category.items[index + 1].id;
      } else {
        neighborId = category.items[index - 1].id;
      }
    }

    neighborIdRef.current = neighborId;
    setDeletedLinkId(linkId);
    deleteLink(category.id, linkId);
    setIsShowUndo(true);
    undoTimerRef.current = setTimeout(() => handleToastClose(), UNDO_TIMEOUT);
    setTimeout(() => undoButtonRef.current?.focus(), 50);

    if (neighborId) {
      setIdToFocus(neighborId);
    }
  }

  function handleToastClose() {
    setIsShowUndo(false);

    if (neighborIdRef.current) {
      setIdToFocus(neighborIdRef.current);
      neighborIdRef.current = null;
    } else {
      addLinkRef.current?.focus();
    }
  }

  function undo() {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoState();
    setIsShowUndo(false);
    setIdToFocus(deletedLinkId);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDialogElement>) {
    if (!shouldHandleNumericKeys()) return;
    handleNumericKeys(e, () => dialogRef.current!.querySelectorAll(".link"));
  }

  function shouldHandleNumericKeys(): boolean {
    return !isAddingLink && !editLinkId;
  }

  const addLinkRef = useRef<HTMLButtonElement | null>(null);
  const undoButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveLinkRef = useRef<Link["id"] | null>(null);
  const neighborIdRef = useRef<Link["id"] | null>(null);

  const [deletedLinkId, setDeletedLinkId] = useState<Link["id"] | null>(null);

  const [idToFocus, setIdToFocus] = useState<Link["id"] | null>(null);

  useEffect(() => {
    if (idToFocus) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`link-${idToFocus}`);
        if (element) {
          (element as HTMLElement).focus();
        }
        setIdToFocus(null);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [idToFocus]);

  return (
    <Dialog
      closedby="any"
      onClose={close}
      ref={dialogRef}
      onKeyDown={handleKeyDown}
      title={category.title || "No title"}
      className="category-modal"
    >
      <LinkList
        category={category}
        setIsAddingLink={setIsAddingLink}
        setEditLinkId={setEditLinkId}
        textInputRef={textInputRef}
        shouldShowBadge={shouldHandleNumericKeys()}
        lastActiveLinkRef={lastActiveLinkRef}
      />
      <div
        className={`buttons-container${isAddingLink || editLinkId ? " mb" : ""}`}
      >
        <Button action={() => handleAddLink()} buttonRef={addLinkRef}>
          <Add />
          <span>Add Link</span>
        </Button>
        <Button action={close}>
          <Close />
          Close
        </Button>
      </div>
      {isAddingLink && (
        <AddEditLink
          key={category.items.length}
          categoryId={category.id}
          linkCount={category.items.length}
          linkId={null}
          cancel={() => {
            setIsAddingLink(false);
            addLinkRef.current?.focus();
          }}
          textInputRef={textInputRef}
        />
      )}
      {editLinkId && (
        <AddEditLink
          key={editLinkId}
          categoryId={category.id}
          linkCount={category.items.length}
          linkId={editLinkId}
          cancel={() => {
            setEditLinkId(null);
            if (lastActiveLinkRef.current) {
              setIdToFocus(lastActiveLinkRef.current);
              lastActiveLinkRef.current = null;
            }
          }}
          textInputRef={textInputRef}
          handleDeleteLink={handleDeleteLink}
        />
      )}
      <Toast
        type="undo"
        show={isShowUndo}
        text="Link deleted"
        undo={undo}
        undoButtonRef={undoButtonRef}
      />
    </Dialog>
  );
}
