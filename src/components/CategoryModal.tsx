import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Add } from "@material-symbols-svg/react/icons/add";
import { Delete } from "@material-symbols-svg/react/icons/delete";
import { Edit } from "@material-symbols-svg/react/icons/edit";
import { EditOff } from "@material-symbols-svg/react/icons/edit-off";
import type { Category, Link } from "../reducer/models";
import { getState, setState } from "../storage";
import { UNDO_TIMEOUT } from "../constants";
import LinkComponent from "./Link";
import AddEditLink from "./AddEditLink";
import Button from "./Button/Button";
import CloseButton from "./Button/CloseButton";
import FloatingButton from "./Button/FloatingButton";
import UndoToast from "./UndoToast/UndoToast";
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
  const [isEditMode, setIsEditMode] = useState(false);

  const [isShowUndo, setIsShowUndo] = useState(false);
  const undoTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  function deleteLink(linkId: Link["id"]) {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);

    getState().then((state) => {
      setState({
        ...state,
        categories: {
          ...state.categories,
          [category.id]: {
            ...state.categories[category.id],
            items: state.categories[category.id].items.filter((item) => {
              return item.id !== linkId;
            }),
          },
        },
        undoState: state.categories,
      });
    });

    setIsShowUndo(true);
    undoTimerRef.current = setTimeout(() => setIsShowUndo(false), UNDO_TIMEOUT);
  }

  function undo() {
    getState().then((state) => {
      if (!state.undoState) return;
      setState({
        categories: state.undoState,
      });
    });

    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setIsShowUndo(false);
  }

  return createPortal(
    <dialog closedby="any" ref={dialogRef} onClose={close}>
      <div className="dialog-header">
        <div></div>
        <div className="dialog-title overflow">
          {category.title || "No title"}
        </div>
        <CloseButton action={() => close()} />
      </div>
      <div className="dialog-content">
        <div className="links-container">
          {category.items.map((link) => (
            <div key={link.id} className="link-container">
              {isEditMode && (
                <FloatingButton
                  action={() => {
                    setIsAddingLink(false);
                    setEditLinkId(link.id);
                  }}
                  position="left"
                  tooltip="Edit"
                  type="edit"
                >
                  <Edit />
                </FloatingButton>
              )}
              {isEditMode && (
                <FloatingButton
                  action={() => deleteLink(link.id)}
                  position="right"
                  tooltip="Delete"
                  type="delete"
                >
                  <Delete />
                </FloatingButton>
              )}
              <LinkComponent key={link.id} link={link} />
            </div>
          ))}
        </div>
        <div
          className={`buttons-container${isAddingLink || editLinkId ? " mb" : ""}`}
        >
          <Button
            action={() => {
              setEditLinkId(null);
              setIsAddingLink(true);
            }}
          >
            <Add />
            <span>Add Link</span>
          </Button>
          {category.items.length > 0 && (
            <Button
              action={() =>
                setIsEditMode((prev) => {
                  if (prev === true) setEditLinkId(null);
                  return !prev;
                })
              }
            >
              {isEditMode ? <EditOff /> : <Edit />}
              <span>{isEditMode ? "Done" : "Edit Links"}</span>
            </Button>
          )}
        </div>
        {isAddingLink && (
          <AddEditLink
            categoryId={category.id}
            linkCount={category.items.length}
            linkId={null}
            cancel={() => setIsAddingLink(false)}
          />
        )}
        {editLinkId && (
          <AddEditLink
            key={editLinkId}
            categoryId={category.id}
            linkCount={category.items.length}
            linkId={editLinkId}
            cancel={() => setEditLinkId(null)}
          />
        )}
        <UndoToast show={isShowUndo} text="Link deleted" undo={undo} />
      </div>
    </dialog>,
    document.body,
  );
}
