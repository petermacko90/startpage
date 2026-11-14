import { describe, expect, it } from "vitest";
import type { Category, Link } from "../state/models";
import { getIconType } from "./getIconType";

describe("getIconType", () => {
  it("should return 'upload' if category has customIconId", () => {
    const category: Category = {
      customIconId: "123",
      emoji: null,
      id: "456",
      links: [],
      order: 0,
      title: "",
    };

    expect(getIconType(category)).toBe("upload");
  });

  it("should return 'emoji' if link has emoji", () => {
    const link: Link = {
      customIconId: null,
      emoji: "😀",
      id: "123",
      order: 0,
      title: "link",
      url: "https://www.firefox.com/en-US/releases/",
    };

    expect(getIconType(link)).toBe("emoji");
  });

  it("should return 'default' if category has neither customIconId or emoji", () => {
    const category: Category = {
      customIconId: null,
      emoji: null,
      id: "456",
      links: [],
      order: 0,
      title: "",
    };

    expect(getIconType(category)).toBe("default");
  });
});
