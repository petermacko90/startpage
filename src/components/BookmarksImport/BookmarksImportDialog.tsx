import { useEffect, useEffectEvent, useState } from "react";
import { importCategories } from "../../storage/localStorage/categories";
import { useDialog } from "../../hooks/useDialog";
import { useErrorToast } from "../../hooks/useErrorToast";
import { useFocusAfterLoading } from "../../hooks/useFocusAfterLoading";
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
  const { isError, errorMessage, showErrorToast, clearError } = useErrorToast();

  const onBookmarkLoadError = useEffectEvent(() => {
    showErrorToast("Failed to load bookmarks");
  });

  useEffect(() => {
    browser.bookmarks
      .getTree()
      .then((bookmarks) => {
        setBookmarks(bookmarks.at(0)?.children ?? []);
        setIsLoading(false);
      })
      .catch((e) => {
        onBookmarkLoadError();
        console.error("Failed to load bookmarks", e);
      });
  }, []);

  const { dialogRef, setDialogRef } = useDialog();

  useFocusAfterLoading({
    isLoading,
    containerRef: dialogRef,
    itemSelector: ".folder-button",
  });

  const [selectedBookmarks, setSelectedBookmarks] = useState<
    Record<string, boolean>
  >({});

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
