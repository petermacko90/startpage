import { useContext, useState, type RefObject } from "react";
import { v4 as uuidv4 } from "uuid";
import { StateContext, useDispatchContext } from "../context";
import { selectCategoriesCount } from "../reducer/selectors";
import type { Category } from "../reducer/models";
import "./AddEditCategory.css";

export default function AddEditCategory({
  category,
  dialogRef,
}: {
  category: Category | null;
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  const state = useContext(StateContext);
  const categoriesCount = selectCategoriesCount(state);
  const dispatch = useDispatchContext();
  const [title, setTitle] = useState(category ? category.title : "");

  function handleCategorySave() {
    if (category) {
      dispatch({
        type: "category edited",
        payload: {
          icon: category.icon,
          id: category.id,
          items: category.items,
          order: category.order,
          title: title.trim(),
        },
      });
    } else {
      dispatch({
        type: "category added",
        payload: {
          icon: "",
          id: uuidv4(),
          items: [],
          order: categoriesCount + 1,
          title: title.trim(),
        },
      });

      setTitle("");
    }

    setTimeout(() => dialogRef.current?.close());
  }

  return (
    <dialog closedby="closerequest" ref={dialogRef}>
      <div className="dialog-header">
        <div className="dialog-title overflow">
          {category ? "Edit Category" : "Add Category"}
        </div>
        <button
          title="Close"
          className="close-button"
          onClick={() => dialogRef.current?.close()}
        >
          &times;
        </button>
      </div>
      <div className="dialog-content">
        <div className="form">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCategorySave()}
            maxLength={20}
          />
          <button onClick={() => handleCategorySave()} className="save-button">
            Save
          </button>
        </div>
      </div>
    </dialog>
  );
}
