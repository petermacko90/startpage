import type { RefObject } from "react";
import type { Category, Link } from "../reducer/models";
import LinkComponent from "./Link";
import "./Links.css";

export default function Links({
  title,
  links,
  dialogRef,
}: {
  title: Category["title"];
  links: Link[];
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  return (
    <dialog closedby="any" ref={dialogRef}>
      <div className="dialog-header">
        <div className="dialog-title overflow">{title}</div>
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
          {links.map((link) => (
            <LinkComponent key={link.id} link={link} />
          ))}
        </div>
        {links.length === 0 && <button className="add-link">Add Link</button>}
      </div>
    </dialog>
  );
}
