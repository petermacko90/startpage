import type { Dispatch, RefObject, SetStateAction } from "react";
import { Add } from "@material-symbols-svg/react/icons/add";
import { useDialog } from "../../hooks/useDialog";
import AddCategoryDialog from "./AddCategoryDialog";
import AddImportCategoryButton from "../Button/AddImportCategoryButton";

export default function AddCategory({
  setIdToFocus,
  addCategoryButtonRef,
}: {
  setIdToFocus: Dispatch<SetStateAction<string | null>>;
  addCategoryButtonRef: RefObject<HTMLButtonElement | null>;
}) {
  const { dialogRef, focusRef, setShowDialog, showDialog } = useDialog();

  return (
    <>
      <AddImportCategoryButton
        action={() => setShowDialog(true)}
        icon={<Add />}
        text="Add Category"
        buttonRef={addCategoryButtonRef}
      />
      {showDialog && (
        <AddCategoryDialog
          dialogRef={dialogRef}
          inputRef={focusRef}
          close={(categoryId) => {
            setShowDialog(false);

            if (categoryId) {
              setIdToFocus(categoryId);
            } else {
              setTimeout(() => addCategoryButtonRef.current?.focus());
            }
          }}
        />
      )}
    </>
  );
}
