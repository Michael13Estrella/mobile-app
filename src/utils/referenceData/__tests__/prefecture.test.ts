/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { findPrefectureValue } from "../prefecture";
import { PREFECTURE_OPTIONS } from "../../../constants/prefectures";

describe("findPrefectureValue", () => {
  it("matches the list's value", () => {
    expect(findPrefectureValue("AOMORI KEN")).toBe("AOMORI KEN");
    expect(findPrefectureValue("TOKYO TO")).toBe("TOKYO TO");
  });

  it("matches the label (the name without KEN / TO / FU)", () => {
    expect(findPrefectureValue("AOMORI")).toBe("AOMORI KEN");
    expect(findPrefectureValue("KYOTO")).toBe("KYOTO FU");
    expect(findPrefectureValue("HOKKAIDO")).toBe("HOKKAIDO");
  });

  it("ignores case and extra spaces", () => {
    expect(findPrefectureValue("aomori")).toBe("AOMORI KEN");
    expect(findPrefectureValue("  Tokyo ")).toBe("TOKYO TO");
    expect(findPrefectureValue("AOMORI   KEN")).toBe("AOMORI KEN");
  });

  it("returns empty when there's no match", () => {
    expect(findPrefectureValue("MANILA")).toBe("");
    expect(findPrefectureValue("")).toBe("");
  });
});

describe("PREFECTURE_OPTIONS", () => {
  it("has all 47 prefectures, each value once", () => {
    const values = PREFECTURE_OPTIONS.map((option) => option.value);
    expect(values).toHaveLength(47);
    expect(new Set(values).size).toBe(47);
  });
});
