import { useContext, useEffect, useRef } from "react";
import { StateContext } from "../../state/context";
import { selectCategory, selectLinks } from "../../state/selectors";
import {
  deleteCategory,
  updateCategories,
} from "../../storage/localStorage/categories";
import { removeCustomIcon } from "../../storage/customIcon";
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

  const { deleteItem, isShowUndo, undo, undoButtonRef } = useDeleteWithUndo({
    onDelete: (id) => deleteCategory(id),
    getNeighborId: (index) => getNeighborId(state.categories, index),
    setIdToFocus,
    removeCustomIcons: (id) => {
      removeCustomIcon(selectCategory(state)(id)!.customIconId);

      selectLinks(state)(id)?.forEach(async (link) => {
        await removeCustomIcon(link.customIconId);
      });
    },
    addItemButtonRef: addCategoryButtonRef,
  });

  const { containerRef, captureFirst } = useFlipAnimation(state.categories);

  useDropMonitor(state.categories, captureFirst, (updadetedCategories) =>
    updateCategories(updadetedCategories),
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    handleArrowKeys<HTMLButtonElement>(e, containerRef, ".category-item");
  }

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
      {state.categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          shouldDisplayHints={shouldDisplayHints}
          deleteCategory={deleteItem}
          setIdToFocus={setIdToFocus}
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
