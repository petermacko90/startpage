import { describe, expect, it } from "vitest";
import { areModKeysPressed } from "./areModKeysPressed";

describe("areModKeysPressed", () => {
  it("should return true if one mod key is pressed", () => {
    const e = {
      altKey: true,
      ctrlKey: false,
      metaKey: false,
      key: "1",
    } as KeyboardEvent;

    expect(areModKeysPressed(e)).toBe(true);
  });

  it("sholud return true if two mod keys are pressed", () => {
    const e = {
      altKey: false,
      ctrlKey: true,
      metaKey: true,
      key: "2",
    } as KeyboardEvent;

    expect(areModKeysPressed(e)).toBe(true);
  });

  it("sholud return true if three mod keys are pressed", () => {
    const e = {
      altKey: true,
      ctrlKey: true,
      metaKey: true,
      key: "3",
    } as KeyboardEvent;

    expect(areModKeysPressed(e)).toBe(true);
  });

  it("should return false if no mod key is pressed", () => {
    const e = {
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      key: "1",
    } as KeyboardEvent;

    expect(areModKeysPressed(e)).toBe(false);
  });
});
