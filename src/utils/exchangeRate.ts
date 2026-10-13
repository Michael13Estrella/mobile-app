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

import { ExchangeRate } from "../types/exchangeRate.types";

// Converts an amount with the given rates. Works in both directions of a
// pair: JPY->PHP uses "JPY/PHP" (multiply), JPY->USD uses "USD/JPY" (divide).
// null when there's no rate for the pair (e.g. rates not loaded yet)
export const convertAmount = (
  amount: number,
  from: string,
  to: string,
  rates: readonly ExchangeRate[],
): number | null => {
  if (from === to) return amount;

  const direct = rates.find(
    (r) => r.fromCurrency === from && r.toCurrency === to,
  );
  if (direct) return amount * direct.rate;

  const inverse = rates.find(
    (r) => r.fromCurrency === to && r.toCurrency === from,
  );
  if (inverse && inverse.rate > 0) return amount / inverse.rate;

  return null;
};
