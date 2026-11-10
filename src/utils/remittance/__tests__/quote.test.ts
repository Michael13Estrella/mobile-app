/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-10
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { getRemittanceQuote } from "../quote";
import { ChargeTier, ExchangeRate } from "../../../types";

const rate = (fromCurrency: string, toCurrency: string, value: number) =>
  ({ fromCurrency, toCurrency, rate: value }) as ExchangeRate;

// The design's rate (1 JPY = 0.3850 PHP), and USD as the API sends it
const RATES = [rate("JPY", "PHP", 0.385), rate("USD", "JPY", 154.65)];

// Real tiers from /api/reference-master/charges (2026-10-14).
const TIERS: ChargeTier[] = [
  { amountFrom: 1, amountTo: 10000, charge: 380, points: 30 },
  { amountFrom: 10001, amountTo: 20000, charge: 820, points: 45 },
  { amountFrom: 20001, amountTo: 30000, charge: 900, points: 50 },
  { amountFrom: 30001, amountTo: 40000, charge: 1290, points: 115 },
  { amountFrom: 40001, amountTo: 50000, charge: 1390, points: 150 },
  { amountFrom: 50001, amountTo: 100000, charge: 1490, points: 190 },
  { amountFrom: 100001, amountTo: 200000, charge: 1790, points: 290 },
  { amountFrom: 200001, amountTo: 300000, charge: 1950, points: 350 },
  { amountFrom: 300001, amountTo: 999999999, charge: 2500, points: 400 },
];

describe("getRemittanceQuote", () => {
  describe("charge on top of the typed amount", () => {
    it("adds the amount's tier charge to the total payment", () => {
      const quote = getRemittanceQuote(50_000, "PHP", RATES, TIERS);
      expect(quote?.charge).toBe(1_390);
      expect(quote?.totalPayment).toBe(51_390);
    });

    it("finds the tier from the typed amount, limits included", () => {
      expect(getRemittanceQuote(10_000, "PHP", RATES, TIERS)?.charge).toBe(380);
      expect(getRemittanceQuote(10_001, "PHP", RATES, TIERS)?.charge).toBe(820);
    });
  });

  describe("what the beneficiary receives", () => {
    it("converts the whole typed amount (JPY -> PHP)", () => {
      const quote = getRemittanceQuote(50_000, "PHP", RATES, TIERS);
      expect(quote?.receiveAmount).toBe(19_250);
      expect(quote?.liftingFee).toBeNull();
    });

    it("converts with the inverse rate and rounds to cents (JPY -> USD)", () => {
      // 10,000 / 154.65 = 64.6621…
      expect(
        getRemittanceQuote(10_000, "USD", RATES, TIERS)?.receiveAmount,
      ).toBe(64.66);
    });

    it("takes the lifting fee out of the amount (JPY -> JPY)", () => {
      // 0.75% of 9,620 is less than the ¥1,000 minimum fee
      const quote = getRemittanceQuote(9_620, "JPY", RATES, TIERS);
      expect(quote).toEqual({
        charge: 380,
        totalPayment: 10_000,
        liftingFee: 1_000,
        receiveAmount: 8_620,
      });
    });
  });

  describe("when it can't be worked out", () => {
    it("returns null with no amount", () => {
      expect(getRemittanceQuote(0, "PHP", RATES, TIERS)).toBeNull();
    });

    it("returns null outside every tier, or with no tiers loaded", () => {
      expect(getRemittanceQuote(1_000_000_000, "PHP", RATES, TIERS)).toBeNull();
      expect(getRemittanceQuote(50_000, "PHP", RATES, [])).toBeNull();
    });

    it("returns null with no rate for the currency", () => {
      expect(getRemittanceQuote(50_000, "PHP", [], TIERS)).toBeNull();
    });

    it("returns null when the lifting fee leaves nothing (JPY -> JPY)", () => {
      expect(getRemittanceQuote(1_000, "JPY", RATES, TIERS)).toBeNull();
    });
  });
});
