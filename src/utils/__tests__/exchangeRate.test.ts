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

// As the API sends them: 1 JPY = 0.3985 PHP, 1 USD = 154.65 JPY.
const RATES = [rate("JPY", "PHP", 0.3985), rate("USD", "JPY", 154.65)];

describe("convertAmount", () => {
  describe("with a direct rate (multiply)", () => {
    it("converts JPY -> PHP", () => {
      expect(convertAmount(1_000_000, "JPY", "PHP", RATES)).toBeCloseTo(
        398_500,
      );
    });

    it("converts USD -> JPY", () => {
      expect(convertAmount(100, "USD", "JPY", RATES)).toBeCloseTo(15_465);
    });
  });

  describe("with the inverse rate (divide)", () => {
    it("converts JPY -> USD", () => {
      expect(convertAmount(1_000_000, "JPY", "USD", RATES)).toBeCloseTo(
        6466.21,
        2,
      );
    });

    it("converts PHP -> JPY", () => {
      expect(convertAmount(3_985, "PHP", "JPY", RATES)).toBeCloseTo(10_000);
    });
  });

  it("returns the amount for the same currency", () => {
    expect(convertAmount(500, "JPY", "JPY", RATES)).toBe(500);
  });

  it("returns null without a rate for the pair", () => {
    expect(convertAmount(500, "JPY", "EUR", RATES)).toBeNull();
    expect(convertAmount(500, "JPY", "PHP", [])).toBeNull();
  });

  it("returns null instead of dividing by a zero rate", () => {
    expect(
      convertAmount(500, "JPY", "USD", [rate("USD", "JPY", 0)]),
    ).toBeNull();
  });
});
