import { v4 as uuidv4 } from "uuid";
import type { Category, Link, State } from "../reducer/models";
import { selectLink, selectLinks } from "../reducer/selectors";

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
  linkCount: number,
) {
  getState().then((state) => {
    const id = uuidv4();
    let updatedItems: Link[];

    const newItem: Link = {
      icon: "",
      id,
      order,
      text,
      url,
    };

    if (order === linkCount) {
      updatedItems = state.categories[categoryId].items = [
        ...state.categories[categoryId].items,
        newItem,
      ];
    } else {
      const items = [...state.categories[categoryId].items];
      items.splice(order, 0, newItem);

      updatedItems = items.map((item, index) => ({
        ...item,
        order: index,
      }));
    }

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

    const reorderedItems = reorderItems(
      state,
      categoryId,
      id,
      order,
      updatedItems,
    );

    setState({
      categories: {
        ...state.categories,
        [categoryId]: {
          ...state.categories[categoryId],
          items: reorderedItems,
        },
      },
      undoState: undefined,
    });
  });
}

function reorderItems(
  state: State,
  categoryId: Category["id"],
  linkId: Link["id"],
  order: Link["order"],
  items: Link[],
): Link[] {
  const link = selectLink(state)(categoryId, linkId);
  if (order === link?.order) return items;

  const links = selectLinks(state)(categoryId);
  const oldIndex = links.findIndex((link) => link.id === linkId);
  const [movedItem] = items.splice(oldIndex, 1);
  items.splice(order, 0, movedItem);

  return items.map((item, index) => ({
    ...item,
    order: index,
  }));
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
