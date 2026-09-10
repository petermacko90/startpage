import { useContext, useRef } from "react";
import { StateContext } from "../context";
import { selectCategoriesCount } from "../reducer/selectors";
import Category from "./Category";
import AddCategory from "./AddCategory";
import "./Categories.css";

export default function Categories({ isEditMode }: { isEditMode: boolean }) {
  const state = useContext(StateContext);
  const categoriesCount = selectCategoriesCount(state);
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <main>
      {Object.values(state.categories).map((category) => (
        <Category
          key={category.id}
          category={category}
          isEditMode={isEditMode}
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
      <AddCategory dialogRef={dialogRef} />
    </main>
  );
}
