import type { Category, Link, State } from "./models";

export const selectCategoriesCount = (state: State) => {
  return state.categories.length;
};

export const selectCategory =
  (state: State) => (categoryId: Category["id"]) => {
    return state.categories.find((category) => category.id === categoryId);
  };

export const selectLinks = (state: State) => (categoryId: Category["id"]) => {
  return selectCategory(state)(categoryId)?.links;
};

export const selectLink =
  (state: State) => (categoryId: Category["id"], linkId: Link["id"]) => {
    return selectLinks(state)(categoryId)?.find((link) => link.id === linkId);
  };
