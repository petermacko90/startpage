import { useEffect, useState, type RefObject } from "react";
import BookmarkItems from "./BookmarkItems";
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

  return (
    <Dialog
      closedby="closerequest"
      title="Import Bookmarks"
      ref={dialogRef}
      onClose={close}
      className="bookmarks-import"
    >
      <BookmarkItems bookmarkItems={bookmarks} />
    </Dialog>
  );
}
