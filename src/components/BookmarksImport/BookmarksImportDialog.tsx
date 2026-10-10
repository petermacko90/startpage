import { useEffect, useState, type RefObject } from "react";
import { ERROR_TIMEOUT } from "../../constants";
import { importCategories } from "../../storage/localStorage";
import { useTimer } from "../../hooks/useTimer";
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

  useEffect(() => {
    browser.bookmarks.getTree().then((bookmarks) => {
      setBookmarks(bookmarks.at(0)?.children ?? []);
    });
  }, []);

  const [selectedBookmarks, setSelectedBookmarks] = useState<
    Record<string, boolean>
  >({});

  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { clearTimer, startTimer } = useTimer();

  function handleImport() {
    setIsError(false);
    clearTimer();

    const bookmarks = Object.entries(selectedBookmarks).filter(
      ([, value]) => value,
    );

    if (bookmarks.length === 0) {
      setIsError(true);
      setErrorMessage("No bookmarks selected.");
      startTimer(() => setIsError(false), ERROR_TIMEOUT);
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
