import { useState, type RefObject } from "react";
import { KeyboardArrowDown } from "@material-symbols-svg/react/icons/keyboard-arrow-down";
import { KeyboardArrowUp } from "@material-symbols-svg/react/icons/keyboard-arrow-up";
import type { Category } from "../reducer/models";
import LinkComponent from "./Link";
import AddLink from "./AddLink";
import "./Links.css";

export default function Links({
  category,
  dialogRef,
}: {
  category: Category;
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  const [isAddingLink, setIsAddingLink] = useState(false);

  return (
    <dialog closedby="any" ref={dialogRef}>
      <div className="dialog-header">
        <div className="dialog-title overflow">
          {category.title || "No title"}
        </div>
        <button
          title="Close"
          className="close-button"
          onClick={() => dialogRef.current?.close()}
        >
          &times;
        </button>
      </div>
      <div className="dialog-content">
        <div className="links-container">
          {category.items.map((link) => (
            <LinkComponent key={link.id} link={link} />
          ))}
        </div>
        <button
          className="add-link"
          onClick={() => setIsAddingLink((prev) => !prev)}
        >
          <span>Add Link</span>
          {isAddingLink ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </button>
        {isAddingLink && (
          <AddLink categoryId={category.id} linkCount={category.items.length} />
        )}
      </div>
    </dialog>
  );
}
