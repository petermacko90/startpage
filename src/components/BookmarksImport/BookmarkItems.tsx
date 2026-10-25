import { useState, type Dispatch, type SetStateAction } from "react";
import { Add } from "@material-symbols-svg/react/icons/add";
import { Remove } from "@material-symbols-svg/react/icons/remove";
import "./BookmarkItems.css";

export default function BookmarkItems({
  bookmarkItems,
  selectedBookmarks,
  setSelectedBookmarks,
}: {
  bookmarkItems: chrome.bookmarks.BookmarkTreeNode[];
  selectedBookmarks: Record<string, boolean>;
  setSelectedBookmarks: Dispatch<SetStateAction<Record<string, boolean>>>;
}) {
  const [showNested, setShowNested] = useState<Record<string, boolean>>({});

  function toggleNested(id: string) {
    setShowNested((prevValue) => ({ ...prevValue, [id]: !prevValue[id] }));
  }

  function handleCheck(id: string, checked: boolean) {
    setSelectedBookmarks((prevValue) => ({ ...prevValue, [id]: checked }));
  }

  return (
    <div className="bookmark-container">
      {bookmarkItems.length === 0 && <div>No items</div>}
      {bookmarkItems.map((bookmarkItem) => {
        return (
          <>
            <div className="bookmark-item overflow">
              {bookmarkItem.url ? (
                <div
                  title={`${bookmarkItem.title} | ${bookmarkItem.url}`}
                  className="bookmark-link overflow"
                >
                  {bookmarkItem.title} | {bookmarkItem.url}
                </div>
              ) : (
                <>
                  <input
                    type="checkbox"
                    value={bookmarkItem.id}
                    onChange={(e) =>
                      handleCheck(bookmarkItem.id, e.target.checked)
                    }
                  />
                  <button
                    className="folder-button"
                    onClick={() => toggleNested(bookmarkItem.id)}
                    title={bookmarkItem.title}
                  >
                    <span>
                      {showNested[bookmarkItem.id] ? (
                        <Remove size={20} />
                      ) : (
                        <Add size={20} />
                      )}
                    </span>
                    <span>{bookmarkItem.title}</span>
                  </button>
                </>
              )}
            </div>
            {showNested[bookmarkItem.id] && bookmarkItem.children && (
              <BookmarkItems
                bookmarkItems={bookmarkItem.children}
                selectedBookmarks={selectedBookmarks}
                setSelectedBookmarks={setSelectedBookmarks}
              />
            )}
          </>
        );
      })}
    </div>
  );
}
