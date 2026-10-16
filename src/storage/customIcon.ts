import { v4 as uuidv4 } from "uuid";
import type { Category, Link } from "../state/models";
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
    console.error("failed to upload custom icon", e);
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
      console.error("failed to remove custom icon", e);
      return null;
    }
  }

  if (customIcon) {
    try {
      if (customIconId) {
        try {
          await removeImage(customIconId);
        } catch (e) {
          console.error("failed to remove custom icon", e);
        }
      }

      const updatedCustomIconId = uuidv4();
      await saveImage(updatedCustomIconId, customIcon);
      return updatedCustomIconId;
    } catch (e) {
      console.error("failed to upload custom icon", e);
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
      console.log("failed to remove custom icon", e);
    }
  }
}
