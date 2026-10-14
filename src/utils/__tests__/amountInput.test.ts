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
  it("keeps whole numbers and removes grouping and other characters", () => {
    expect(sanitizeAmountInput("12,000", 0)).toBe("12000");
    expect(sanitizeAmountInput("12a3", 0)).toBe("123");
  });

  it("drops the decimal part when no decimals are allowed", () => {
    expect(sanitizeAmountInput("150.75", 0)).toBe("150");
  });

  it("limits decimals and keeps one decimal point", () => {
    expect(sanitizeAmountInput("15.567", 2)).toBe("15.56");
    expect(sanitizeAmountInput("1.2.3", 2)).toBe("1.23");
    expect(sanitizeAmountInput(".5", 2)).toBe("0.5");
  });

  it("removes leading zeros and caps the length", () => {
    expect(sanitizeAmountInput("000120", 0)).toBe("120");
    expect(sanitizeAmountInput("12345678901", 0)).toBe("123456789");
  });
});

describe("parseAmountInput", () => {
  it("parses the value, empty as 0", () => {
    expect(parseAmountInput("12000")).toBe(12000);
    expect(parseAmountInput("")).toBe(0);
  });
});

describe("formatAmountInput", () => {
  it("groups the whole part and keeps typed decimals", () => {
    expect(formatAmountInput("1234567", "en-US")).toBe("1,234,567");
    expect(formatAmountInput("1500.", "en-US")).toBe("1,500.");
    expect(formatAmountInput("", "en-US")).toBe("");
  });
});

describe("roundUp", () => {
  it("rounds to the given decimals despite floating-point noise", () => {
    expect(roundUp(12547.01, 0)).toBe(12548);
    expect(roundUp(12548, 0)).toBe(12548);
  });
});

describe("roundHalfEven (C# Math.Round)", () => {
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
