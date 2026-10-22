import type { Category, Link } from "../state/models";

export type IconType = "default" | "upload" | "emoji";

export function getIconType<T extends Category | Link>(item: T): IconType {
  if (item.customIconId) {
    return "upload";
  } else if (item.emoji) {
    return "emoji";
  } else {
    return "default";
  }
}
