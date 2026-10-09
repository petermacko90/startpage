import { useEffect, useState, type RefObject } from "react";
import { importCategories } from "../../storage/localStorage";
import BookmarkItems from "./BookmarkItems";
import Button from "../Button/Button";
import Dialog from "../Dialog/Dialog";
import "./BookmarksImportDialog.css";

export default function BookmarksImportDialog({
  dialogRef,
  close,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  close: () => void;
}) {
  const [bookmarks, setBookmarks] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([]);

  useEffect(() => {
    browser.bookmarks.getTree().then((bookmarks) => {
      setBookmarks(bookmarks.at(0)?.children ?? []);
    });
  }, []);

  const [selectedBookmarks, setSelectedBookmarks] = useState<
    Record<string, boolean>
  >({});

  function handleImport() {
    importCategories(selectedBookmarks);
    close();
  }

  return (
    <Dialog
      closedby="closerequest"
      title="Import Bookmarks"
      ref={dialogRef}
      onClose={close}
      className="bookmarks-import"
    >
      <BookmarkItems
        bookmarkItems={bookmarks}
        selectedBookmarks={selectedBookmarks}
        setSelectedBookmarks={setSelectedBookmarks}
      />
      <div className="buttons-container mt">
        <Button action={() => handleImport()}>Import</Button>
        <Button action={close}>Close</Button>
      </div>
    </Dialog>
  );
}
