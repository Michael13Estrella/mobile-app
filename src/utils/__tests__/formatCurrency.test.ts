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

import { formatAmount } from "../formatCurrency";

describe("formatAmount", () => {
  it("shows 2 decimals with grouping by default", () => {
    expect(formatAmount(1_000_000, "en-US")).toBe("1,000,000.00");
    expect(formatAmount(1234.5, "en-US")).toBe("1,234.50");
  });

  it("shows the requested number of decimals", () => {
    expect(formatAmount(1500, "en-US", 0)).toBe("1,500");
    expect(formatAmount(0.3985, "en-US", 4)).toBe("0.3985");
  });

  it("rounds to the requested decimals", () => {
    expect(formatAmount(1500.6, "en-US", 0)).toBe("1,501");
    expect(formatAmount(1.236, "en-US")).toBe("1.24");
  });

  it("formats zero and negatives", () => {
    expect(formatAmount(0, "en-US")).toBe("0.00");
    expect(formatAmount(-50, "en-US")).toBe("-50.00");
  });

  it("follows the locale's grouping", () => {
    expect(formatAmount(1234.5, "ja-JP")).toBe("1,234.50");
  });

  it("has no currency symbol", () => {
    expect(formatAmount(1000, "en-US")).not.toMatch(/[¥₱$]/);
  });
});
