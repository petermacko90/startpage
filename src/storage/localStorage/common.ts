import type { Category, Link, State } from "../../state/models";

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

export function reorderItems<T extends Category | Link>(items: T[]): T[] {
  return items.map((item, index) => ({
    ...item,
    order: index,
  }));
}

export function getCategoryIndex(state: State, categoryId: Category["id"]) {
  return state.categories.findIndex((c) => c.id === categoryId);
}
