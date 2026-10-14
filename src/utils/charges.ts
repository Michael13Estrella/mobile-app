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

import { ChargeTier } from "../types";

// The tier an amount falls in (both limits included); null when the amount
// is outside every tier (e.g. above the maximum) or tiers aren't loaded.
export const findChargeTier = (
  amount: number,
  tiers: readonly ChargeTier[],
): ChargeTier | null =>
  tiers.find((tier) => amount >= tier.amountFrom && amount <= tier.amountTo) ??
  null;

// The smallest send amount whose net (after its own tier's charge) is at
// least `net`. Every tier is tried: net + its charge must land in that tier
// (or its amountFrom is used when net + charge falls below it). null when
// no tier works (above the maximum, or tiers not loaded).
export const sendAmountForNet = (
  net: number,
  tiers: readonly ChargeTier[],
): number | null => {
  const candidates = tiers
    .map((tier) => ({
      tier,
      amount: Math.max(net + tier.charge, tier.amountFrom),
    }))
    .filter(({ tier, amount }) => amount <= tier.amountTo)
    .map(({ amount }) => amount);

  return candidates.length > 0 ? Math.min(...candidates) : null;
};
