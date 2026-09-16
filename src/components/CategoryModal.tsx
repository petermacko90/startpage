import { useState, type RefObject } from "react";
import { KeyboardArrowDown } from "@material-symbols-svg/react/icons/keyboard-arrow-down";
import { KeyboardArrowUp } from "@material-symbols-svg/react/icons/keyboard-arrow-up";
import { Delete } from "@material-symbols-svg/react/icons/delete";
import type { Category } from "../reducer/models";
import { useDispatchContext } from "../context";
import Link from "./Link";
import AddLink from "./AddLink";
import Button from "./Button/Button";
import CloseButton from "./Button/CloseButton";
import FloatingButton from "./Button/FloatingButton";
import "./CategoryModal.css";

export default function Links({
  category,
  dialogRef,
}: {
  category: Category;
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  const dispatch = useDispatchContext();
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <dialog closedby="any" ref={dialogRef}>
      <div className="dialog-header">
        <div className="dialog-title overflow">
          {category.title || "No title"}
        </div>
        <CloseButton action={() => dialogRef.current?.close()} />
      </div>
      <div className="dialog-content">
        <div className="links-container">
          {category.items.map((link) => (
            <div key={link.id} className="link-container">
              {isEditMode && (
                <FloatingButton
                  action={() =>
                    dispatch({
                      type: "link deleted",
                      payload: { categoryId: category.id, linkId: link.id },
                    })
                  }
                  position="right"
                  tooltip="Delete"
                  type="delete"
                >
                  <Delete />
                </FloatingButton>
              )}
              <Link key={link.id} link={link} />
            </div>
          ))}
        </div>
        <div className={`buttons-container${isAddingLink ? " mb" : ""}`}>
          <Button action={() => setIsAddingLink((prev) => !prev)}>
            <span>Add Link</span>
            {isAddingLink ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </Button>
          {category.items.length > 0 && (
            <Button action={() => setIsEditMode((prev) => !prev)}>
              {isEditMode ? "Done" : "Edit Links"}
            </Button>
          )}
        </div>
        {isAddingLink && (
          <AddLink categoryId={category.id} linkCount={category.items.length} />
        )}
      </div>
    </dialog>
  );
}
