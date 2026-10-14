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

import { findChargeTier, sendAmountForNet } from "../charges";
import { ChargeTier } from "../../types/charge.types";

const tier = (amountFrom: number, amountTo: number, charge: number) =>
  ({ amountFrom, amountTo, charge, points: 0 }) as ChargeTier;

const TIERS = [tier(1, 10_000, 500), tier(10_001, 100_000, 990)];

describe("findChargeTier", () => {
  it("finds the tier, limits included", () => {
    expect(findChargeTier(10_000, TIERS)?.charge).toBe(500);
    expect(findChargeTier(10_001, TIERS)?.charge).toBe(990);
  });

  it("returns null outside every tier", () => {
    expect(findChargeTier(100_001, TIERS)).toBeNull();
    expect(findChargeTier(5_000, [])).toBeNull();
  });
});

describe("sendAmountForNet", () => {
  it("adds the charge of the tier the result lands in", () => {
    // 5,000 net + 500 charge = 5,500, inside tier 1 (1..10,000)
    expect(sendAmountForNet(5_000, TIERS)).toBe(5_500);
    // 9,800 net + 500 = 10,300 would leave tier 1; 9,800 + 990 = 10,790 fits tier 2
    expect(sendAmountForNet(9_800, TIERS)).toBe(10_790);
  });

  it("returns null when no tier fits", () => {
    expect(sendAmountForNet(100_000, TIERS)).toBeNull();
    expect(sendAmountForNet(5_000, [])).toBeNull();
  });
});
