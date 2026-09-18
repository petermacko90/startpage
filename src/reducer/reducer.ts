import type { State } from "./models";
import type { Action } from "./actions";

export const initialState: State = {
  categories: {
    ["1"]: {
      icon: "",
      id: "1",
      items: [
        {
          icon: "",
          id: "1",
          order: 1,
          text: "NHL.com",
          url: "https://nhl.com",
        },
        {
          icon: "",
          id: "2",
          order: 2,
          text: "F1 Calendar",
          url: "https://f1calendar.com",
        },
      ],
      order: 1,
      title: "Sport",
    },
    ["2"]: {
      icon: "",
      id: "2",
      items: [
        {
          icon: "",
          id: "1",
          order: 1,
          text: "Steam",
          url: "https://store.steampowered.com/",
        },
        {
          icon: "",
          id: "2",
          order: 2,
          text: "GOG.com",
          url: "https://www.gog.com/en/",
        },
        {
          icon: "",
          id: "3",
          order: 3,
          text: "Epic Games Store",
          url: "https://store.epicgames.com/en-US",
        },
      ],
      order: 2,
      title: "Gaming",
    },
  },
};

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
      return { categories: restCategories, undoState: state.categories };
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
        undoState: state.categories,
      };
    case "undo": {
      if (!state.undoState) return state;
      return {
        ...state,
        categories: state.undoState,
      };
    }
  }
}
