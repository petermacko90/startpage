import { useContext, useEffect, useRef, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { StateContext } from "../../state/context";
import type { Category } from "../../state/models";
import {
  deleteCategory,
  reorderItems,
  undoState,
  updateCategories,
} from "../../storage/localStorage";
import { UNDO_TIMEOUT } from "../../constants";
import { useFlipAnimation } from "../../hooks/useFlipAnimation";
import CategoryItem from "../CategoryItem/CategoryItem";
import AddEditCategory from "../AddEditCategory/AddEditCategory";
import Toast from "../Toast/Toast";
import "./CategoryList.css";

export default function CategoryList({ isEditMode }: { isEditMode: boolean }) {
  const state = useContext(StateContext);

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

  function sortCategories(categories: Category[]): Category[] {
    return categories.toSorted((a, b) => a.order - b.order);
  }

  const { containerRef, captureFirst } = useFlipAnimation([state.categories]);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const dropTargets = location.current.dropTargets;
        if (dropTargets.length === 0) return;
        const destination = dropTargets[0];
        const sourceId = source.data.id as string;
        const destinationId = destination.data.id as string;
        if (sourceId === destinationId) return;

        const oldIndex = state.categories.findIndex((c) => c.id === sourceId);

        const newIndex = state.categories.findIndex(
          (c) => c.id === destinationId,
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          captureFirst();
          const categories = [...state.categories];
          const [movedCategory] = categories.splice(oldIndex, 1);
          categories.splice(newIndex, 0, movedCategory);
          const updatedCategories = reorderItems(categories);
          updateCategories(updatedCategories);
        }
      },
    });
  }, [state.categories, captureFirst]);

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
