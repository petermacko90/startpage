import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { Category, Link } from "../state/models";
import { IMAGE_FILETYPE } from "../constants";
import { t } from "../utils/i18n";
import { getImage } from "../storage/indexedDB";

export function useImageUpload<T extends Category | Link>(
  customIconIdInitial: T["customIconId"] | undefined,
  setError: Dispatch<SetStateAction<string>>,
) {
  const [customIconId, setCustomIconId] = useState(customIconIdInitial);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [savedIconUrl, setSavedIconUrl] = useState<string | null>(null);
  const uploadIconRef = useRef<HTMLElement>(null);

  function handleIconUpload(e: ChangeEvent<HTMLInputElement>) {
    setError("");

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith(IMAGE_FILETYPE)) {
      setError(t("pleaseSelectImage"));
      return;
    }

    setUploadedImage(file);

    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
    }

    setUploadedImageUrl(URL.createObjectURL(file));
  }

  function handleIconDelete() {
    setError("");
    setUploadedImage(null);
    setCustomIconId(null);
    setUploadedImageUrl(null);
    setSavedIconUrl(null);
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
          console.error(t("failedToFetchImage"), e);
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
    uploadIconRef,
    handleIconUpload,
    handleIconDelete,
  };
}
