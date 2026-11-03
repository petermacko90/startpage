import { useEffect, useEffectEvent, useState } from "react";
import { importCategories } from "../../storage/localStorage/categories";
import { t } from "../../utils/i18n";
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
    showErrorToast(t("failedToLoadBookmarks"));
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
        console.error(t("failedToLoadBookmarks"), e);
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
      showErrorToast(t("noBookmarksSelected"));
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
      title={t("importBookmarks")}
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
        <Button action={() => handleImport()}>{t("import")}</Button>
        <Button action={handleCloseButtonClick}>{t("close")}</Button>
      </div>
      <Toast type="error" show={isError} text={errorMessage} />
    </Dialog>
  );
}
