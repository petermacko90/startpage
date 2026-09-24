import { v4 as uuidv4 } from "uuid";
import type { Category, Link, State } from "../reducer/models";

export function setState(state: State) {
  browser.storage.local.set(state);
}

export async function getState(): Promise<State> {
  const state = await browser.storage.local.get<State | object>();
  if (!("categories" in state)) return { categories: {} };
  return state;
}

export function createCategory(
  order: Category["order"],
  title: Category["title"],
) {
  getState().then((state) => {
    const id = uuidv4();

    setState({
      categories: {
        ...state.categories,
        [id]: {
          icon: "",
          id,
          items: [],
          order,
          title,
        },
      },
      undoState: undefined,
    });
  });
}

export function updateCategory(
  categoryId: Category["id"],
  title: Category["title"],
) {
  getState().then((state) => {
    setState({
      categories: {
        ...state.categories,
        [categoryId]: {
          ...state.categories[categoryId],
          title,
        },
      },
      undoState: undefined,
    });
  });
}

export function deleteCategory(categoryId: Category["id"]) {
  getState().then((state) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [categoryId]: _, ...restCategories } = state.categories;

    setState({
      categories: restCategories,
      undoState: state.categories,
    });
  });
}

export function createLink(
  categoryId: Category["id"],
  order: Link["order"],
  text: Link["text"],
  url: Link["url"],
) {
  getState().then((state) => {
    setState({
      categories: {
        ...state.categories,
        [categoryId]: {
          ...state.categories[categoryId],
          items: [
            ...state.categories[categoryId].items,
            {
              icon: "",
              id: uuidv4(),
              order,
              text,
              url,
            },
          ],
        },
      },
      undoState: undefined,
    });
  });
}

export function updateLink(
  categoryId: Category["id"],
  { icon, id, order, text, url }: Link,
) {
  const updatedLink: Link = {
    icon,
    id,
    order,
    text,
    url,
  };

  getState().then((state) => {
    const updatedItems = state.categories[categoryId].items.map((item) => {
      return item.id === id ? updatedLink : item;
    });

    setState({
      categories: {
        ...state.categories,
        [categoryId]: {
          ...state.categories[categoryId],
          items: updatedItems,
        },
      },
      undoState: undefined,
    });
  });
}

export function updateLinks(categoryId: Category["id"], items: Link[]) {
  getState().then((state) => {
    setState({
      categories: {
        ...state.categories,
        [categoryId]: {
          ...state.categories[categoryId],
          items,
        },
      },
      undoState: undefined,
    });
  });
}

export function deleteLink(categoryId: Category["id"], linkId: Link["id"]) {
  getState().then((state) => {
    setState({
      categories: {
        ...state.categories,
        [categoryId]: {
          ...state.categories[categoryId],
          items: state.categories[categoryId].items.filter((item) => {
            return item.id !== linkId;
          }),
        },
      },
      undoState: state.categories,
    });
  });
}

export function undoState() {
  getState().then((state) => {
    if (!state.undoState) return;
    setState({
      categories: state.undoState,
      undoState: undefined,
    });
  });
}
