import type { Dispatch, RefObject, SetStateAction } from "react";
import type { Category } from "../../state/models";
import { useDialog } from "../../hooks/useDialog";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { NO_TITLE } from "../../constants";
import { getHostname } from "../../utils/getHostname";
import CategoryModal from "../CategoryModal/CategoryModal";
import EditCategory from "../AddEditCategory/EditCategory";
import EditButton from "../Button/EditButton";
import NumberBadge from "../NumberBadge/NumberBadge";
import PageIcon from "../PageIcon/PageIcon";
import "./CategoryItem.css";

export default function CategoryItem({
  category,
  shouldDisplayHints,
  initialFocusRef,
  deleteCategory,
  setIdToFocus,
}: {
  category: Category;
  shouldDisplayHints: boolean;
  initialFocusRef: RefObject<HTMLButtonElement | null> | null;
  deleteCategory: (categoryId: Category["id"], index: number) => void;
  setIdToFocus: Dispatch<SetStateAction<Category["id"] | null>>;
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
      className={`category${isOver ? " is-over" : ""}${isDragging ? " is-dragging" : ""}`}
      ref={ref}
      data-flip-id={category.id}
    >
      <button
        id={`category-${category.id}`}
        className="category-button category-item"
        onClick={() => setShowCategoryModal(true)}
        title={category.title || NO_TITLE}
        ref={initialFocusRef}
      >
        <span className="category-icon">
          {category.links.slice(0, 4).map((link) => (
            <PageIcon
              key={link.id}
              domain={getHostname(link.url)}
              id={link.customIconId}
              size="24px"
            />
          ))}
        </span>
        <span className="category-title overflow">{category.title}</span>
      </button>
      {shouldDisplayHints && category.order <= 9 && (
        <NumberBadge index={category.order} />
      )}
      <EditButton action={() => setShowEditCategory(true)} />
      {showCategoryModal && (
        <CategoryModal
          category={category}
          dialogRef={categoryModalRef}
          close={() => {
            setShowCategoryModal(false);
            setIdToFocus(category.id);
          }}
        />
      )}
      {showEditCategory && (
        <EditCategory
          category={category}
          dialogRef={editCategoryRef}
          inputRef={editCategoryInputRef as RefObject<HTMLInputElement>}
          close={() => {
            setShowEditCategory(false);
            setIdToFocus(category.id);
          }}
          handleDeleteCategory={deleteCategory}
        />
      )}
    </div>
  );
}
