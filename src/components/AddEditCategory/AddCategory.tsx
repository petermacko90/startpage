import {
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { Add } from "@material-symbols-svg/react/icons/add";
import AddCategoryDialog from "./AddCategoryDialog";
import AddImportCategoryButton from "../Button/AddImportCategoryButton";

export default function AddCategory({
  setIdToFocus,
  addCategoryButtonRef,
}: {
  setIdToFocus: Dispatch<SetStateAction<string | null>>;
  addCategoryButtonRef: RefObject<HTMLButtonElement | null>;
}) {
  const [showDialog, setShowDialog] = useState(false);

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
          close={(categoryId) => {
            setShowDialog(false);

            if (categoryId) {
              setIdToFocus(categoryId);
            } else {
              addCategoryButtonRef.current?.focus();
            }
          }}
        />
      )}
    </>
  );
}
