import { useEffect, useState, type RefObject } from "react";
import Dialog from "../Dialog/Dialog";
import Form from "../Form/Form";

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
    >
      <Form>
        {bookmarks.map((bookmark) => {
          return (
            <span style={{ color: "var(--color-light-1)" }}>
              {bookmark.title}
            </span>
          );
        })}
      </Form>
    </Dialog>
  );
}
