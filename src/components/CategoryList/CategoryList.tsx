import { useContext, useEffect, useRef, useState } from "react";
import { StateContext } from "../../context";
import type { Category } from "../../reducer/models";
import { selectCategoriesCount } from "../../reducer/selectors";
import { deleteCategory, undoState } from "../../storage/localStorage";
import { UNDO_TIMEOUT } from "../../constants";
import CategoryItem from "../CategoryItem/CategoryItem";
import AddEditCategory from "../AddEditCategory/AddEditCategory";
import Toast from "../Toast/Toast";
import "./CategoryList.css";

export default function CategoryList({ isEditMode }: { isEditMode: boolean }) {
  const state = useContext(StateContext);
  const categoriesCount = selectCategoriesCount(state);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const addCategoryInputRef = useRef<HTMLInputElement | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const [isShowUndo, setIsShowUndo] = useState(false);
  const undoTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!dialogRef.current) return;

    if (showDialog) {
      dialogRef.current.showModal();
      addCategoryInputRef.current?.focus();
    } else {
      dialogRef.current.close();
    }
  }, [showDialog]);

  function handleDeleteCategory(categoryId: Category["id"]) {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    deleteCategory(categoryId);
    setIsShowUndo(true);
    undoTimerRef.current = setTimeout(() => setIsShowUndo(false), UNDO_TIMEOUT);
  }

  function undo() {
    undoState();
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setIsShowUndo(false);
  }

  return (
    <main>
      {Object.values(state.categories).map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          isEditMode={isEditMode}
          deleteCategory={handleDeleteCategory}
        />
      ))}
      {(categoriesCount === 0 || isEditMode) && (
        <button
          className="add-category"
          onClick={() => setShowDialog(true)}
          title="Add Category"
        >
          +
        </button>
      )}
      {showDialog && (
        <AddEditCategory
          category={null}
          dialogRef={dialogRef}
          inputRef={addCategoryInputRef}
          close={() => setShowDialog(false)}
        />
      )}
      <Toast
        type="undo"
        show={isShowUndo}
        text="Category deleted"
        undo={undo}
      />
    </main>
  );
}
