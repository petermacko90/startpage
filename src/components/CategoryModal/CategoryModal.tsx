import { useState, type RefObject } from "react";
import { Add } from "@material-symbols-svg/react/icons/add";
import { Edit } from "@material-symbols-svg/react/icons/edit";
import { EditOff } from "@material-symbols-svg/react/icons/edit-off";
import type { Category, Link } from "../../reducer/models";
import AddEditLink from "../AddEditLink/AddEditLink";
import Button from "../Button/Button";
import LinkList from "../LinkList/LinkList";
import Dialog from "../Dialog/Dialog";
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

  return (
    <Dialog
      closedby="any"
      onClose={close}
      ref={dialogRef}
      title={category.title || "No title"}
    >
      <LinkList
        category={category}
        isEditMode={isEditMode}
        setIsAddingLink={setIsAddingLink}
        setEditLinkId={setEditLinkId}
      />
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
    </Dialog>
  );
}
