import { useContext, useState } from "react";
import { type IconType } from "../../utils/getIconType";
import type { Category } from "../../state/models";
import { StateContext } from "../../state/context";
import { useImageUpload } from "../../hooks/useImageUpload";
import { isValidEmoji } from "../../utils/isValidEmoji";
import Button from "../Button/Button";
import EmojiInput from "../Form/EmojiInput";
import Form from "../Form/Form";
import FormField from "../Form/FormField";
import IconSelector from "../Form/IconSelector";
import ImageUpload from "../Form/ImageUpload";
import OrderInput from "../Form/OrderInput/OrderInput";
import TextInput from "../Form/TextInput";

export default function CategoryForm({
  titleInitial,
  orderInitial,
  emojiInitial,
  iconTypeInitial,
  customIconIdInitial,
  maxOrder,
  handleCategorySave,
  itemId,
  close,
  handleDeleteCategory,
}: {
  titleInitial: string;
  orderInitial: number;
  emojiInitial: string | null;
  iconTypeInitial: IconType;
  customIconIdInitial: string | null;
  maxOrder: number;
  handleCategorySave: (
    title: string,
    order: number,
    emoji: string | null,
    customIcon: File | null,
    shouldRemoveIcon: boolean,
  ) => void;
  itemId: Category["id"] | null;
  close: () => void;
  handleDeleteCategory?: () => void;
}) {
  const state = useContext(StateContext);
  const [title, setTitle] = useState(titleInitial);
  const [order, setOrder] = useState(orderInitial);
  const [emoji, setEmoji] = useState(emojiInitial);
  const [emojiError, setEmojiError] = useState("");
  const [customIconError, setCustomIconError] = useState("");
  const [iconType, setIconType] = useState<IconType>(iconTypeInitial);

  const {
    customIconId,
    uploadedImage,
    uploadedImageUrl,
    savedIconUrl,
    uploadIconRef,
    handleIconUpload,
    handleIconDelete,
  } = useImageUpload(customIconIdInitial, setCustomIconError);

  function validateAndSave() {
    if (iconType === "emoji" && !isValidEmoji(emoji?.trim() ?? "")) {
      setEmojiError("Emoji is not valid");
      return;
    }

    if (iconType === "upload" && !uploadedImage) {
      setCustomIconError("Icon is not uploaded");
      return;
    }

    handleCategorySave(
      title,
      order,
      iconType === "emoji" ? emoji : null,
      iconType === "upload" ? uploadedImage : null,
      iconType !== "upload",
    );
  }

  return (
    <Form>
      <FormField id="title" labelText="Title:">
        <TextInput
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          onPressEnter={validateAndSave}
          value={title}
        />
      </FormField>
      <OrderInput
        value={order}
        max={maxOrder}
        setValue={setOrder}
        items={[...state.categories]}
        itemId={itemId}
      />
      <IconSelector iconType={iconType} setIconType={setIconType} />
      {iconType === "upload" && (
        <ImageUpload
          label="Upload Icon"
          showDelete={!!customIconId || uploadedImage !== null}
          deleteLabel="Remove Icon"
          previewUrl={uploadedImageUrl ?? savedIconUrl}
          handleUpload={handleIconUpload}
          handleDelete={handleIconDelete}
          focusRef={uploadIconRef}
          customIconError={customIconError}
        />
      )}
      {iconType === "emoji" && (
        <EmojiInput
          emoji={emoji}
          setEmoji={setEmoji}
          emojiError={emojiError}
          setEmojiError={setEmojiError}
          handleSave={validateAndSave}
        />
      )}
      <div className="buttons-container">
        <Button action={validateAndSave}>Save</Button>
        <Button action={() => close()}>Close</Button>
        {handleDeleteCategory && (
          <Button type="danger" action={handleDeleteCategory}>
            Delete Category
          </Button>
        )}
      </div>
    </Form>
  );
}
