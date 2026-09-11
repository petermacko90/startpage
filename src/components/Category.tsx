import { useRef } from "react";
import { Edit } from "@material-symbols-svg/react/icons/edit";
import { Delete } from "@material-symbols-svg/react/icons/delete";
import type { Category } from "../reducer/models";
import Links from "./Links";
import "./Category.css";
import { useDispatchContext } from "../context";
import AddEditCategory from "./AddEditCategory";

export default function Category({
  category,
  isEditMode,
}: {
  category: Category;
  isEditMode: boolean;
}) {
  const dispatch = useDispatchContext();
  const linksRef = useRef<HTMLDialogElement>(null);
  const editCategoryRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <div className="category">
        {isEditMode && (
          <button
            className="edit-category"
            title="Edit"
            onClick={() => editCategoryRef.current?.showModal()}
          >
            <Edit />
          </button>
        )}
        {isEditMode && (
          <button
            className="delete-category"
            title="Remove"
            onClick={() =>
              dispatch({ type: "category deleted", payload: category.id })
            }
          >
            <Delete />
          </button>
        )}
        <button
          className="category-button"
          onClick={() => linksRef.current?.showModal()}
          title={category.title || "No title"}
        >
          <span className="category-icon">{category.icon}</span>
          <span className="category-title overflow">{category.title}</span>
        </button>
      </div>
      <Links
        dialogRef={linksRef}
        title={category.title}
        links={category.items}
      />
      <AddEditCategory category={category} dialogRef={editCategoryRef} />
    </>
  );
}
