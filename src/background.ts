import type { Link } from "./state/models";
import { getState, setState } from "./storage/localStorage/common";
import { removeCustomIcon } from "./storage/customIcon";

async function syncFolder(bookmarkFolderId: string) {
  const categories = (await getState()).categories;

  const categoryIndex = categories.findIndex(
    (c) => c.bookmarkFolderId === bookmarkFolderId,
  );

  if (categoryIndex === -1) return;

  try {
    const [folderTree] = await browser.bookmarks.getSubTree(bookmarkFolderId);
    const browserBookmarks = folderTree.children ?? [];

    const existingLinksMap = new Map<string, Link>();

    categories.forEach((category) => {
      category.links.forEach((link) => {
        existingLinksMap.set(link.id, link);
      });
    });

    const oldLinksInTrackedCategory = categories[categoryIndex].links;

    const newBookmarkIds = new Set(
      browserBookmarks.filter((b) => b.url).map((b) => b.id),
    );

    const removedLinks = oldLinksInTrackedCategory.filter(
      (oldLink) => !newBookmarkIds.has(oldLink.id),
    );

    for (const removedLink of removedLinks) {
      if (removedLink.customIconId) {
        await removeCustomIcon(removedLink.customIconId);
      }
    }

    const updatedLinks: Link[] = browserBookmarks
      .filter((b) => b.url)
      .map((b, index) => {
        const previousData = existingLinksMap.get(b.id);

        return {
          id: b.id,
          customIconId: previousData ? previousData.customIconId : null,
          emoji: previousData ? previousData.emoji : null,
          title: b.title,
          url: b.url!,
          order: index,
        };
      });

    categories[categoryIndex].links = updatedLinks;
    categories[categoryIndex].title = folderTree.title;

    await browser.storage.local.set({ categories });
  } catch (error) {
    console.error("Failed to sync", error);
  }
}

browser.bookmarks.onCreated.addListener((_id, bookmark) => {
  if (bookmark.parentId) syncFolder(bookmark.parentId);
});

browser.bookmarks.onRemoved.addListener(async (id, removeInfo) => {
  if (!removeInfo.node.url) {
    let categories = (await getState()).categories;

    const categoryIndex = categories.findIndex(
      (c) => c.bookmarkFolderId === id,
    );

    if (categoryIndex !== -1) {
      for (const link of categories[categoryIndex].links) {
        if (link.customIconId) {
          await removeCustomIcon(link.customIconId);
        }
      }

      categories.splice(categoryIndex, 1);
      categories = categories.map((cat, index) => ({ ...cat, order: index }));
      setState({ categories });
      return;
    }
  }

  if (removeInfo.parentId) {
    await syncFolder(removeInfo.parentId);
  }
});

browser.bookmarks.onChanged.addListener(async (id) => {
  try {
    await syncFolder(id);
    const [bookmark] = await browser.bookmarks.get(id);
    if (bookmark.parentId) await syncFolder(bookmark.parentId);
  } catch (e) {
    console.error(e);
  }
});

browser.bookmarks.onMoved.addListener((_id, moveInfo) => {
  syncFolder(moveInfo.oldParentId);
  syncFolder(moveInfo.parentId);
});
