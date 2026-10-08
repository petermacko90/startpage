import { useState } from "react";
import "./BookmarkItems.css";

export default function BookmarkItems({
  bookmarkItems,
}: {
  bookmarkItems: chrome.bookmarks.BookmarkTreeNode[];
}) {
  function getUrlOrTitle(
    bookmarkItem: chrome.bookmarks.BookmarkTreeNode,
  ): string {
    return bookmarkItem.url ? bookmarkItem.url : bookmarkItem.title;
  }

  const [showNested, setShowNested] = useState<Record<string, boolean>>({});

  function toggleNested(id: string) {
    setShowNested((prevValue) => ({ ...prevValue, [id]: !prevValue[id] }));
  }

  return (
    <div className="bookmark-container">
      {bookmarkItems.length === 0 && <div>No items</div>}
      {bookmarkItems.map((bookmarkItem) => {
        return (
          <>
            <div
              className="bookmark-item overflow"
              title={getUrlOrTitle(bookmarkItem)}
            >
              {bookmarkItem.url ? (
                <span>{bookmarkItem.url}</span>
              ) : (
                <button
                  className="folder-button"
                  onClick={() => toggleNested(bookmarkItem.id)}
                >
                  <span>{`${showNested[bookmarkItem.id] ? "-" : "+"} ${bookmarkItem.title}`}</span>
                </button>
              )}
            </div>
            {showNested[bookmarkItem.id] && bookmarkItem.children && (
              <BookmarkItems bookmarkItems={bookmarkItem.children} />
            )}
          </>
        );
      })}
    </div>
  );
}
