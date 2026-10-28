import {
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import type { Category } from "../../state/models";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { MAX_INDEX_FOR_NUMBER_BADGE, NO_TITLE } from "../../constants";
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
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);

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
          {category.customIconId || category.emoji ? (
            <PageIcon
              domain=""
              id={category.customIconId}
              emoji={category.emoji}
              size="48px"
            />
          ) : (
            category.links
              .slice(0, 4)
              .map((link) => (
                <PageIcon
                  key={link.id}
                  domain={getHostname(link.url)}
                  id={link.customIconId}
                  emoji={link.emoji}
                  size="24px"
                />
              ))
          )}
        </span>
        <span className="category-title overflow">{category.title}</span>
      </button>
      {shouldDisplayHints && category.order <= MAX_INDEX_FOR_NUMBER_BADGE && (
        <NumberBadge index={category.order} />
      )}
      <EditButton action={() => setShowEditCategory(true)} />
      {showCategoryModal && (
        <CategoryModal
          category={category}
          close={() => {
            setShowCategoryModal(false);
            setIdToFocus(category.id);
          }}
        />
      )}
      {showEditCategory && (
        <EditCategory
          category={category}
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
