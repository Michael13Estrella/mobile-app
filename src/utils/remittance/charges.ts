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

/**
 * The smallest send amount that delivers `net` after its own tier's charge.
 * Reverse direction: the charge depends on the amount being calculated, so
 * each tier is tried (needed + its charge must land in that tier).
 *
 * @param net - The amount in JPY that must reach the beneficiary.
 * @param tiers - The charge tiers from the charges API.
 * @param amountBeforeCharge - What must remain after the charge: `net` by
 *   default (PHP/USD); `yenToYenAmountForNet` for JPY (adds the lifting fee).
 * @returns The send amount, or `null` if no tier fits / tiers not loaded.
 * @example sendAmountForNet(9_621, tiers); // 10,441 (tier 2, ¥820)
 */
export const sendAmountForNet = (
  net: number,
  tiers: readonly ChargeTier[],
  amountBeforeCharge: (net: number) => number = (amount) => amount,
): number | null => {
  const needed = amountBeforeCharge(net);
  const candidates = tiers
    .map((tier) => ({
      tier,
      amount: Math.max(needed + tier.charge, tier.amountFrom),
    }))
    .filter(({ tier, amount }) => amount <= tier.amountTo)
    .map(({ amount }) => amount);

  return candidates.length > 0 ? Math.min(...candidates) : null;
};

export type YenToYenResult = Readonly<{
  // What the beneficiary receives (whole yen).
  net: number;
  liftingFee: number;
}>;

/**
 * JPY -> JPY: applies the lifting fee (0.75%, at least the minimum fee).
 * The smaller net (= the larger fee) wins
 *
 * @param amountAfterCharge - "You send" minus the remittance charge, in JPY.
 * @returns What the beneficiary gets and the lifting fee.
 * @example yenToYen(9_620); // { net: 8_620, liftingFee: 1_000 }
 */
export const yenToYenNet = (amountAfterCharge: number): YenToYenResult => {
  const withRate = Math.round(amountAfterCharge / JPY_LIFTING_RATE);
  const withMinimum = amountAfterCharge - JPY_MINIMUM_LIFTING_FEE;
  const net = Math.min(withRate, withMinimum);

  return { net, liftingFee: amountAfterCharge - net };
};

/**
 * JPY -> JPY reverse of `yenToYemNet`: the smallest amount after the charge
 * that still gives at least `net`. Pass it to `sendAmountForNet`.
 *
 * @param net - The amount in JPY that must reach the beneficiary
 * @returns The amount that must remain after the remittance charge
 * @example yenToYenAmountForNet(8_620); // 9_620
 */
export const yenToYenAmountForNet = (net: number): number =>
  Math.max(
    // round(x / rate) >= net needs x >= (net - 0.5) * rate.
    Math.ceil((net - 0.5) * JPY_LIFTING_RATE - EPSILON),
    net + JPY_MINIMUM_LIFTING_FEE,
  );
