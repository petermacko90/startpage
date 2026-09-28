import { useContext, useState, type RefObject } from "react";
import { StateContext } from "../../state/context";
import { selectCategoriesCount } from "../../state/selectors";
import type { Category } from "../../state/models";
import { updateCategory, createCategory } from "../../storage/localStorage";
import Button from "../Button/Button";
import Form from "../Form/Form";
import FormField from "../Form/FormField";
import Dialog from "../Dialog/Dialog";
import TextInput from "../Form/TextInput";
import OrderInput from "../Form/OrderInput";

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
  const [order, setOrder] = useState(
    category ? category.order : categoriesCount,
  );

  function handleCategorySave() {
    if (category) {
      updateCategory(category.id, title.trim(), order);
    } else {
      createCategory(order, title.trim(), categoriesCount);
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
            inputRef={inputRef}
          />
        </FormField>
        <FormField id="order" labelText="Order:">
          <OrderInput
            id="order"
            value={order}
            max={category ? categoriesCount - 1 : categoriesCount}
            setValue={setOrder}
            items={[...state.categories]}
            itemId={category?.id ?? null}
            isEditing={category ? true : false}
          />
        </FormField>
        <div className="buttons-container">
          <Button action={() => handleCategorySave()}>Save</Button>
          <Button action={close}>Close</Button>
        </div>
      </Form>
    </Dialog>
  );
}
