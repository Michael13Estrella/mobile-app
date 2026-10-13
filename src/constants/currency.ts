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
