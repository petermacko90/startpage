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
import { handleArrowKeys } from "../../utils/handleArrowKeys";
import AddCategory from "../AddEditCategory/AddCategory";
import CategoryItem from "../CategoryItem/CategoryItem";
import Toast from "../Toast/Toast";
import "./CategoryList.css";

export default function CategoryList({
  isAppFocused,
  isLoading,
}: {
  isAppFocused: boolean;
  isLoading: boolean;
}) {
  const state = useContext(StateContext);

  const [isShowUndo, setIsShowUndo] = useState(false);
  const undoTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  const { dialogRef, focusRef, setShowDialog, showDialog } = useDialog();

  function handleDeleteCategory(categoryId: Category["id"], index: number) {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    let neighborId: Category["id"] | null = null;

    if (state.categories.length > 1) {
      if (index < state.categories.length - 1) {
        neighborId = state.categories[index + 1].id;
      } else {
        neighborId = state.categories[index - 1].id;
      }
    }

    neighborIdRef.current = neighborId;
    setDeletedCategoryId(categoryId);
    deleteCategory(categoryId);
    setIsShowUndo(true);
    undoTimerRef.current = setTimeout(() => handleToastClose(), UNDO_TIMEOUT);
    setTimeout(() => undoButtonRef.current?.focus(), 50);
  }

  function handleToastClose() {
    setIsShowUndo(false);

    if (neighborIdRef.current) {
      setIdToFocus(neighborIdRef.current);
      neighborIdRef.current = null;
    } else {
      addCategoryButtonRef.current?.focus();
    }
  }

  function undo() {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoState();
    setIsShowUndo(false);
    setIdToFocus(deletedCategoryId);
  }

  function sortCategories(categories: Category[]): Category[] {
    return categories.toSorted((a, b) => a.order - b.order);
  }

  const { containerRef, captureFirst } = useFlipAnimation(state.categories);

  useDropMonitor(state.categories, captureFirst, (updadetedCategories) =>
    updateCategories(updadetedCategories),
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    handleArrowKeys<HTMLButtonElement>(e, containerRef, ".category-button");
  }

  const addCategoryButtonRef = useRef<HTMLButtonElement | null>(null);
  const undoButtonRef = useRef<HTMLButtonElement | null>(null);
  const neighborIdRef = useRef<Category["id"] | null>(null);

  const [deletedCategoryId, setDeletedCategoryId] = useState<
    Category["id"] | null
  >(null);
  const [idToFocus, setIdToFocus] = useState<Category["id"] | null>(null);

  useEffect(() => {
    if (idToFocus) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`category-${idToFocus}`);
        if (element) {
          (element as HTMLElement).focus();
        }
        setIdToFocus(null);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [idToFocus]);

  const initialFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isLoading || !containerRef.current) return;
    const firstCategory = containerRef.current.querySelector(
      ".category-button",
    ) as HTMLElement;

    if (firstCategory) {
      firstCategory.focus();
    } else {
      addCategoryButtonRef.current?.focus();
    }
  }, [isLoading, containerRef]);

  return (
    <main ref={containerRef} onKeyDown={handleKeyDown}>
      {sortCategories(state.categories).map((category, index) => (
        <CategoryItem
          key={category.id}
          category={category}
          isAppFocused={isAppFocused}
          deleteCategory={handleDeleteCategory}
          setIdToFocus={setIdToFocus}
          initialFocusRef={index === 0 ? initialFocusRef : null}
        />
      ))}
      <button
        className="add-category"
        onClick={() => setShowDialog(true)}
        title="Add Category"
        ref={addCategoryButtonRef}
      >
        +
      </button>
      {showDialog && (
        <AddCategory
          dialogRef={dialogRef}
          inputRef={focusRef}
          close={(categoryId) => {
            setShowDialog(false);

            if (categoryId) {
              setIdToFocus(categoryId);
            } else {
              setTimeout(() => addCategoryButtonRef.current?.focus());
            }
          }}
        />
      )}
      <Toast
        type="undo"
        show={isShowUndo}
        text="Category deleted"
        undo={undo}
        undoButtonRef={undoButtonRef}
      />
    </main>
  );
}
