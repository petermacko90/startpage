import { useEffect, useRef, useState } from "react";
import { Edit } from "@material-symbols-svg/react/icons/edit";
import { Delete } from "@material-symbols-svg/react/icons/delete";
import type { Category } from "../reducer/models";
import CategoryModal from "./CategoryModal";
import AddEditCategory from "./AddEditCategory";
import FloatingButton from "./Button/FloatingButton";
import "./CategoryItem.css";

export default function CategoryItem({
  category,
  isEditMode,
  deleteCategory,
}: {
  category: Category;
  isEditMode: boolean;
  deleteCategory: (categoryId: Category["id"]) => void;
}) {
  const linksRef = useRef<HTMLDialogElement>(null);
  const [showLinks, setShowLinks] = useState(false);

  const editCategoryRef = useRef<HTMLDialogElement>(null);
  const editCategoryInputRef = useRef<HTMLInputElement | null>(null);
  const [showEditCategory, setShowEditCategory] = useState(false);

  useEffect(() => {
    if (!linksRef.current) return;
    if (showLinks) {
      linksRef.current.showModal();
    } else {
      linksRef.current.close();
    }
  }, [showLinks]);

  useEffect(() => {
    if (!editCategoryRef.current) return;
    if (showEditCategory) {
      editCategoryRef.current.showModal();
      editCategoryInputRef.current?.focus();
    } else {
      editCategoryRef.current.close();
    }
  }, [showEditCategory]);

  return (
    <>
      <div className="category">
        {isEditMode && (
          <FloatingButton
            action={() => setShowEditCategory(true)}
            position="left"
            type="edit"
            tooltip="Edit"
          >
            <Edit />
          </FloatingButton>
        )}
        {isEditMode && (
          <FloatingButton
            action={() => deleteCategory(category.id)}
            position="right"
            type="delete"
            tooltip="Delete"
          >
            <Delete />
          </FloatingButton>
        )}
        <button
          className="category-button"
          onClick={() => setShowLinks(true)}
          title={category.title || "No title"}
        >
          <span className="category-icon">{category.icon}</span>
          <span className="category-title overflow">{category.title}</span>
        </button>
      </div>
      {showLinks && (
        <CategoryModal
          category={category}
          dialogRef={linksRef}
          close={() => setShowLinks(false)}
        />
      )}
      {showEditCategory && (
        <AddEditCategory
          category={category}
          dialogRef={editCategoryRef}
          inputRef={editCategoryInputRef}
          close={() => setShowEditCategory(false)}
        />
      )}
    </>
  );
}
