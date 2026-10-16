import { useContext, useEffect, useRef, useState } from "react";
import { StateContext } from "../../state/context";
import type { Category } from "../../state/models";
import { undoState } from "../../storage/localStorage/common";
import {
  deleteCategory,
  updateCategories,
} from "../../storage/localStorage/categories";
import { UNDO_TIMEOUT } from "../../constants";
import { useDropMonitor } from "../../hooks/useDropMonitor";
import { useFlipAnimation } from "../../hooks/useFlipAnimation";
import { useFocusById } from "../../hooks/useFocusById";
import { useTimer } from "../../hooks/useTimer";
import { getNeighborId } from "../../utils/getNeighborId";
import { handleArrowKeys } from "../../utils/handleArrowKeys";
import AddCategory from "../AddEditCategory/AddCategory";
import BookmarksImport from "../BookmarksImport/BookmarksImport";
import CategoryItem from "../CategoryItem/CategoryItem";
import Toast from "../Toast/Toast";
import "./CategoryList.css";

export default function CategoryList({
  shouldDisplayHints,
  isLoading,
}: {
  shouldDisplayHints: boolean;
  isLoading: boolean;
}) {
  const state = useContext(StateContext);
  const [isShowUndo, setIsShowUndo] = useState(false);
  const { clearTimer, startTimer } = useTimer();
  const neighborIdRef = useRef<Category["id"] | null>(null);

  function handleDeleteCategory(categoryId: Category["id"], index: number) {
    neighborIdRef.current = getNeighborId(state.categories, index);
    setDeletedCategoryId(categoryId);
    deleteCategory(categoryId);
    setIsShowUndo(true);
    startTimer(() => handleToastClose(), UNDO_TIMEOUT);
    setTimeout(() => undoButtonRef.current?.focus(), 50);
  }

  const setIdToFocus = useFocusById("category");

  function handleToastClose() {
    setIsShowUndo(false);

    if (document.activeElement === undoButtonRef.current) {
      if (neighborIdRef.current) {
        setIdToFocus(neighborIdRef.current);
      } else {
        addCategoryButtonRef.current?.focus();
      }
    }

    neighborIdRef.current = null;
  }

  function undo() {
    clearTimer();
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
    handleArrowKeys<HTMLButtonElement>(e, containerRef, ".category-item");
  }

  const addCategoryButtonRef = useRef<HTMLButtonElement | null>(null);
  const undoButtonRef = useRef<HTMLButtonElement | null>(null);

  const [deletedCategoryId, setDeletedCategoryId] = useState<
    Category["id"] | null
  >(null);

  const initialFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isLoading || !containerRef.current) return;
    const firstCategory = containerRef.current.querySelector(
      ".category-button",
    ) as HTMLButtonElement;

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
          shouldDisplayHints={shouldDisplayHints}
          deleteCategory={handleDeleteCategory}
          setIdToFocus={setIdToFocus}
          initialFocusRef={index === 0 ? initialFocusRef : null}
        />
      ))}
      <AddCategory
        setIdToFocus={setIdToFocus}
        addCategoryButtonRef={addCategoryButtonRef}
      />
      <BookmarksImport />
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
