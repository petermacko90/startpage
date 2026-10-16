import { v4 as uuidv4 } from "uuid";
import type { Category, Link, State } from "../../state/models";
import { selectLink } from "../../state/selectors";
import { getCategoryIndex, getState, reorderItems, setState } from "./common";
import {
  removeCustomIcon,
  saveCustomIcon,
  updateCustomIcon,
} from "../customIcon";

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

export async function updateLinks(categoryId: Category["id"], links: Link[]) {
  const state = await getState();
  const index = getCategoryIndex(state, categoryId);

  setState({
    categories: updateCategoryLinks(state, categoryId, index, links),
    undoState: undefined,
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
