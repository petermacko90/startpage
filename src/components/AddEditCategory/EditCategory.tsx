import { useContext, type RefObject } from "react";
import type { Category } from "../../state/models";
import { StateContext } from "../../state/context";
import { updateCategory } from "../../storage/localStorage";
import { selectCategoriesCount } from "../../state/selectors";
import Dialog from "../Dialog/Dialog";
import CategoryForm from "./CategoryForm";

export default function EditCategory({
  category,
  dialogRef,
  inputRef,
  close,
  handleDeleteCategory,
}: {
  category: Category;
  dialogRef: RefObject<HTMLDialogElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  close: () => void;
  handleDeleteCategory: (categoryId: Category["id"], index: number) => void;
}) {
  const state = useContext(StateContext);
  const categoriesCount = selectCategoriesCount(state);

  function handleCategorySave(title: string, order: number) {
    updateCategory(category.id, title.trim(), order);
    close();
  }

  return (
    <Dialog
      closedby="closerequest"
      onClose={close}
      ref={dialogRef}
      title="Edit Category"
    >
      <CategoryForm
        titleInitial={category.title}
        orderInitial={category.order}
        maxOrder={categoriesCount - 1}
        handleCategorySave={handleCategorySave}
        itemId={category.id}
        inputRef={inputRef}
        close={close}
        handleDeleteCategory={() =>
          handleDeleteCategory(category.id, category.order)
        }
      />
    </Dialog>
  );
}
