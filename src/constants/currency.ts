/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-05
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

// Country shown as the flag for each currency
export const CURRENCY_COUNTRY: Readonly<Record<string, string>> = {
  JPY: "JP",
  PHP: "PH",
  USD: "US",
};

// Currency of the remitter's wallet
export const WALLET_CURRENCY = "JPY";

// Estimated wallet value shown in these currencies, in this order.
export const WALLET_ESTIMATE_CURRENCIES = ["PHP", "USD"] as const;

// Decimals each currency has (JPY has no smaller unit than 1 yen).
export const CURRENCY_FRACTION_DIGITS: Readonly<Record<string, number>> = {
  JPY: 0,
  PHP: 2,
  USD: 2,
};

// Currencies a beneficiary can receive, in the order of the switch/
// JPY is the only offered in some cases (see RemittanceSimulator's allowJpy)
export const RECEIVE_CURRENCIES = ["PHP", "USD", "JPY"] as const;
export type ReceiveCurrency = (typeof RECEIVE_CURRENCIES)[number];
