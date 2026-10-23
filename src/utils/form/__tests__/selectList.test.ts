/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-29
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { buildSelectList } from "../selectList";

const countries = [
  { value: "JP", label: "Japan", isoAlpha2: "JP" },
  { value: "AL", label: "Albania", isoAlpha2: "AL" },
  { value: "PH", label: "Philippines", isoAlpha2: "PH" },
  { value: "AF", label: "Afghanistan", isoAlpha2: "AF" },
];

const pinnedValues = ["PH", "JP"];

const summarize = (rows: ReturnType<typeof buildSelectList>["rows"]) =>
  rows.map((r) => (r.type === "header" ? r.letter : r.option.value));

describe("buildSelectList", () => {
  describe("full list (no search)", () => {
    it("puts pinned options first, then A–Z sections", () => {
      const { rows } = buildSelectList({
        options: countries,
        query: "",
        locale: "en",
        pinnedValues,
        groupByLetter: true,
      });

      expect(summarize(rows)).toEqual([
        "PH",
        "JP",
        "A",
        "AF",
        "AL",
        "J",
        "JP",
        "P",
        "PH",
      ]);
    });

    it("maps each letter to its header row", () => {
      const { letterIndex } = buildSelectList({
        options: countries,
        query: "",
        locale: "en",
        pinnedValues,
        groupByLetter: true,
      });

      expect(letterIndex).toEqual({ A: 2, J: 5, P: 7 });
    });

    it("gives every row a unique key, pinned copies included", () => {
      const { rows } = buildSelectList({
        options: countries,
        query: "",
        locale: "en",
        pinnedValues,
        groupByLetter: true,
      });

      const keys = rows.map((r) => r.key);
      expect(new Set(keys).size).toBe(keys.length);
    });

    it("skips pinned values that aren't in the options", () => {
      const { rows } = buildSelectList({
        options: countries,
        query: "",
        locale: "en",
        pinnedValues: ["XX", "PH"],
      });

      expect(summarize(rows).slice(0, 1)).toEqual(["PH"]);
    });

    it("sorts without sections with sortAscending", () => {
      const { rows, letterIndex } = buildSelectList({
        options: countries,
        query: "",
        locale: "en",
        sortAscending: true,
      });

      expect(summarize(rows)).toEqual(["AF", "AL", "JP", "PH"]);
      expect(letterIndex).toEqual({});
    });

    it("sorts but has no sections in Japanese", () => {
      const { rows, letterIndex } = buildSelectList({
        options: countries,
        query: "",
        locale: "ja",
        groupByLetter: true,
      });

      expect(rows.every((r) => r.type === "option")).toBe(true);
      expect(letterIndex).toEqual({});
    });

    it("keeps the API order for ungrouped lists", () => {
      const { rows } = buildSelectList({
        options: countries,
        query: "",
        locale: "en",
      });

      expect(summarize(rows)).toEqual(["JP", "AL", "PH", "AF"]);
    });
  });

  describe("searching", () => {
    it("hides pinned rows while searching", () => {
      const { rows } = buildSelectList({
        options: countries,
        query: "phil",
        locale: "en",
        pinnedValues,
        groupByLetter: true,
      });

      expect(rows.map((r) => r.key)).toEqual(["header-P", "PH"]);
    });

    it("ignores case and surrounding spaces", () => {
      const { rows } = buildSelectList({
        options: countries,
        query: "  JAP ",
        locale: "en",
      });

      expect(summarize(rows)).toEqual(["JP"]);
    });

    it("matches anywhere in the label", () => {
      const { rows } = buildSelectList({
        options: countries,
        query: "an",
        locale: "en",
        sortAscending: true,
      });

      // Afghanistan, Albania, Japan
      expect(summarize(rows)).toEqual(["AF", "AL", "JP"]);
    });

    it("returns no rows when nothing matches", () => {
      const { rows, letterIndex } = buildSelectList({
        options: countries,
        query: "zzz",
        locale: "en",
        pinnedValues,
        groupByLetter: true,
      });

      expect(rows).toEqual([]);
      expect(letterIndex).toEqual({});
    });
  });
});
