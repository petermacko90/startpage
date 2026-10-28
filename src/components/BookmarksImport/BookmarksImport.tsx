import { useRef, useState } from "react";
import { Bookmarks } from "@material-symbols-svg/react/icons/bookmarks";
import AddImportCategoryButton from "../Button/AddImportCategoryButton";
import BookmarksImportDialog from "./BookmarksImportDialog";

export default function BookmarksImport() {
  const [showDialog, setShowDialog] = useState(false);
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
          close={() => {
            setShowDialog(false);
            buttonRef.current?.focus();
          }}
        />
      )}
    </>
  );
}
