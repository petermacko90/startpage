import { describe, expect, it } from "vitest";
import type { Category, Link } from "../state/models";
import { getNeighborId } from "./getNeighborId";

describe("getNeighborId", () => {
  it("should return null if there is one item", () => {
    const category: Category = {
      customIconId: null,
      emoji: null,
      id: "123",
      links: [],
      order: 0,
      title: "",
    };

    expect(getNeighborId([category], 0)).toBe(null);
  });

  it("should return next item if there is an item after the index", () => {
    const links: Link[] = [
      {
        customIconId: null,
        emoji: null,
        id: "0",
        order: 0,
        title: "",
        url: "",
      },
      {
        customIconId: null,
        emoji: null,
        id: "1",
        order: 1,
        title: "",
        url: "",
      },
      {
        customIconId: null,
        emoji: null,
        id: "2",
        order: 2,
        title: "",
        url: "",
      },
    ];

    expect(getNeighborId(links, 1)).toBe("2");
  });

  it("should return previous item if there is no item after the index", () => {
    const links: Link[] = [
      {
        customIconId: null,
        emoji: null,
        id: "0",
        order: 0,
        title: "",
        url: "",
      },
      {
        customIconId: null,
        emoji: null,
        id: "1",
        order: 1,
        title: "",
        url: "",
      },
      {
        customIconId: null,
        emoji: null,
        id: "2",
        order: 2,
        title: "",
        url: "",
      },
    ];

    expect(getNeighborId(links, 2)).toBe("1");
  });
});
