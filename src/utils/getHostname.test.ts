import { describe, expect, it } from "vitest";
import { getHostname } from "./getHostname";

describe("getHostname", () => {
  it("should return empty string for a browser page", () => {
    expect(getHostname("about:debugging#/runtime/this-firefox")).toBe("");
  });

  it("should return hostname with www if a link includes it", () => {
    expect(getHostname("https://www.gog.com/en/")).toBe("www.gog.com");
  });

  it("should return hostname without www if a link doesn't include it", () => {
    expect(getHostname("https://gog.com/en/")).toBe("gog.com");
  });
});
