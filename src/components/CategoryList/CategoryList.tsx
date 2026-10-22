import { useContext, useEffect, useRef } from "react";
import { StateContext } from "../../state/context";
import {
  deleteCategory,
  updateCategories,
} from "../../storage/localStorage/categories";
import { useDeleteWithUndo } from "../../hooks/useDeleteWithUndo";
import { useDropMonitor } from "../../hooks/useDropMonitor";
import { useFlipAnimation } from "../../hooks/useFlipAnimation";
import { useFocusById } from "../../hooks/useFocusById";
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
  const setIdToFocus = useFocusById("category");
  const addCategoryButtonRef = useRef<HTMLButtonElement | null>(null);

  const { deleteItem, isShowUndo, undo, undoButtonRef } = useDeleteWithUndo(
    (id) => deleteCategory(id),
    (index) => getNeighborId(state.categories, index),
    setIdToFocus,
    addCategoryButtonRef,
  );

  const { containerRef, captureFirst } = useFlipAnimation(state.categories);

  useDropMonitor(state.categories, captureFirst, (updadetedCategories) =>
    updateCategories(updadetedCategories),
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    handleArrowKeys<HTMLButtonElement>(e, containerRef, ".category-item");
  }

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
      {state.categories.map((category, index) => (
        <CategoryItem
          key={category.id}
          category={category}
          shouldDisplayHints={shouldDisplayHints}
          deleteCategory={deleteItem}
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
