import type { Category, Link, State } from "./models";

export const selectCategoriesCount = (state: State) => {
  return Object.values(state.categories).length;
};

export const selectLink =
  (state: State) => (categoryId: Category["id"], linkId: Link["id"]) => {
    return state.categories[categoryId].items.find(
      (item) => item.id === linkId,
    );
  };

export const selectLinks = (state: State) => (categoryId: Category["id"]) => {
  return state.categories[categoryId].items;
};
