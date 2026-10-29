import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Category } from "../../state/models";
import { StateContext } from "../../state/context";
import { createCategory } from "../../storage/localStorage/categories";
import { selectCategoriesCount } from "../../state/selectors";
import { useDialog } from "../../hooks/useDialog";
import CategoryForm from "./CategoryForm";
import Dialog from "../Dialog/Dialog";

export default function AddCategoryDialog({
  close,
}: {
  close: (id?: Category["id"]) => void;
}) {
  const state = useContext(StateContext);
  const categoriesCount = selectCategoriesCount(state);
  const { dialogRef, setDialogRef } = useDialog("#title");

  const [newCategoryId, setNewCategoryId] = useState<string | undefined>(
    undefined,
  );

  function handleCategorySave(
    title: string,
    order: number,
    emoji: string | null,
    customIcon: File | null,
  ) {
    const id = uuidv4();
    setNewCategoryId(id);

    createCategory({
      id,
      order,
      title: title.trim(),
      emoji,
      customIcon,
      categoriesCount,
    });

    handleCloseButtonClick();
  }

  function handleCloseButtonClick() {
    dialogRef.current?.close();
  }

  return (
    <Dialog
      onClose={() => close(newCategoryId)}
      onCloseButtonClick={handleCloseButtonClick}
      ref={setDialogRef}
      title="Add Category"
    >
      <CategoryForm
        titleInitial={""}
        orderInitial={categoriesCount}
        emojiInitial={null}
        iconTypeInitial="default"
        customIconIdInitial={null}
        maxOrder={categoriesCount}
        handleCategorySave={handleCategorySave}
        itemId={null}
        close={handleCloseButtonClick}
      />
    </Dialog>
  );
}
