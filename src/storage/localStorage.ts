import { v4 as uuidv4 } from "uuid";
import type { Category, Link, State } from "../state/models";
import {
  selectCategoriesCount,
  selectCategory,
  selectLink,
  selectLinks,
} from "../state/selectors";
import { removeImage, saveImage } from "./indexedDB";

export function setState(state: State) {
  browser.storage.local.set(state);
}

export async function getState(): Promise<State> {
  const state = await browser.storage.local.get<State | object>();
  if (!("categories" in state)) return { categories: [] };
  return state;
}

export async function createCategory(
  id: Category["id"],
  order: Category["order"],
  title: Category["title"],
  customIcon: File | null,
  categoriesCount: number,
) {
  const state = await getState();
  const customIconId = await saveCustomIcon(customIcon);

  const newCategory: Category = {
    customIconId,
    id,
    links: [],
    order,
    title,
  };

  let updatedCategories: Category[];

  if (order === categoriesCount) {
    updatedCategories = [...state.categories, newCategory];
  } else {
    const categories = [...state.categories];
    categories.splice(order, 0, newCategory);
    updatedCategories = reorderItems(categories);
  }

  updateCategories(updatedCategories);
}

export async function importCategories(bookmarks: Array<[string, boolean]>) {
  const state = await getState();
  let categoriesCount = selectCategoriesCount(state);

  const bookmarkItems = await Promise.all(
    bookmarks.map(([key]) => browser.bookmarks.getSubTree(key)),
  );

  const newCategories: Category[] = bookmarkItems.map((item) => {
    return {
      customIconId: null,
      id: uuidv4(),
      links:
        item[0].children
          ?.filter((item) => item.url)
          .map((item, index) => {
            return {
              customIconId: null,
              id: uuidv4(),
              order: index,
              title: item.title,
              url: item.url!,
            } as Link;
          }) ?? [],
      order: categoriesCount++,
      title: item[0].title,
    };
  });

  setState({
    categories: [...state.categories, ...newCategories],
    undoState: undefined,
  });
}

export async function updateCategory(
  categoryId: Category["id"],
  title: Category["title"],
  order: Category["order"],
  customIconId: Category["customIconId"],
  customIcon: File | null,
) {
  const state = await getState();
  const index = getCategoryIndex(state, categoryId);
  const updatedCustomIconId = await updateCustomIcon(customIcon, customIconId);

  const updatedCategories = state.categories.map((category) => {
    return category.id === categoryId
      ? {
          ...state.categories[index],
          title,
          order,
          customIconId: updatedCustomIconId,
        }
      : category;
  });

  let reorderedCategories: Category[];

  if (order === state.categories[index].order) {
    reorderedCategories = updatedCategories;
  } else {
    const categories = [...state.categories];
    const [movedCateogory] = categories.splice(index, 1);
    categories.splice(order, 0, movedCateogory);
    reorderedCategories = reorderItems(categories);
  }

  updateCategories(reorderedCategories);
}

export function updateCategories(categories: Category[]) {
  setState({
    categories,
    undoState: undefined,
  });
}

export async function deleteCategory(id: Category["id"]) {
  const state = await getState();
  const links = selectLinks(state)(id);
  await removeCustomIcon(selectCategory(state)(id)!.customIconId);

  links?.forEach(async (link) => {
    await removeCustomIcon(link.customIconId);
  });

  const filteredCategories = state.categories.filter((category) => {
    return category.id !== id;
  });

  const reorderedCategories = reorderItems(filteredCategories);

  setState({
    categories: reorderedCategories,
    undoState: state.categories,
  });
}

export async function createLink(
  categoryId: Category["id"],
  order: Link["order"],
  title: Link["title"],
  url: Link["url"],
  customIcon: File | null,
  linkCount: number,
) {
  const state = await getState();
  const id = uuidv4();
  const customIconId = await saveCustomIcon(customIcon);

  const newLink: Link = {
    customIconId,
    id,
    order,
    title,
    url,
  };

  let updatedLinks: Link[];
  const index = getCategoryIndex(state, categoryId);

  if (order === linkCount) {
    updatedLinks = state.categories[index].links = [
      ...state.categories[index].links,
      newLink,
    ];
  } else {
    const links = [...state.categories[index].links];
    links.splice(order, 0, newLink);
    updatedLinks = reorderItems(links);
  }

  setState({
    categories: updateCategoryLinks(state, categoryId, index, updatedLinks),
    undoState: undefined,
  });
}

