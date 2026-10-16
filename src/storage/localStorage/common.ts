import { v4 as uuidv4 } from "uuid";
import type { Category, Link, State } from "../../state/models";
import { removeImage, saveImage } from "../indexedDB";

export function setState(state: State) {
  browser.storage.local.set(state);
}

export async function getState(): Promise<State> {
  const state = await browser.storage.local.get<State | object>();
  if (!("categories" in state)) return { categories: [] };
  return state;
}

export async function undoState() {
  const state = await getState();
  if (!state.undoState) return;

  setState({
    categories: state.undoState,
    undoState: undefined,
  });
}

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
): Promise<Category["customIconId"] | Link["customIconId"] | null> {
  if (!customIcon && customIconId) {
    try {
      removeImage(customIconId);
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

export function reorderItems<T extends Category | Link>(items: T[]): T[] {
  return items.map((item, index) => ({
    ...item,
    order: index,
  }));
}

export function getCategoryIndex(state: State, categoryId: Category["id"]) {
  return state.categories.findIndex((c) => c.id === categoryId);
}
