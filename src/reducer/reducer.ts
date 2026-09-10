import type { State } from "./models";
import type { Action } from "./actions";

export const initialState: State = { categories: {} };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "fetched":
      return action.payload;
    case "category added":
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.payload.id]: action.payload,
        },
      };
    case "category edited":
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.payload.id]: action.payload,
        },
      };
    case "category deleted": {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.payload]: _, ...restCategories } = state.categories;
      return { categories: restCategories };
    }
    case "link added":
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.payload.categoryId]: {
            ...state.categories[action.payload.categoryId],
            items: [
              ...state.categories[action.payload.categoryId].items,
              action.payload.link,
            ],
          },
        },
      };
    case "link edited": {
      const newItems = state.categories[action.payload.categoryId].items.map(
        (item) => {
          return item.id === action.payload.link.id
            ? action.payload.link
            : item;
        },
      );
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.payload.categoryId]: {
            ...state.categories[action.payload.categoryId],
            items: newItems,
          },
        },
      };
    }
    case "link deleted":
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.payload.categoryId]: {
            ...state.categories[action.payload.categoryId],
            items: state.categories[action.payload.categoryId].items.filter(
              (item) => item.id !== action.payload.linkId,
            ),
          },
        },
      };
  }
}
