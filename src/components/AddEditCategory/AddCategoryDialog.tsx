import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { StateContext } from "../../state/context";
import { createCategory } from "../../storage/localStorage/categories";
import { selectCategoriesCount } from "../../state/selectors";
import { useDialog } from "../../hooks/useDialog";
import Dialog from "../Dialog/Dialog";
import CategoryForm from "./CategoryForm";
import type { Category } from "../../state/models";

export default function AddCategoryDialog({
  close,
}: {
  close: (id?: Category["id"]) => void;
}) {
  const state = useContext(StateContext);
  const categoriesCount = selectCategoriesCount(state);
  const { setDialogRef } = useDialog("#title");

  function handleCategorySave(
    title: string,
    order: number,
    emoji: string | null,
    customIcon: File | null,
  ) {
    const id = uuidv4();
    createCategory({
      id,
      order,
      title: title.trim(),
      emoji,
      customIcon,
      categoriesCount,
    });
    close(id);
  }

  return (
    <Dialog
      closedby="closerequest"
      onClose={close}
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
        close={close}
      />
    </Dialog>
  );
}
