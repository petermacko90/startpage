import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { Category, Link } from "../state/models";
import { IMAGE_FILETYPE } from "../constants";
import { getImage } from "../storage/indexedDB";
import { useErrorToast } from "./useErrorToast";

export function useImageUpload<T extends Category | Link>(
  customIconIdInitial: T["customIconId"] | undefined,
) {
  const [customIcon, setCustomIcon] = useState<File | null>(null);
  const [customIconId, setCustomIconId] = useState(customIconIdInitial);
  const [customIconSrc, setCustomIconSrc] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [shouldRemoveIcon, setShouldRemoveIcon] = useState(false);
  const uploadIconRef = useRef<HTMLElement>(null);
  const { isError, errorMessage, showErrorToast, clearError } = useErrorToast();

  function handleIconUpload(e: ChangeEvent<HTMLInputElement>) {
    clearError();

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith(IMAGE_FILETYPE)) {
      showErrorToast("Please select an image");
      return;
    }

    setCustomIcon(file);
    setShouldRemoveIcon(false);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleIconDelete() {
    setCustomIcon(null);
    setCustomIconId(null);
    setPreviewUrl(null);
    setCustomIconSrc(null);
    setShouldRemoveIcon(true);
    uploadIconRef.current?.focus();
  }

  useEffect(() => {
    let objectUrl = "";

    async function loadCustomIcon() {
      if (customIconId) {
        try {
          const blob = await getImage(customIconId);

          if (blob) {
            objectUrl = URL.createObjectURL(blob);
            setCustomIconSrc(objectUrl);
          }
        } catch (e) {
          console.error("failed to fetch image from IndexedDB", e);
        }
      }
    }

    loadCustomIcon();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [customIconId]);

  return {
    customIcon,
    customIconId,
    customIconSrc,
    previewUrl,
    shouldRemoveIcon,
    isError,
    errorMessage,
    uploadIconRef,
    handleIconUpload,
    handleIconDelete,
  };
}
