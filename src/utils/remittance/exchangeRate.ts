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

import { ExchangeRate } from "../../types/exchangeRate.types";

/**
 * Converts an amount between two currencies with the given rates. Works in
 * both directions of a pair: with "JPY/PHP", JPY -> PHP multiplies and
 * PHP -> JPY divides (and the same for "USD/JPY").
 *
 * @param amount - The amount in `from`.
 * @param from - The currency of `amount` (e.g. "JPY").
 * @param to - The currency to convert to (e.g. "PHP").
 * @param rates - The available rates (each one pair, e.g. JPY/PHP).
 * @returns The converted amount (not rounded), the same amount when both
 *   currencies match, or `null` when there's no rate for the pair.
 * @example convertAmount(10_000, "JPY", "PHP", rates); // 3_985 (rate 0.3985)
 */
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

/**
 * The rate of a currency pair, in whichever direction the API has it
 * ("JPY/PHP", or "USD/JPY" for JPY <-> USD).
 *
 * @param rates - The available rates
 * @param currencyA - One currency of the pair (e.g. "JPY")
 * @param currencyB - The other one (e.g. "PHP")
 * @returns The rate, or undefined when there's none (e.g. JPY -> JPY)
 * @example findPairRate(rates, "JPY", "PHP")?.rate; // 0.385
 */
export const findPairRate = (
  rates: readonly ExchangeRate[],
  currencyA: string,
  currencyB: string,
): ExchangeRate | undefined =>
  rates.find(
    (r) =>
      (r.fromCurrency === currencyA && r.toCurrency === currencyB) ||
      (r.fromCurrency === currencyB && r.toCurrency === currencyA),
  );
