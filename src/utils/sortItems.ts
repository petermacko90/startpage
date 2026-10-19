import type { Category, Link } from "../state/models";

export function sortItems<T extends Category | Link>(items: T[]): T[] {
  return items.toSorted((a, b) => a.order - b.order);
}
