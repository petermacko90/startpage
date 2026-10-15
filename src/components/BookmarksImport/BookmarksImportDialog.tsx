import { useEffect, useState, type RefObject } from "react";
import { importCategories } from "../../storage/localStorage/categories";
import { useErrorToast } from "../../hooks/useToastError";
import BookmarkItems from "./BookmarkItems";
import Button from "../Button/Button";
import Dialog from "../Dialog/Dialog";
import Toast from "../Toast/Toast";
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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    browser.bookmarks.getTree().then((bookmarks) => {
      setBookmarks(bookmarks.at(0)?.children ?? []);
      setIsLoading(false);
    });
  }, []);

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

    const bookmarks = Object.entries(selectedBookmarks).filter(
      ([, value]) => value,
    );

    if (bookmarks.length === 0) {
      showErrorToast("No bookmarks selected.");
      return;
    }

    importCategories(bookmarks);
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
      <Toast type="error" show={isError} text={errorMessage} />
    </Dialog>
  );
}
