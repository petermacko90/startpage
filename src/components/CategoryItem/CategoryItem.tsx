import { Edit } from "@material-symbols-svg/react/icons/edit";
import { Delete } from "@material-symbols-svg/react/icons/delete";
import type { Category } from "../../state/models";
import { useDialog } from "../../hooks/useDialog";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import CategoryModal from "../CategoryModal/CategoryModal";
import EditCategory from "../AddEditCategory/EditCategory";
import FloatingButton from "../Button/FloatingButton";
import PageIcon from "../PageIcon/PageIcon";
import "./CategoryItem.css";

export default function CategoryItem({
  category,
  isEditMode,
  deleteCategory,
}: {
  category: Category;
  isEditMode: boolean;
  deleteCategory: (categoryId: Category["id"]) => void;
}) {
  const {
    dialogRef: categoryModalRef,
    setShowDialog: setShowCategoryModal,
    showDialog: showCategoryModal,
  } = useDialog();

  const {
    dialogRef: editCategoryRef,
    focusRef: editCategoryInputRef,
    setShowDialog: setShowEditCategory,
    showDialog: showEditCategory,
  } = useDialog();

  const { isDragging, isOver, ref } = useDragAndDrop<HTMLDivElement>(
    category.id,
  );

  return (
    <div
      className={`category ${isOver ? "is-over" : ""} ${isDragging ? "is-dragging" : ""}`}
      ref={ref}
      data-flip-id={category.id}
    >
      {isEditMode && (
        <FloatingButton
          action={() => setShowEditCategory(true)}
          position="left"
          type="edit"
          tooltip="Edit"
        >
          <Edit />
        </FloatingButton>
      )}
      {isEditMode && (
        <FloatingButton
          action={() => deleteCategory(category.id)}
          position="right"
          type="delete"
          tooltip="Delete"
        >
          <Delete />
        </FloatingButton>
      )}
      <button
        className="category-button"
        onClick={() => setShowCategoryModal(true)}
        title={category.title || "No title"}
      >
        <span className="category-icon">
          {category.items.slice(0, 4).map((link) => (
            <PageIcon
              key={link.id}
              domain={new URL(link.url).hostname}
              size="24px"
            />
          ))}
        </span>
        <span className="category-title overflow">{category.title}</span>
      </button>
      {showCategoryModal && (
        <CategoryModal
          category={category}
          dialogRef={categoryModalRef}
          close={() => setShowCategoryModal(false)}
        />
      )}
      {showEditCategory && (
        <EditCategory
          category={category}
          dialogRef={editCategoryRef}
          inputRef={editCategoryInputRef}
          close={() => setShowEditCategory(false)}
          handleDeleteCategory={deleteCategory}
        />
      )}
    </div>
  );
}
