import { useEffect, useState } from "react";
import { importCategories } from "../../storage/localStorage/categories";
import { useDialog } from "../../hooks/useDialog";
import { useErrorToast } from "../../hooks/useErrorToast";
import BookmarkItems from "./BookmarkItems";
import Button from "../Button/Button";
import Dialog from "../Dialog/Dialog";
import Toast from "../Toast/Toast";
import "./BookmarksImportDialog.css";

export default function BookmarksImportDialog({
  close,
}: {
  close: () => void;
}) {
  const [bookmarks, setBookmarks] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    browser.bookmarks.getTree().then((bookmarks) => {
      setBookmarks(bookmarks.at(0)?.children ?? []);
      setIsLoading(false);
    });
  }, []);

  const { dialogRef, setDialogRef } = useDialog();

  useEffect(() => {
    if (isLoading || !dialogRef.current) return;

    const firstBookmark = dialogRef.current.querySelector(
      ".folder-button",
    ) as HTMLButtonElement;

    if (firstBookmark) {
      firstBookmark.focus();
    }
  }, [isLoading, dialogRef]);

  const [selectedBookmarks, setSelectedBookmarks] = useState<
    Record<string, boolean>
  >({});

  const { isError, errorMessage, showErrorToast, clearError } = useErrorToast();

  function handleImport() {
    clearError();

    const bookmarks = Object.keys(selectedBookmarks).filter(
      (key) => selectedBookmarks[key],
    );

    if (bookmarks.length === 0) {
      showErrorToast("No bookmarks selected.");
      return;
    }

    importCategories(bookmarks);
    handleCloseButtonClick();
  }

  function handleCloseButtonClick() {
    dialogRef.current?.close();
  }

  return (
    <Dialog
      title="Import Bookmarks"
      ref={setDialogRef}
      onClose={close}
      onCloseButtonClick={handleCloseButtonClick}
      className="bookmarks-import"
    >
      <BookmarkItems
        bookmarkItems={bookmarks}
        selectedBookmarks={selectedBookmarks}
        setSelectedBookmarks={setSelectedBookmarks}
      />
      <div className="buttons-container mt">
        <Button action={() => handleImport()}>Import</Button>
        <Button action={handleCloseButtonClick}>Close</Button>
      </div>
      <Toast type="error" show={isError} text={errorMessage} />
    </Dialog>
  );
}
