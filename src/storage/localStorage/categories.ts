import { v4 as uuidv4 } from "uuid";
import type { Category, Link } from "../../state/models";
import { selectCategoriesCount } from "../../state/selectors";
import { getCategoryIndex, getState, reorderItems, setState } from "./common";
import { saveCustomIcon, updateCustomIcon } from "../customIcon";

export async function importCategories(bookmarks: string[]) {
  const state = await getState();
  let categoriesCount = selectCategoriesCount(state);

  const bookmarkItems = await Promise.all(
    bookmarks.map((key) => browser.bookmarks.getSubTree(key)),
  );

  const newCategories: Category[] = bookmarkItems.map((item) => {
    return {
      customIconId: null,
      emoji: null,
      id: uuidv4(),
      links:
        item[0].children
          ?.filter((item) => item.url)
          .map((item, index) => {
            return {
              customIconId: null,
              emoji: null,
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

export async function createCategory({
  id,
  order,
  title,
  emoji,
  customIcon,
  categoriesCount,
}: {
  id: Category["id"];
  order: Category["order"];
  title: Category["title"];
  emoji: Category["emoji"];
  customIcon: File | null;
  categoriesCount: number;
}) {
  const state = await getState();
  const customIconId = await saveCustomIcon(customIcon);

  const newCategory: Category = {
    customIconId,
    emoji,
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

export async function updateCategory({
  categoryId,
  title,
  order,
  emoji,
  customIconId,
  customIcon,
  shouldRemoveIcon,
}: {
  categoryId: Category["id"];
  title: Category["title"];
  order: Category["order"];
  emoji: Category["emoji"];
  customIconId: Category["customIconId"];
  customIcon: File | null;
  shouldRemoveIcon: boolean;
}) {
  const state = await getState();
  const index = getCategoryIndex(state, categoryId);

  const updatedCustomIconId = await updateCustomIcon(
    customIcon,
    customIconId,
    shouldRemoveIcon,
  );

  const updatedCategories = state.categories.map((category) => {
    return category.id === categoryId
      ? {
          ...state.categories[index],
          title,
          order,
          emoji,
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

export async function deleteCategory(id: Category["id"]) {
  const state = await getState();

  const filteredCategories = state.categories.filter((category) => {
    return category.id !== id;
  });

  const reorderedCategories = reorderItems(filteredCategories);

  setState({
    categories: reorderedCategories,
    undoState: state.categories,
  });
}

export function updateCategories(categories: Category[]) {
  setState({
    categories,
    undoState: undefined,
  });
}
