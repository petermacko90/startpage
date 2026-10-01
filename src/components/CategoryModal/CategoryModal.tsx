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

  function handleKeyDown(e: KeyboardEvent<HTMLDialogElement>) {
    if (!shouldHandleNumericKeys()) return;
    handleNumericKeys<HTMLAnchorElement>(e, dialogRef, ".link");
  }

  function shouldHandleNumericKeys(): boolean {
    return !isAddingLink && !editLinkId;
  }

  const addLinkRef = useRef<HTMLButtonElement | null>(null);

  const lastActiveLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (editLinkId === null && lastActiveLinkRef.current) {
      lastActiveLinkRef.current.focus();
      lastActiveLinkRef.current = null;
    }
  }, [editLinkId]);

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
        <Button action={() => handleAddLink()} ref={addLinkRef}>
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
          cancel={() => setEditLinkId(null)}
          textInputRef={textInputRef}
          handleDeleteLink={handleDeleteLink}
        />
      )}
      <Toast type="undo" show={isShowUndo} text="Link deleted" undo={undo} />
    </Dialog>
  );
}
