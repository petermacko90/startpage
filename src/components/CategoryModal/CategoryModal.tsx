import { useRef, useState, type KeyboardEvent, type RefObject } from "react";
import type { Category, Link } from "../../state/models";
import { NO_TITLE } from "../../constants";
import { deleteLink } from "../../storage/localStorage/links";
import { getNeighborId } from "../../utils/getNeighborId";
import { handleNumericKeys } from "../../utils/handleNumericKeys";
import { useDeleteWithUndo } from "../../hooks/useDeleteWithUndo";
import { useFocusById } from "../../hooks/useFocusById";
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

  const setIdToFocus = useFocusById("link");
  const addLinkButtonRef = useRef<HTMLButtonElement | null>(null);

  const { deleteItem, isShowUndo, undo, undoButtonRef } = useDeleteWithUndo(
    (linkId) => deleteLink(category.id, linkId),
    (index) => getNeighborId(category.links, index),
    setIdToFocus,
    addLinkButtonRef,
  );

  function handleKeyDown(e: KeyboardEvent<HTMLDialogElement>) {
    if (!shouldHandleNumericKeys()) return;
    handleNumericKeys(e, () => dialogRef.current!.querySelectorAll(".link"));
  }

  function shouldHandleNumericKeys(): boolean {
    return !isAddingLink && !editLinkId;
  }

  function openAllLinks() {
    category.links.forEach((link) => {
      browser.tabs.create({ url: link.url, active: false });
    });
  }

  const lastActiveLinkRef = useRef<Link["id"] | null>(null);

  return (
    <Dialog
      closedby="any"
      onClose={close}
      ref={dialogRef}
      onKeyDown={handleKeyDown}
      title={category.title || NO_TITLE}
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
      <div className="buttons-container">
        {category.links.length > 1 && (
          <Button action={() => openAllLinks()}>Open All Links</Button>
        )}
        <Button action={() => handleAddLink()} buttonRef={addLinkButtonRef}>
          <span>Add Link</span>
        </Button>
        <Button action={close}>Close</Button>
      </div>
      {isAddingLink && (
        <AddEditLink
          key={category.links.length}
          categoryId={category.id}
          linkCount={category.links.length}
          linkId={null}
          cancel={() => {
            setIsAddingLink(false);
            addLinkButtonRef.current?.focus();
          }}
          textInputRef={textInputRef}
        />
      )}
      {editLinkId && (
        <AddEditLink
          key={editLinkId}
          categoryId={category.id}
          linkCount={category.links.length}
          linkId={editLinkId}
          cancel={() => {
            setEditLinkId(null);
            if (lastActiveLinkRef.current) {
              setIdToFocus(lastActiveLinkRef.current);
              lastActiveLinkRef.current = null;
            }
          }}
          textInputRef={textInputRef}
          handleDeleteLink={deleteItem}
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
