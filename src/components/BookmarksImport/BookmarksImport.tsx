import { Bookmarks } from "@material-symbols-svg/react/icons/bookmarks";
import { useDialog } from "../../hooks/useDialog";
import AddImportCategoryButton from "../Button/AddImportCategoryButton";
import BookmarksImportDialog from "./BookmarksImportDialog";

export default function BookmarksImport() {
  const { dialogRef, setShowDialog, showDialog } = useDialog();

  return (
    <>
      <AddImportCategoryButton
        action={() => setShowDialog(true)}
        icon={<Bookmarks />}
        text="Import Bookmarks"
      />
      {showDialog && (
        <BookmarksImportDialog
          dialogRef={dialogRef}
          close={() => setShowDialog(false)}
        />
      )}
    </>
  );
}
