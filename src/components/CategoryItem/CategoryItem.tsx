import { useEffect, useRef, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { Edit } from "@material-symbols-svg/react/icons/edit";
import { Delete } from "@material-symbols-svg/react/icons/delete";
import type { Category } from "../../state/models";
import CategoryModal from "../CategoryModal/CategoryModal";
import AddEditCategory from "../AddEditCategory/AddEditCategory";
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
  const linksRef = useRef<HTMLDialogElement>(null);
  const [showLinks, setShowLinks] = useState(false);

  const editCategoryRef = useRef<HTMLDialogElement>(null);
  const editCategoryInputRef = useRef<HTMLInputElement | null>(null);
  const [showEditCategory, setShowEditCategory] = useState(false);

  useEffect(() => {
    if (!linksRef.current) return;
    if (showLinks) {
      linksRef.current.showModal();
    } else {
      linksRef.current.close();
    }
  }, [showLinks]);

  useEffect(() => {
    if (!editCategoryRef.current) return;
    if (showEditCategory) {
      editCategoryRef.current.showModal();
      editCategoryInputRef.current?.focus();
    } else {
      editCategoryRef.current.close();
    }
  }, [showEditCategory]);

  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return combine(
      draggable({
        element,
        getInitialData: () => ({ id: category.id }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: ({ container }) => {
              return {
                x: container.offsetWidth / 2,
                y: container.offsetHeight / 2,
              };
            },
            render({ container }) {
              const clone = element.cloneNode(true) as HTMLElement;
              clone.style.width = `${element.offsetWidth}px`;
              clone.style.height = `${element.offsetHeight}px`;
              clone.style.opacity = "0.7";
              clone.style.transform = "scale(1.05)";
              clone.style.boxShadow = "var(--box-shadow-m)";
              container.appendChild(clone);

              return () => {
                container.removeChild(clone);
              };
            },
          });
        },
      }),
      dropTargetForElements({
        element,
        getData: () => ({ id: category.id }),
        onDragEnter: () => setIsOver(true),
        onDragLeave: () => setIsOver(false),
        onDrop: () => setIsOver(false),
      }),
    );
  }, [category.id]);

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
        onClick={() => setShowLinks(true)}
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
      {showLinks && (
        <CategoryModal
          category={category}
          dialogRef={linksRef}
          close={() => setShowLinks(false)}
        />
      )}
      {showEditCategory && (
        <AddEditCategory
          category={category}
          dialogRef={editCategoryRef}
          inputRef={editCategoryInputRef}
          close={() => setShowEditCategory(false)}
        />
      )}
    </div>
  );
}
