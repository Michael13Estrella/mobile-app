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
  JPY_LIFTING_RATE,
  JPY_MINIMUM_LIFTING_FEE,
} from "../../constants/remittance";
import { ChargeTier } from "../../types";

// Tiny allowance for floating-point noise in the reverse calculation.
const EPSILON = 1e-9;

/**
 * The tier an amount falls in (limits included).
 * Forward direction: "You send" is known, so its charge is looked up.
 *
 * @param amount - The send amount in JPY.
 * @param tiers - The charge tiers from the charges API.
 * @returns The tier, or `null` if outside every tier / tiers not loaded.
 * @example findChargeTier(10_000, tiers)?.charge; // 380
 */
export const findChargeTier = (
  amount: number,
  tiers: readonly ChargeTier[],
): ChargeTier | null =>
  tiers.find((tier) => amount >= tier.amountFrom && amount <= tier.amountTo) ??
  null;

export type YenToYenResult = Readonly<{
  // What the beneficiary receives (whole yen).
  net: number;
  liftingFee: number;
}>;

/**
 * JPY -> JPY: applies the lifting fee (0.75%, at least the minimum fee).
 * The smaller net (= the larger fee) wins
 *
 * @param amount - The remittance amount in JPY (the charge is on top).
 * @returns What the beneficiary gets and the lifting fee.
 * @example yenToYenNet(9_620); // { net: 8_620, liftingFee: 1_000 }
 */
export const yenToYenNet = (amount: number): YenToYenResult => {
  const withRate = Math.round(amount / JPY_LIFTING_RATE);
  const withMinimum = amount - JPY_MINIMUM_LIFTING_FEE;
  const net = Math.min(withRate, withMinimum);

  return { net, liftingFee: amount - net };
};

/**
 * JPY -> JPY reverse of `yenToYenNet`: the smallest remittance amount that
 * still gives at least `net` (the simulator's typed "Beneficiary gets").
 *
 * @param net - The amount in JPY that must reach the beneficiary
 * @returns The remittance amount in JPY (the charge goes on top)
 * @example yenToYenAmountForNet(8_620); // 9_620
 */
export const yenToYenAmountForNet = (net: number): number =>
  Math.max(
    // round(x / rate) >= net needs x >= (net - 0.5) * rate.
    Math.ceil((net - 0.5) * JPY_LIFTING_RATE - EPSILON),
    net + JPY_MINIMUM_LIFTING_FEE,
  );
