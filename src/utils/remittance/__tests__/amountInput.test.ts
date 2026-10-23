/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-14
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import {
  formatAmountInput,
  parseAmountInput,
  roundHalfEven,
  roundUp,
  sanitizeAmountInput,
} from "../amountInput";

describe("sanitizeAmountInput", () => {
  it("keeps digits only and removes grouping", () => {
    expect(sanitizeAmountInput("12,000", 0)).toBe("12000");
    expect(sanitizeAmountInput("12a3 ¥", 0)).toBe("123");
  });

  it("drops decimals when none are allowed", () => {
    expect(sanitizeAmountInput("150.75", 0)).toBe("150");
  });

  it("limits decimals and keeps one decimal point", () => {
    expect(sanitizeAmountInput("15.567", 2)).toBe("15.56");
    expect(sanitizeAmountInput("1.2.3", 2)).toBe("1.23");
    expect(sanitizeAmountInput("15.", 2)).toBe("15.");
  });

  it("adds a 0 when the decimal point comes first", () => {
    expect(sanitizeAmountInput(".5", 2)).toBe("0.5");
  });

  it("removes leading zeros but keeps a single 0", () => {
    expect(sanitizeAmountInput("000120", 0)).toBe("120");
    expect(sanitizeAmountInput("0", 0)).toBe("0");
  });

  it("caps the whole part at 9 digits", () => {
    expect(sanitizeAmountInput("12345678901", 0)).toBe("123456789");
  });

  it("returns empty for empty input", () => {
    expect(sanitizeAmountInput("", 2)).toBe("");
  });
});

describe("parseAmountInput", () => {
  it("parses whole and decimal amounts", () => {
    expect(parseAmountInput("12000")).toBe(12000);
    expect(parseAmountInput("15.5")).toBe(15.5);
  });

  it("returns 0 for empty or invalid values", () => {
    expect(parseAmountInput("")).toBe(0);
    expect(parseAmountInput("abc")).toBe(0);
  });
});

describe("formatAmountInput", () => {
  it("groups the whole part", () => {
    expect(formatAmountInput("1234567", "en-US")).toBe("1,234,567");
  });

  it("keeps typed decimals and a trailing decimal point", () => {
    expect(formatAmountInput("1500.5", "en-US")).toBe("1,500.5");
    expect(formatAmountInput("1500.", "en-US")).toBe("1,500.");
  });

  it("returns empty for an empty value", () => {
    expect(formatAmountInput("", "en-US")).toBe("");
  });
});

describe("roundUp", () => {
  it("rounds up to the given decimals", () => {
    expect(roundUp(12547.01, 0)).toBe(12548);
    expect(roundUp(1.231, 2)).toBe(1.24);
  });

  it("keeps values that are already exact", () => {
    expect(roundUp(12548, 0)).toBe(12548);
  });

  it("ignores floating-point noise just above a whole value", () => {
    // 0.1 + 0.2 = 0.30000000000000004, still 0.3 after rounding up.
    expect(roundUp(0.1 + 0.2, 2)).toBe(0.3);
  });
});

describe("roundHalfEven", () => {
  it("rounds to the nearest value", () => {
    expect(roundHalfEven(4782.606, 2)).toBe(4782.61);
    expect(roundHalfEven(4782.604, 2)).toBe(4782.6);
  });

  it("sends exact halves to the even neighbor", () => {
    expect(roundHalfEven(2.5, 0)).toBe(2);
    expect(roundHalfEven(3.5, 0)).toBe(4);
    expect(roundHalfEven(0.125, 2)).toBe(0.12);
  });
});
