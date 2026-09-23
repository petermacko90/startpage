import { useContext, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from "uuid";
import { StateContext } from "../../context";
import { selectCategoriesCount } from "../../reducer/selectors";
import type { Category } from "../../reducer/models";
import { getState, setState } from "../../storage";
import Button from "../Button/Button";
import CloseButton from "../Button/CloseButton";
import Form from "../Form/Form";
import FormField from "../Form/FormField";

export default function AddEditCategory({
  category,
  dialogRef,
  inputRef,
  close,
}: {
  category: Category | null;
  dialogRef: RefObject<HTMLDialogElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  close: () => void;
}) {
  const state = useContext(StateContext);
  const categoriesCount = selectCategoriesCount(state);
  const [title, setTitle] = useState(category ? category.title : "");

  function handleCategorySave() {
    if (category) {
      getState().then((state) => {
        setState({
          categories: {
            ...state.categories,
            [category.id]: {
              ...state.categories[category.id],
              title: title.trim(),
            },
          },
          undoState: undefined,
        });
      });
    } else {
      getState().then((state) => {
        const id = uuidv4();
        setState({
          categories: {
            ...state.categories,
            [id]: {
              icon: "",
              id,
              items: [],
              order: categoriesCount,
              title: title.trim(),
            },
          },
          undoState: undefined,
        });
      });

      setTitle("");
    }

    setTimeout(() => close());
  }

  return createPortal(
    <dialog closedby="closerequest" ref={dialogRef} onClose={close}>
      <div className="dialog-header">
        <div></div>
        <div className="dialog-title overflow">
          {category ? "Edit Category" : "Add Category"}
        </div>
        <CloseButton action={() => close()} />
      </div>
      <div className="dialog-content">
        <Form>
          <FormField
            id="title"
            labelText="Title:"
            onChange={(e) => setTitle(e.target.value)}
            onPressEnter={handleCategorySave}
            value={title}
            maxLength={20}
            inputRef={inputRef}
          />
          <Button action={() => handleCategorySave()}>Save</Button>
        </Form>
      </div>
    </dialog>,
    document.body,
  );
}
