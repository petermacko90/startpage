import { useContext, type RefObject } from "react";
import { StateContext } from "../../state/context";
import { createCategory } from "../../storage/localStorage";
import { selectCategoriesCount } from "../../state/selectors";
import Dialog from "../Dialog/Dialog";
import CategoryForm from "./CategoryForm";

export default function AddCategory({
  dialogRef,
  inputRef,
  close,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  close: () => void;
}) {
  const state = useContext(StateContext);
  const categoriesCount = selectCategoriesCount(state);

  function handleCategorySave(title: string, order: number) {
    createCategory(order, title.trim(), categoriesCount);
    close();
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
