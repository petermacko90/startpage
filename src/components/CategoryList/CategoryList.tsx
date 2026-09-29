import { useContext, useEffect, useRef, useState } from "react";
import { StateContext } from "../../state/context";
import type { Category } from "../../state/models";
import {
  deleteCategory,
  undoState,
  updateCategories,
} from "../../storage/localStorage";
import { UNDO_TIMEOUT } from "../../constants";
import { useDialog } from "../../hooks/useDialog";
import { useFlipAnimation } from "../../hooks/useFlipAnimation";
import { useDropMonitor } from "../../hooks/useDropMonitor";
import AddCategory from "../AddEditCategory/AddCategory";
import CategoryItem from "../CategoryItem/CategoryItem";
import Toast from "../Toast/Toast";
import "./CategoryList.css";

export default function CategoryList({ isEditMode }: { isEditMode: boolean }) {
  const state = useContext(StateContext);

  const [isShowUndo, setIsShowUndo] = useState(false);
  const undoTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  const { dialogRef, focusRef, setShowDialog, showDialog } = useDialog();

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

  function sortCategories(categories: Category[]): Category[] {
    return categories.toSorted((a, b) => a.order - b.order);
  }

  const { containerRef, captureFirst } = useFlipAnimation([state.categories]);

  useDropMonitor(state.categories, captureFirst, (updadetedCategories) =>
    updateCategories(updadetedCategories),
  );

  return (
    <main ref={containerRef}>
      {sortCategories(state.categories).map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          isEditMode={isEditMode}
          deleteCategory={handleDeleteCategory}
        />
      ))}
      <button
        className="add-category"
        onClick={() => setShowDialog(true)}
        title="Add Category"
      >
        +
      </button>
      {showDialog && (
        <AddCategory
          dialogRef={dialogRef}
          inputRef={focusRef}
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
