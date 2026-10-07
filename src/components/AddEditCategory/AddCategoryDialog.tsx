import { useContext, type RefObject } from "react";
import { v4 as uuidv4 } from "uuid";
import { StateContext } from "../../state/context";
import { createCategory } from "../../storage/localStorage";
import { selectCategoriesCount } from "../../state/selectors";
import Dialog from "../Dialog/Dialog";
import CategoryForm from "./CategoryForm";
import type { Category } from "../../state/models";

export default function AddCategoryDialog({
  dialogRef,
  inputRef,
  close,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  close: (id?: Category["id"]) => void;
}) {
  const state = useContext(StateContext);
  const categoriesCount = selectCategoriesCount(state);

  function handleCategorySave(title: string, order: number) {
    const id = uuidv4();
    createCategory(id, order, title.trim(), categoriesCount);
    close(id);
  }

  return (
    <Dialog
      closedby="closerequest"
      onClose={close}
      ref={dialogRef}
      title="Add Category"
    >
      <CategoryForm
        titleInitial={""}
        orderInitial={categoriesCount}
        maxOrder={categoriesCount}
        handleCategorySave={handleCategorySave}
        itemId={null}
        inputRef={inputRef}
        close={close}
      />
    </Dialog>
  );
}
