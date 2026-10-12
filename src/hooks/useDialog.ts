import { useEffect, useRef, useState } from "react";

export function useDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const focusRef = useRef<HTMLElement | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!dialogRef.current) return;

    if (showDialog) {
      dialogRef.current.showModal();
      focusRef.current?.focus();
    } else {
      dialogRef.current.close();
    }
  }, [showDialog]);

  return { dialogRef, focusRef, showDialog, setShowDialog };
}
