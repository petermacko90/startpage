import { v4 as uuidv4 } from "uuid";
import type { Category, Link, State } from "../state/models";
import { selectLink, selectLinks } from "../state/selectors";

export function setState(state: State) {
  browser.storage.local.set(state);
}

export async function getState(): Promise<State> {
  const state = await browser.storage.local.get<State | object>();
  if (!("categories" in state)) return { categories: [] };
  return state;
}

export function createCategory(
  order: Category["order"],
  title: Category["title"],
) {
  getState().then((state) => {
    setState({
      categories: [
        ...state.categories,
        {
          icon: "",
          id: uuidv4(),
          items: [],
          order,
          title,
        },
      ],
    });
  });
}

export function updateCategory(
  categoryId: Category["id"],
  title: Category["title"],
) {
  getState().then((state) => {
    const index = getCategoryIndex(state, categoryId);

    const updatedCategories = state.categories.map((category) => {
      return category.id === categoryId
        ? { ...state.categories[index], title }
        : category;
    });

    setState({
      categories: updatedCategories,
      undoState: undefined,
    });
  });
}

export function updateCategories(categories: Category[]) {
  setState({
    categories,
    undoState: undefined,
  });
}

export function deleteCategory(categoryId: Category["id"]) {
  getState().then((state) => {
    const filteredCategories = state.categories.filter((category) => {
      return category.id !== categoryId;
    });

    setState({
      categories: filteredCategories,
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

    const index = getCategoryIndex(state, categoryId);

    if (order === linkCount) {
      updatedItems = state.categories[index].items = [
        ...state.categories[index].items,
        newItem,
      ];
    } else {
      const items = [...state.categories[index].items];
      items.splice(order, 0, newItem);
      updatedItems = reorderItems(items);
    }

    setState({
      categories: updateCategoryItems(state, categoryId, index, updatedItems),
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
    const index = getCategoryIndex(state, categoryId);

    const updatedItems = state.categories[index].items.map((item) => {
      return item.id === id ? updatedLink : item;
    });

    const reorderedItems = reorderItemsOnUpdate(
      state,
      categoryId,
      id,
      order,
      updatedItems,
    );

    setState({
      categories: updateCategoryItems(state, categoryId, index, reorderedItems),
      undoState: undefined,
    });
  });
}

export function updateLinks(categoryId: Category["id"], items: Link[]) {
  getState().then((state) => {
    const index = getCategoryIndex(state, categoryId);

    setState({
      categories: updateCategoryItems(state, categoryId, index, items),
      undoState: undefined,
    });
  });
}

export function deleteLink(categoryId: Category["id"], linkId: Link["id"]) {
  getState().then((state) => {
    const index = getCategoryIndex(state, categoryId);

    const filteredItems = state.categories[index].items.filter((item) => {
      return item.id !== linkId;
    });

    const reorderedItems = reorderItems(filteredItems);

    setState({
      categories: updateCategoryItems(state, categoryId, index, reorderedItems),
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

export function reorderItems<T extends Category | Link>(items: T[]): T[] {
  return items.map((item, index) => ({
    ...item,
    order: index,
  }));
}

function getCategoryIndex(state: State, categoryId: Category["id"]) {
  return state.categories.findIndex((c) => c.id === categoryId);
}

function reorderItemsOnUpdate(
  state: State,
  categoryId: Category["id"],
  linkId: Link["id"],
  order: Link["order"],
  items: Link[],
): Link[] {
  const link = selectLink(state)(categoryId, linkId);
  if (order === link?.order) return items;

  const links = selectLinks(state)(categoryId);
  const oldIndex = links!.findIndex((link) => link.id === linkId);
  const [movedItem] = items.splice(oldIndex, 1);
  items.splice(order, 0, movedItem);
  return reorderItems(items);
}

function updateCategoryItems(
  state: State,
  id: Category["id"],
  index: number,
  items: Link[],
): Category[] {
  return state.categories.map((c) => {
    return c.id === id ? { ...state.categories[index], items } : c;
  });
}
