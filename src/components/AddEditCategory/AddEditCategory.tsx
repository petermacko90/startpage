import { useContext, useState, type RefObject } from "react";
import { StateContext } from "../../context";
import { selectCategoriesCount } from "../../reducer/selectors";
import type { Category } from "../../reducer/models";
import { updateCategory, createCategory } from "../../storage/localStorage";
import Button from "../Button/Button";
import Form from "../Form/Form";
import FormField from "../Form/FormField";
import Dialog from "../Dialog/Dialog";
import TextInput from "../Form/TextInput";

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
      updateCategory(category.id, title.trim());
    } else {
      createCategory(categoriesCount, title.trim());
      setTitle("");
    }

    setTimeout(() => close());
  }

  return (
    <Dialog
      closedby="closerequest"
      onClose={close}
      ref={dialogRef}
      title={category ? "Edit Category" : "Add Category"}
    >
      <Form>
        <FormField id="title" labelText="Title:">
          <TextInput
            id="title"
            onChange={(e) => setTitle(e.target.value)}
            onPressEnter={handleCategorySave}
            value={title}
            maxLength={20}
            inputRef={inputRef}
          />
        </FormField>
        <Button action={() => handleCategorySave()}>Save</Button>
      </Form>
    </Dialog>
  );
}
