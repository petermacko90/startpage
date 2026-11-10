import { useContext } from "react";
import type { Category } from "../../state/models";
import { StateContext } from "../../state/context";
import { updateCategory } from "../../storage/localStorage/categories";
import { selectCategoriesCount } from "../../state/selectors";
import { useDialog } from "../../hooks/useDialog";
import { getIconType } from "../../utils/getIconType";
import { t } from "../../utils/i18n";
import Dialog from "../Dialog/Dialog";
import CategoryForm from "./CategoryForm";

export default function EditCategory({
  category,
  close,
  handleDeleteCategory,
}: {
  category: Category;
  close: () => void;
  handleDeleteCategory: (categoryId: Category["id"], index: number) => void;
}) {
  const state = useContext(StateContext);
  const categoriesCount = selectCategoriesCount(state);
  const { dialogRef, setDialogRef } = useDialog("#title");

  function handleCategorySave(
    title: string,
    order: number,
    emoji: string | null,
    customIcon: File | null,
    shouldRemoveIcon: boolean,
  ) {
    updateCategory({
      categoryId: category.id,
      title: title.trim(),
      order,
      emoji,
      customIconId: category.customIconId,
      customIcon,
      shouldRemoveIcon,
    });
    close();
  }

  return (
    <Dialog
      onClose={close}
      onCloseButtonClick={() => dialogRef.current?.close()}
      ref={setDialogRef}
      title={t("editCategory")}
    >
      <CategoryForm
        titleInitial={category.title}
        orderInitial={category.order}
        emojiInitial={category.emoji}
        iconTypeInitial={getIconType(category)}
        customIconIdInitial={category.customIconId}
        maxOrder={categoriesCount - 1}
        handleCategorySave={handleCategorySave}
        itemId={category.id}
        close={close}
        isSynced={!!category.bookmarkFolderId}
        handleDeleteCategory={() =>
          handleDeleteCategory(category.id, category.order)
        }
      />
    </Dialog>
  );
}
