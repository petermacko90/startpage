import { describe, expect, it } from "vitest";
import { getLastGrapheme, isValidEmoji } from "./emojiUtils";

describe("emojiUtils", () => {
  describe("isValidEmoji", () => {
    it("should return false given an empty string", () => {
      expect(isValidEmoji("")).toBe(false);
    });

    it("should return false given a space", () => {
      expect(isValidEmoji(" ")).toBe(false);
    });

    it("should return false given random text", () => {
      expect(isValidEmoji("emoji")).toBe(false);
    });

    it("should return false given two emojis", () => {
      expect(isValidEmoji("🙁☹️")).toBe(false);
    });

    it("should return false given emoji with text", () => {
      expect(isValidEmoji("🙁emoji")).toBe(false);
    });

    it("should return true given a standard single-code-point emoji", () => {
      expect(isValidEmoji("🙂")).toBe(true);
    });

    it("should return true given a ZWJ sequence", () => {
      expect(isValidEmoji("🧑‍💻")).toBe(true);
    });

    it("should return true given an emoji with a skin-tone modifier", () => {
      expect(isValidEmoji("👋🏽")).toBe(true);
    });

    it("should return true given a regional indicator flag sequence", () => {
      expect(isValidEmoji("🇸🇰")).toBe(true);
    });

    it("should return true given an emoji using a variation selector", () => {
      expect(isValidEmoji("❤️")).toBe(true);
    });
  });

  describe("getLastGrapheme", () => {
    it("should return empty string if input is empty string", () => {
      expect(getLastGrapheme("")).toBe("");
    });

    it("should return last character if input is text", () => {
      expect(getLastGrapheme("abc")).toBe("c");
    });

    it("should return last emoji if input is two emojis", () => {
      expect(getLastGrapheme("🙂🧑‍💻")).toBe("🧑‍💻");
    });
  });
});
