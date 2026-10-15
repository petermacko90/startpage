import {
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type RefObject,
} from "react";
import type { Category } from "../../state/models";
import { IMAGE_FILETYPE } from "../../constants";
import { StateContext } from "../../state/context";
import { getImage } from "../../storage/indexedDB";
import { useErrorToast } from "../../hooks/useToastError";
import Button from "../Button/Button";
import Form from "../Form/Form";
import FormField from "../Form/FormField";
import ImageUpload from "../Form/ImageUpload";
import OrderInput from "../Form/OrderInput";
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
  ) => void;
  itemId: Category["id"] | null;
  inputRef: RefObject<HTMLInputElement | null>;
  close: () => void;
  handleDeleteCategory?: () => void;
}) {
  const state = useContext(StateContext);

  const [title, setTitle] = useState(titleInitial);
  const [order, setOrder] = useState(orderInitial);
  const [customIcon, setCustomIcon] = useState<File | null>(null);
  const [customIconId, setCustomIconId] = useState(customIconIdInitial);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { isError, errorMessage, showErrorToast, clearError } = useErrorToast();

  function handleIconUpload(e: ChangeEvent<HTMLInputElement>) {
    clearError();

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith(IMAGE_FILETYPE)) {
      showErrorToast("Please select an image");
      return;
    }

    setCustomIcon(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
  }

  const uploadIconRef = useRef<HTMLElement>(null);
  const [customIconSrc, setCustomIconSrc] = useState<string | null>(null);

  function handleIconDelete() {
    setCustomIcon(null);
    setCustomIconId(null);
    setPreviewUrl(null);
    setCustomIconSrc(null);
    uploadIconRef.current?.focus();
  }

  useEffect(() => {
    let objectUrl = "";

    async function loadCustomIcon() {
      if (customIconId) {
        try {
          const blob = await getImage(customIconId);

          if (blob) {
            objectUrl = URL.createObjectURL(blob);
            setCustomIconSrc(objectUrl);
          }
        } catch (e) {
          console.error("failed to fetch image from IndexedDB", e);
        }
      }
    }

    loadCustomIcon();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [customIconId]);

  return (
    <Form>
      <FormField id="title" labelText="Title:">
        <TextInput
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          onPressEnter={() => handleCategorySave(title, order, customIcon)}
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
        showDelete={!!customIconId || customIcon !== null}
        deleteLabel="Remove Icon"
        previewUrl={previewUrl ?? customIconSrc}
        handleUpload={handleIconUpload}
        handleDelete={handleIconDelete}
        focusRef={uploadIconRef}
      />
      <div className="buttons-container">
        <Button action={() => handleCategorySave(title, order, customIcon)}>
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
