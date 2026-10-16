import type { Category, Link } from "../state/models";

export function getNeighborId<T extends Category | Link>(
  items: T[],
  index: number,
): T["id"] | null {
  if (items.length > 1) {
    if (index < items.length - 1) {
      return items[index + 1].id;
    } else {
      return items[index - 1].id;
    }
  }

  return null;
}
