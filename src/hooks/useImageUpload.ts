import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { Category, Link } from "../state/models";
import { IMAGE_FILETYPE } from "../constants";
import { getImage } from "../storage/indexedDB";
import { useErrorToast } from "./useErrorToast";

export function useImageUpload<T extends Category | Link>(
  customIconIdInitial: T["customIconId"] | undefined,
) {
  const [customIconId, setCustomIconId] = useState(customIconIdInitial);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [savedIconUrl, setSavedIconUrl] = useState<string | null>(null);
  const [shouldRemoveIcon, setShouldRemoveIcon] = useState(false);
  const { isError, errorMessage, showErrorToast, clearError } = useErrorToast();
  const uploadIconRef = useRef<HTMLElement>(null);

  function handleIconUpload(e: ChangeEvent<HTMLInputElement>) {
    clearError();

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith(IMAGE_FILETYPE)) {
      showErrorToast("Please select an image");
      return;
    }

    setUploadedImage(file);
    setShouldRemoveIcon(false);

    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
    }

    setUploadedImageUrl(URL.createObjectURL(file));
  }

  function handleIconDelete() {
    setUploadedImage(null);
    setCustomIconId(null);
    setUploadedImageUrl(null);
    setSavedIconUrl(null);
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
            setSavedIconUrl(objectUrl);
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
    customIconId,
    uploadedImage,
    uploadedImageUrl,
    savedIconUrl,
    shouldRemoveIcon,
    isError,
    errorMessage,
    uploadIconRef,
    handleIconUpload,
    handleIconDelete,
  };
}
