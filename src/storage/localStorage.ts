import type { State } from "../reducer/models";

export function setState(state: State) {
  browser.storage.local.set(state);
}

export async function getState(): Promise<State> {
  const state = await browser.storage.local.get<State | object>();
  if (!("categories" in state)) return { categories: {} };
  return state;
}
