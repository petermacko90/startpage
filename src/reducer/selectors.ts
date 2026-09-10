import type { State } from "./models";

export const selectCategoriesCount = (state: State) =>
  Object.values(state.categories).length;
