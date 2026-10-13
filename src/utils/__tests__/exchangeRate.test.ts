/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { convertAmount } from "../exchangeRate";
import { ExchangeRate } from "../../types/exchangeRate.types";

const rate = (fromCurrency: string, toCurrency: string, value: number) =>
  ({ fromCurrency, toCurrency, rate: value }) as ExchangeRate;

const RATES = [rate("JPY", "PHP", 0.3985), rate("USD", "JPY", 154.65)];

describe("convertAmount", () => {
  it("multiplies with a direct rate (JPY -> PHP)", () => {
    expect(convertAmount(1_000_000, "JPY", "PHP", RATES)).toBeCloseTo(398_500);
  });

  it("divides with the inverse rate (JPY -> USD)", () => {
    expect(convertAmount(1_000_000, "JPY", "USD", RATES)).toBeCloseTo(
      6466.21,
      2,
    );
  });

  it("returns the amount for the same currency", () => {
    expect(convertAmount(500, "JPY", "JPY", RATES)).toBe(500);
  });

  it("returns null without a rate for the pair", () => {
    expect(convertAmount(500, "JPY", "EUR", RATES)).toBeNull();
  });
});
