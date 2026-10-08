import { useState, type Dispatch, type SetStateAction } from "react";
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
                <span title={`${bookmarkItem.title} | ${bookmarkItem.url}`}>
                  {bookmarkItem.title} | {bookmarkItem.url}
                </span>
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
                    {`${showNested[bookmarkItem.id] ? "-" : "+"} ${bookmarkItem.title}`}
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
