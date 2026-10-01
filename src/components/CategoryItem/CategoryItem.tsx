import type { Category } from "../../state/models";
import { useDialog } from "../../hooks/useDialog";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import CategoryModal from "../CategoryModal/CategoryModal";
import EditCategory from "../AddEditCategory/EditCategory";
import EditButton from "../Button/EditButton";
import NumberBadge from "../NumberBadge/NumberBadge";
import PageIcon from "../PageIcon/PageIcon";
import "./CategoryItem.css";

export default function CategoryItem({
  category,
  isAppFocused,
  deleteCategory,
}: {
  category: Category;
  isAppFocused: boolean;
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
      {isAppFocused && category.order <= 9 && (
        <NumberBadge index={category.order} />
      )}
      <EditButton action={() => setShowEditCategory(true)} />
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
