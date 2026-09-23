import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Delete } from "@material-symbols-svg/react/icons/delete";
import { Edit } from "@material-symbols-svg/react/icons/edit";
import type { Category, Link } from "../../reducer/models";
import { UNDO_TIMEOUT } from "../../constants";
import { getState, setState } from "../../storage";
import { useFlipAnimation } from "../../hooks/useFlipAnimation";
import FloatingButton from "../Button/FloatingButton";
import LinkItem from "../LinkItem/LinkItem";
import Toast from "../Toast/Toast";
import "./LinkList.css";

export default function LinkList({
  category,
  isEditMode,
  setIsAddingLink,
  setEditLinkId,
}: {
  category: Category;
  isEditMode: boolean;
  setIsAddingLink: Dispatch<SetStateAction<boolean>>;
  setEditLinkId: Dispatch<SetStateAction<Link["id"] | null>>;
}) {
  const [isShowUndo, setIsShowUndo] = useState(false);
  const undoTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  function deleteLink(linkId: Link["id"]) {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);

    getState().then((state) => {
      setState({
        categories: {
          ...state.categories,
          [category.id]: {
            ...state.categories[category.id],
            items: state.categories[category.id].items.filter((item) => {
              return item.id !== linkId;
            }),
          },
        },
        undoState: state.categories,
      });
    });

    setIsShowUndo(true);
    undoTimerRef.current = setTimeout(() => setIsShowUndo(false), UNDO_TIMEOUT);
  }

  function undo() {
    getState().then((state) => {
      if (!state.undoState) return;
      setState({
        categories: state.undoState,
        undoState: undefined,
      });
    });

    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setIsShowUndo(false);
  }

  function sortItems(items: Link[]): Link[] {
    return items.toSorted((a, b) => a.order - b.order);
  }

  const { containerRef, captureFirst } = useFlipAnimation([category.items]);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const dropTargets = location.current.dropTargets;
        if (dropTargets.length === 0) return;
        const destination = dropTargets[0];
        const sourceId = source.data.id as string;
        const destinationId = destination.data.id as string;
        if (sourceId === destinationId) return;

        const oldIndex = category.items.findIndex(
          (item) => item.id === sourceId,
        );

        const newIndex = category.items.findIndex(
          (item) => item.id === destinationId,
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          captureFirst();
          const reorderedArray = Array.from(category.items);
          const [movedItem] = reorderedArray.splice(oldIndex, 1);
          reorderedArray.splice(newIndex, 0, movedItem);

          const updatedItems = reorderedArray.map((item, index) => ({
            ...item,
            order: index,
          }));

          getState().then((state) => {
            setState({
              categories: {
                ...state.categories,
                [category.id]: {
                  ...state.categories[category.id],
                  items: updatedItems,
                },
              },
              undoState: undefined,
            });
          });
        }
      },
    });
  }, [category.items, category.id, captureFirst]);

  return (
    <div
      className={`links-container${category.items.length === 0 ? "" : " not-empty"}`}
      ref={containerRef}
    >
      {sortItems(category.items).map((link) => (
        <div key={link.id} className="link-container">
          {isEditMode && (
            <FloatingButton
              action={() => {
                setIsAddingLink(false);
                setEditLinkId(link.id);
              }}
              position="left"
              tooltip="Edit"
              type="edit"
            >
              <Edit />
            </FloatingButton>
          )}
          {isEditMode && (
            <FloatingButton
              action={() => deleteLink(link.id)}
              position="right"
              tooltip="Delete"
              type="delete"
            >
              <Delete />
            </FloatingButton>
          )}
          <LinkItem key={link.id} link={link} />
        </div>
      ))}
      <Toast type="undo" show={isShowUndo} text="Link deleted" undo={undo} />
    </div>
  );
}
