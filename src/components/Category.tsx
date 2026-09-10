import { useRef } from "react";
import type { Category } from "../reducer/models";
import Links from "./Links";
import "./Category.css";
import { useDispatchContext } from "../context";

export default function Category({
  category,
  isEditMode,
}: {
  category: Category;
  isEditMode: boolean;
}) {
  const dispatch = useDispatchContext();
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <div className="category">
        {isEditMode && (
          <button
            className="delete-category"
            title="Remove"
            onClick={() =>
              dispatch({ type: "category deleted", payload: category.id })
            }
          >
            &times;
          </button>
        )}
        <button
          className="category-button"
          onClick={() => dialogRef.current?.showModal()}
          title={category.title || "No title"}
        >
          <span className="category-icon">{category.icon}</span>
          <span className="category-title overflow">{category.title}</span>
        </button>
      </div>
      <Links
        dialogRef={dialogRef}
        title={category.title}
        links={category.items}
      />
    </>
  );
}
