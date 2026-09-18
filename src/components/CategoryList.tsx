import { useContext, useEffect, useRef, useState } from "react";
import { StateContext, useDispatchContext } from "../context";
import type { Category } from "../reducer/models";
import { selectCategoriesCount } from "../reducer/selectors";
import { UNDO_TIMEOUT } from "../constants";
import CategoryItem from "./CategoryItem";
import AddEditCategory from "./AddEditCategory";
import UndoToast from "./UndoToast/UndoToast";
import "./CategoryList.css";

export default function CategoryList({ isEditMode }: { isEditMode: boolean }) {
  const state = useContext(StateContext);
  const categoriesCount = selectCategoriesCount(state);
  const dispatch = useDispatchContext();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [isShowUndo, setIsShowUndo] = useState(false);
  const undoTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  function deleteCategory(categoryId: Category["id"]) {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    dispatch({ type: "category deleted", payload: categoryId });
    setIsShowUndo(true);
    undoTimerRef.current = setTimeout(() => setIsShowUndo(false), UNDO_TIMEOUT);
  }

  function undo() {
    dispatch({ type: "undo" });
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
          deleteCategory={deleteCategory}
        />
      ))}
      {(categoriesCount === 0 || isEditMode) && (
        <button
          className="add-category"
          onClick={() => dialogRef.current?.showModal()}
          title="Add Category"
        >
          +
        </button>
      )}
      <AddEditCategory dialogRef={dialogRef} category={null} />
      <UndoToast show={isShowUndo} text="Category deleted" undo={undo} />
    </main>
  );
}
