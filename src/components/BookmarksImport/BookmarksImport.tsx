import { useRef } from "react";
import { Bookmarks } from "@material-symbols-svg/react/icons/bookmarks";
import { useDialog } from "../../hooks/useDialog";
import AddImportCategoryButton from "../Button/AddImportCategoryButton";
import BookmarksImportDialog from "./BookmarksImportDialog";

export default function BookmarksImport() {
  const { dialogRef, setShowDialog, showDialog } = useDialog();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <AddImportCategoryButton
        action={() => setShowDialog(true)}
        icon={<Bookmarks />}
        text="Import Bookmarks"
        buttonRef={buttonRef}
      />
      {showDialog && (
        <BookmarksImportDialog
          dialogRef={dialogRef}
          close={() => {
            setShowDialog(false);
            setTimeout(() => buttonRef.current?.focus());
          }}
        />
      )}
    </>
  );
}
