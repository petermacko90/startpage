import { useRef } from "react";
import type { Category } from "../reducer/models";
import Links from "./Links";
import "./Category.css";

export default function Category({ category }: { category: Category }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        className="category"
        onClick={() => dialogRef.current?.showModal()}
        title={category.title || "No title"}
      >
        <span className="category-icon">{category.icon}</span>
        <span className="category-title overflow">{category.title}</span>
      </button>
      <Links
        dialogRef={dialogRef}
        title={category.title}
        links={category.items}
      />
    </>
  );
}
