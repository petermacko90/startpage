import { v4 as uuidv4 } from "uuid";
import type { Category, Link } from "../state/models";
import { t } from "../utils/i18n";
import { removeImage, saveImage } from "./indexedDB";

export async function saveCustomIcon(
  customIcon: File | null,
): Promise<Category["customIconId"] | Link["customIconId"] | null> {
  if (!customIcon) return null;

  try {
    const customIconId = uuidv4();
    await saveImage(customIconId, customIcon);
    return customIconId;
  } catch (e) {
    console.error(t("failedToUploadIcon"), e);
    return null;
  }
}

export async function updateCustomIcon(
  customIcon: File | null,
  customIconId: Category["customIconId"] | Link["customIconId"],
  shouldRemove: boolean,
): Promise<Category["customIconId"] | Link["customIconId"] | null> {
  if (shouldRemove && customIconId) {
    try {
      await removeImage(customIconId);
      return null;
    } catch (e) {
      console.error(t("failedToRemoveIcon"), e);
      return null;
    }
  }

  if (customIcon) {
    try {
      if (customIconId) {
        try {
          await removeImage(customIconId);
        } catch (e) {
          console.error(t("failedToRemoveIcon"), e);
        }
      }

      const updatedCustomIconId = uuidv4();
      await saveImage(updatedCustomIconId, customIcon);
      return updatedCustomIconId;
    } catch (e) {
      console.error(t("failedToUploadIcon"), e);
      return null;
    }
  }

  return customIconId;
}

export async function removeCustomIcon(
  customIconId: Category["customIconId"] | Link["customIconId"],
) {
  if (customIconId) {
    try {
      await removeImage(customIconId);
    } catch (e) {
      console.log(t("failedToRemoveIcon"), e);
    }
  }
}
