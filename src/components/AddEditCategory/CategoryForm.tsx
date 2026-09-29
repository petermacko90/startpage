import { useContext, useState, type RefObject } from "react";
import { StateContext } from "../../state/context";
import Form from "../Form/Form";
import FormField from "../Form/FormField";
import OrderInput from "../Form/OrderInput";
import TextInput from "../Form/TextInput";
import Button from "../Button/Button";

export default function CategoryForm({
  titleInitial,
  orderInitial,
  maxOrder,
  handleCategorySave,
  itemId,
  inputRef,
  close,
  handleDeleteCategory,
}: {
  titleInitial: string;
  orderInitial: number;
  maxOrder: number;
  handleCategorySave: (title: string, order: number) => void;
  itemId: string | null;
  inputRef: RefObject<HTMLInputElement | null>;
  close: () => void;
  handleDeleteCategory?: () => void;
}) {
  const state = useContext(StateContext);

  const [title, setTitle] = useState(titleInitial);
  const [order, setOrder] = useState(orderInitial);

  return (
    <Form>
      <FormField id="title" labelText="Title:">
        <TextInput
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          onPressEnter={() => handleCategorySave(title, order)}
          value={title}
          inputRef={inputRef}
        />
      </FormField>
      <FormField id="order" labelText="Order:">
        <OrderInput
          id="order"
          value={order}
          max={maxOrder}
          setValue={setOrder}
          items={[...state.categories]}
          itemId={itemId}
        />
      </FormField>
      <div className="buttons-container">
        <Button action={() => handleCategorySave(title, order)}>Save</Button>
        <Button action={close}>Close</Button>
        {handleDeleteCategory && (
          <Button action={handleDeleteCategory}>Delete Category</Button>
        )}
      </div>
    </Form>
  );
}
