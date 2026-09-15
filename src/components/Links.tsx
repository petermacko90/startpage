import { useState, type RefObject } from "react";
import { KeyboardArrowDown } from "@material-symbols-svg/react/icons/keyboard-arrow-down";
import { KeyboardArrowUp } from "@material-symbols-svg/react/icons/keyboard-arrow-up";
import type { Category } from "../reducer/models";
import LinkComponent from "./Link";
import AddLink from "./AddLink";
import Button from "./Button/Button";
import CloseButton from "./Button/CloseButton";
import "./Links.css";

export default function Links({
  category,
  dialogRef,
}: {
  category: Category;
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
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
            <LinkComponent key={link.id} link={link} />
          ))}
        </div>
        <Button action={() => setIsAddingLink((prev) => !prev)}>
          <span>Add Link</span>
          {isAddingLink ? (
            <KeyboardArrowUp size={20} />
          ) : (
            <KeyboardArrowDown size={20} />
          )}
        </Button>
        {category.items.length > 0 && (
          <Button action={() => setIsEditMode((prev) => !prev)}>
            {isEditMode ? "Done" : "Edit Links"}
          </Button>
        )}
        {isAddingLink && (
          <AddLink categoryId={category.id} linkCount={category.items.length} />
        )}
      </div>
    </dialog>
  );
}
