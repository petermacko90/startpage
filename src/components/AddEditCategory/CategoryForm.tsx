import { useContext, useState, type RefObject } from "react";
import type { Category } from "../../state/models";
import { StateContext } from "../../state/context";
import { useImageUpload } from "../../hooks/useImageUpload";
import Button from "../Button/Button";
import Form from "../Form/Form";
import FormField from "../Form/FormField";
import ImageUpload from "../Form/ImageUpload";
import OrderInput from "../Form/OrderInput/OrderInput";
import TextInput from "../Form/TextInput";
import Toast from "../Toast/Toast";

export default function CategoryForm({
  titleInitial,
  orderInitial,
  customIconIdInitial,
  maxOrder,
  handleCategorySave,
  itemId,
  inputRef,
  close,
  handleDeleteCategory,
}: {
  titleInitial: string;
  orderInitial: number;
  customIconIdInitial: string | null;
  maxOrder: number;
  handleCategorySave: (
    title: string,
    order: number,
    customIcon: File | null,
    shouldRemoveIcon: boolean,
  ) => void;
  itemId: Category["id"] | null;
  inputRef: RefObject<HTMLInputElement | null>;
  close: () => void;
  handleDeleteCategory?: () => void;
}) {
  const state = useContext(StateContext);
  const [title, setTitle] = useState(titleInitial);
  const [order, setOrder] = useState(orderInitial);

  const {
    customIconId,
    uploadedImage,
    uploadedImageUrl,
    savedIconUrl,
    shouldRemoveIcon,
    isError,
    errorMessage,
    uploadIconRef,
    handleIconUpload,
    handleIconDelete,
  } = useImageUpload(customIconIdInitial);

  return (
    <Form>
      <FormField id="title" labelText="Title:">
        <TextInput
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          onPressEnter={() =>
            handleCategorySave(title, order, uploadedImage, shouldRemoveIcon)
          }
          value={title}
          inputRef={inputRef}
        />
      </FormField>
      <OrderInput
        value={order}
        max={maxOrder}
        setValue={setOrder}
        items={[...state.categories]}
        itemId={itemId}
      />
      <ImageUpload
        label="Upload Icon"
        showDelete={!!customIconId || uploadedImage !== null}
        deleteLabel="Remove Icon"
        previewUrl={uploadedImageUrl ?? savedIconUrl}
        handleUpload={handleIconUpload}
        handleDelete={handleIconDelete}
        focusRef={uploadIconRef}
      />
      <div className="buttons-container">
        <Button
          action={() =>
            handleCategorySave(title, order, uploadedImage, shouldRemoveIcon)
          }
        >
          Save
        </Button>
        <Button action={() => close()}>Close</Button>
        {handleDeleteCategory && (
          <Button type="danger" action={handleDeleteCategory}>
            Delete Category
          </Button>
        )}
      </div>
      <Toast type="error" show={isError} text={errorMessage} />
    </Form>
  );
}
