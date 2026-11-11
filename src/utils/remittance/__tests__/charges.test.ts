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

import { findChargeTier, yenToYenAmountForNet, yenToYenNet } from "../charges";
import { ChargeTier } from "../../../types/charge.types";

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

describe("findChargeTier", () => {
  it("finds the tier, both limits included", () => {
    expect(findChargeTier(5_000, TIERS)?.charge).toBe(380);
    expect(findChargeTier(10_000, TIERS)?.charge).toBe(380);
    expect(findChargeTier(10_001, TIERS)?.charge).toBe(820);
    expect(findChargeTier(300_001, TIERS)?.charge).toBe(2_500);
  });

  it("returns null outside every tier", () => {
    expect(findChargeTier(0, TIERS)).toBeNull();
    expect(findChargeTier(1_000_000_000, TIERS)).toBeNull();
    expect(findChargeTier(5_000, [])).toBeNull();
  });
});

describe("yenToYenNet (JPY -> JPY lifting fee)", () => {
  it("charges the minimum fee on smaller amounts", () => {
    // 10,000 - 380 = 9,620; 0.75% would be ~72 yen, so the 1,000 minimum.
    expect(yenToYenNet(9_620)).toEqual({ net: 8_620, liftingFee: 1_000 });
  });

  it("charges 0.75% on larger amounts", () => {
    // 200,000 - 1,790 = 198,210 -> round(198,210 / 1.0075) = 196,734.
    expect(yenToYenNet(198_210)).toEqual({ net: 196_734, liftingFee: 1_476 });
  });

  it("never charges less than the minimum (legacy cut-off case)", () => {
    // The legacy fixed boundary gave 999 here with the current tiers.
    expect(yenToYenNet(136_000 - 1_790).liftingFee).toBeGreaterThanOrEqual(
      1_000,
    );
  });
});

describe("yenToYenAmountForNet (JPY reverse)", () => {
  it("is the reverse of yenToYenNet", () => {
    expect(yenToYenAmountForNet(8_620)).toBe(9_620);
    expect(yenToYenAmountForNet(196_734)).toBe(198_210);
  });

  it("always delivers at least the net, with the smallest amount", () => {
    for (const net of [1, 5_000, 8_620, 50_000, 133_333, 196_734, 500_000]) {
      const amount = yenToYenAmountForNet(net);
      expect(yenToYenNet(amount).net).toBeGreaterThanOrEqual(net);
      // One yen less would not be enough.
      expect(yenToYenNet(amount - 1).net).toBeLessThan(net);
    }
  });
});
