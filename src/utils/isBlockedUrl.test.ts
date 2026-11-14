import { describe, expect, it } from "vitest";
import { isBlockedUrl } from "./isBlockedUrl";

describe("isBlockedUrl", () => {
  it("should return true for Firefox debugging page", () => {
    expect(isBlockedUrl("about:debugging#/runtime/this-firefox")).toBe(true);
  });

  it("should return true for Brave settings page", () => {
    expect(isBlockedUrl("brave://settings/")).toBe(true);
  });

  it("should return false for localhost", () => {
    expect(isBlockedUrl("http://localhost:5173/")).toBe(false);
  });

  it("should return false for https page", () => {
    expect(isBlockedUrl("https://github.com/")).toBe(false);
  });
});
