import { useRef } from "react";
import { Edit } from "@material-symbols-svg/react/icons/edit";
import { Delete } from "@material-symbols-svg/react/icons/delete";
import { useDispatchContext } from "../context";
import type { Category } from "../reducer/models";
import CategoryModal from "./CategoryModal";
import AddEditCategory from "./AddEditCategory";
import FloatingButton from "./Button/FloatingButton";
import "./CategoryItem.css";

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
          <FloatingButton
            action={() => editCategoryRef.current?.showModal()}
            position="left"
            type="edit"
            tooltip="Edit"
          >
            <Edit />
          </FloatingButton>
        )}
        {isEditMode && (
          <FloatingButton
            action={() =>
              dispatch({ type: "category deleted", payload: category.id })
            }
            position="right"
            type="delete"
            tooltip="Delete"
          >
            <Delete />
          </FloatingButton>
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
      <CategoryModal category={category} dialogRef={linksRef} />
      <AddEditCategory category={category} dialogRef={editCategoryRef} />
    </>
  );
}
