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

import {
  findNationalityName,
  formatCountryName,
  getNationalityName,
  toNationalityOptions,
} from "../nationality";
import { Nationality } from "../../../types/referenceData.types";

const nationality = (
  code: string,
  isoAlpha2: string,
  countryEn: string,
  countryJp: string,
): Nationality => ({
  nationality: code,
  isoAlpha2,
  isoAlpha3: code,
  isoNumeric: "",
  countryEn,
  countryJp,
});

const ITEMS = [
  nationality("PHL", "PH", "PHILIPPINES", "フィリピン"),
  nationality("JPN", "JP", "JAPAN", "日本"),
];

describe("formatCountryName", () => {
  it("capitalizes each word", () => {
    expect(formatCountryName("PHILIPPINES")).toBe("Philippines");
    expect(formatCountryName("SAUDI ARABIA")).toBe("Saudi Arabia");
  });

  it("keeps minor words lowercase inside the name", () => {
    expect(formatCountryName("ANTIGUA AND BARBUDA")).toBe(
      "Antigua and Barbuda",
    );
    expect(formatCountryName("UNITED STATES OF AMERICA")).toBe(
      "United States of America",
    );
    expect(formatCountryName("KOREA, REPUBLIC OF")).toBe("Korea, Republic of");
  });

  it("capitalizes a minor word at the start", () => {
    expect(formatCountryName("THE GAMBIA")).toBe("The Gambia");
  });

  it("capitalizes after hyphens and brackets", () => {
    expect(formatCountryName("GUINEA-BISSAU")).toBe("Guinea-Bissau");
    expect(formatCountryName("BOLIVIA (PLURINATIONAL STATE OF)")).toBe(
      "Bolivia (Plurinational State of)",
    );
  });

  it("trims spaces", () => {
    expect(formatCountryName("  JAPAN ")).toBe("Japan");
  });
});

describe("getNationalityName", () => {
  it("formats the English name", () => {
    expect(getNationalityName(ITEMS[0], "en")).toBe("Philippines");
  });

  it("uses the Japanese name as sent", () => {
    expect(getNationalityName(ITEMS[0], "ja")).toBe("フィリピン");
  });
});

describe("toNationalityOptions", () => {
  it("maps each nationality to a picker option", () => {
    expect(toNationalityOptions(ITEMS, "en")).toEqual([
      { value: "PHL", label: "Philippines", isoAlpha2: "PH" },
      { value: "JPN", label: "Japan", isoAlpha2: "JP" },
    ]);
  });
});

describe("findNationalityName", () => {
  it("finds the name for a saved code", () => {
    expect(findNationalityName(ITEMS, "JPN", "en")).toBe("Japan");
    expect(findNationalityName(ITEMS, "PHL", "ja")).toBe("フィリピン");
  });

  it("falls back to the code when it isn't in the list", () => {
    expect(findNationalityName(ITEMS, "XYZ", "en")).toBe("XYZ");
    expect(findNationalityName([], "PHL", "en")).toBe("PHL");
  });
});
