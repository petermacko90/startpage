import type { Link } from "../state/models";

export type IconType = "default" | "upload" | "emoji";

export function getIconType(link: Link): IconType {
  if (link.customIconId) {
    return "upload";
  } else if (link.emoji) {
    return "emoji";
  } else {
    return "default";
  }
}
