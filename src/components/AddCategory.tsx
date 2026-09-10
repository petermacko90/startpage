import { useContext, useState, type RefObject } from "react";
import { v4 as uuidv4 } from "uuid";
import { StateContext, useDispatchContext } from "../context";
import { selectCategoriesCount } from "../reducer/selectors";
import "./AddCategory.css";

export default function AddCategory({
  dialogRef,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  const state = useContext(StateContext);
  const categoriesCount = selectCategoriesCount(state);
  const dispatch = useDispatchContext();
  const [title, setTitle] = useState("");

  function handleCategorySave(title: string) {
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
    dialogRef.current?.close();
  }

  return (
    <dialog closedby="closerequest" ref={dialogRef}>
      <div className="dialog-header">
        <div className="dialog-title overflow">Add Category</div>
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
            maxLength={20}
          />
          <button
            onClick={() => handleCategorySave(title)}
            className="save-button"
          >
            Save
          </button>
        </div>
      </div>
    </dialog>
  );
}