export async function updateLink(
  categoryId: Category["id"],
  { customIconId, id, order, title, url }: Link,
  customIcon: File | null,
) {
  const updatedCustomIconId = await updateCustomIcon(customIcon, customIconId);

  const updatedLink: Link = {
    customIconId: updatedCustomIconId,
    id,
    order,
    title,
    url,
  };

  const state = await getState();
  const index = getCategoryIndex(state, categoryId);

  const updatedLinks = state.categories[index].links.map((link) => {
    return link.id === id ? updatedLink : link;
  });

  const reorderedLinks = reorderLinksOnUpdate(
    state,
    categoryId,
    id,
    order,
    updatedLinks,
  );

  setState({
    categories: updateCategoryLinks(state, categoryId, index, reorderedLinks),
    undoState: undefined,
  });
}

export function updateLinks(categoryId: Category["id"], links: Link[]) {
  getState().then((state) => {
    const index = getCategoryIndex(state, categoryId);

    setState({
      categories: updateCategoryLinks(state, categoryId, index, links),
      undoState: undefined,
    });
  });
}

export async function deleteLink(
  categoryId: Category["id"],
  linkId: Link["id"],
) {
  const state = await getState();
  const index = getCategoryIndex(state, categoryId);
  await removeCustomIcon(selectLink(state)(categoryId, linkId)!.customIconId);

  const filteredLinks = state.categories[index].links.filter((link) => {
    return link.id !== linkId;
  });

  const reorderedLinks = reorderItems(filteredLinks);

  setState({
    categories: updateCategoryLinks(state, categoryId, index, reorderedLinks),
    undoState: state.categories,
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

function reorderLinksOnUpdate(
  state: State,
  categoryId: Category["id"],
  linkId: Link["id"],
  order: Link["order"],
  links: Link[],
): Link[] {
  const link = selectLink(state)(categoryId, linkId);
  if (order === link?.order) return links;

  const oldIndex = links.findIndex((link) => link.id === linkId);
  const [movedLink] = links.splice(oldIndex, 1);
  links.splice(order, 0, movedLink);
  return reorderItems(links);
}

function updateCategoryLinks(
  state: State,
  id: Category["id"],
  index: number,
  links: Link[],
): Category[] {
  return state.categories.map((c) => {
    return c.id === id ? { ...state.categories[index], links } : c;
  });
}

async function saveCustomIcon(
  customIcon: File | null,
): Promise<Category["customIconId"] | Link["customIconId"] | null> {
  if (!customIcon) return null;

  try {
    const customIconId = uuidv4();
    await saveImage(customIconId, customIcon);
    return customIconId;
  } catch (e) {
    console.error("failed to upload custom icon", e);
    return null;
  }
}

async function updateCustomIcon(
  customIcon: File | null,
  customIconId: Category["customIconId"] | Link["customIconId"],
): Promise<Category["customIconId"] | Link["customIconId"] | null> {
  if (!customIcon && customIconId) {
    try {
      removeImage(customIconId);
      return null;
    } catch (e) {
      console.error("failed to remove custom icon", e);
      return null;
    }
  }

  if (customIcon) {
    try {
      if (customIconId) {
        try {
          await removeImage(customIconId);
        } catch (e) {
          console.error("failed to remove custom icon", e);
        }
      }

      const updatedCustomIconId = uuidv4();
      await saveImage(updatedCustomIconId, customIcon);
      return updatedCustomIconId;
    } catch (e) {
      console.error("failed to upload custom icon", e);
      return null;
    }
  }

  return customIconId;
}

async function removeCustomIcon(
  customIconId: Category["customIconId"] | Link["customIconId"],
) {
  if (customIconId) {
    try {
      await removeImage(customIconId);
    } catch (e) {
      console.log("failed to remove custom icon", e);
    }
  }
}
