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

import {
  CURRENCY_FRACTION_DIGITS,
  WALLET_CURRENCY,
} from "../../constants/currency";
import { COMPANY_DETAILS_MIN_AMOUNT } from "../../constants/remittance";
import { ChargeTier, ExchangeRate } from "../../types";
import { parseAmountInput, roundHalfEven } from "./amountInput";
import { findChargeTier, yenToYenNet } from "./charges";
import { convertAmount } from "./exchangeRate";

// For a currency missing from CURRENCY_FRACTION_DIGITS
const DEFAULT_FRACTION_DIGITS = 2;

export type RemittanceQuote = Readonly<{
  // The remittance charge (JPY), from the amount's tier
  charge: number;
  // What leaves the wallet: the amount plus the charge (JPY)
  totalPayment: number;
  // JPY -> JPY only: the lifting fee taken from the amount; null otherwise
  liftingFee: number | null;
  // What the beneficiary receives, in their currency, rounded like the server
  receiveAmount: number;
}>;

export type RemittancePayment = Readonly<{
  // The remittance charge (JPY), from the amount's tier
  charge: number;
  // What leaves the wallet: the amount + charge (JPY)
  totalPayment: number;
}>;

/**
 * What an amount costs, before a payout (and so a currency) is picked: its
 * charge, added on top. Used for the balance check.
 *
 * @param amount - The typed remittance amount, in JPY
 * @param tiers - The charge tiers
 * @returns The charge and total, or null with no amount or outside every tier
 * @example getRemittancePayment(50_000, tiers); // { charge: 1_390, totalPayment: 51_390 }
 */
export const getRemittancePayment = (
  amount: number,
  tiers: readonly ChargeTier[],
): RemittancePayment | null => {
  if (amount <= 0) return null;
  const tier = findChargeTier(amount, tiers);
  return tier
    ? { charge: tier.charge, totalPayment: amount + tier.charge }
    : null;
};

/**
 * What a Send Money amount costs and delivers. The charge is added on top
 * of the typed amount, and the typed amount is what gets converted.
 *
 * The only place this rule lives: if the charge ever has to come out of the
 * typed amount instead (like the home simulator), change it here.
 *
 * @param amount - The typed remittance amount, in JPY
 * @param receiveCurrency - The payout's currency (e.g. "PHP")
 * @param rates - The exchange rates
 * @param tiers - The charge tiers
 * @returns The quote, or null when it can't be worked out yet (no amount,
 *    outside every tier, no rate for the currency, or nothing would arrive)
 * @example getRemittanceQuote(50_000, "PHP", rates, tiers); // { charge: 1_390, totalPayment: 51_390, liftingFee: null, receiveAmount: 19_250 }
 */
export const getRemittanceQuote = (
  amount: number,
  receiveCurrency: string,
  rates: readonly ExchangeRate[],
  tiers: readonly ChargeTier[],
): RemittanceQuote | null => {
  const payment = getRemittancePayment(amount, tiers);
  if (!payment) return null;
  const { charge, totalPayment } = payment;

  // JPY -> JPY: no rate, but a lifting fee comes out of the amount
  if (receiveCurrency === WALLET_CURRENCY) {
    const { net, liftingFee } = yenToYenNet(amount);
    if (net <= 0) return null;
    return { charge, totalPayment, liftingFee, receiveAmount: net };
  }

  const converted = convertAmount(
    amount,
    WALLET_CURRENCY,
    receiveCurrency,
    rates,
  );
  if (converted === null) return null;

  const fractionDigits =
    CURRENCY_FRACTION_DIGITS[receiveCurrency] ?? DEFAULT_FRACTION_DIGITS;

  return {
    charge,
    totalPayment,
    liftingFee: null,
    receiveAmount: roundHalfEven(converted, fractionDigits),
  };
};

/**
 * Whether a remittance amount needs the remitter's company details
 * ("Additional Details"): from COMPANY_DETAILS_MIN_AMOUNT, typed amount
 * without the charge.
 *
 * @param amount - The form's clean amount string, in JPY
 * @returns true from the threshold
 * @example needsCompanyDetails("500000"); // true
 */
export const needsCompanyDetails = (amount: string): boolean =>
  parseAmountInput(amount) >= COMPANY_DETAILS_MIN_AMOUNT;
