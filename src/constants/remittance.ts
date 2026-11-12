/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ReceiveCurrency } from "./currency";

// Yen-to-yen (JPY -> JPY) lifting fee: 0.75% of the amount after the
// remittance charge, at least JPY_MINIMUM_LIFTING_FEE yen
export const JPY_LIFTING_RATE = 1.0075;
export const JPY_MINIMUM_LIFTING_FEE = 1000;

// Minimum per transfer: `send` in JPY, `receive` in the receiving currency
export const REMITTANCE_MINIMUMS: Readonly<
  Record<ReceiveCurrency, Readonly<{ send: number; receive: number }>>
> = {
  PHP: { send: 1000, receive: 300 },
  USD: { send: 2500, receive: 10 },
  JPY: { send: 3000, receive: 1250 },
};

// The "Others" code of the source-fund list
export const SOURCE_FUND_OTHERS_CODE = "99";

// The "Others" code of the purpose list
export const PURPOSE_OTHERS_CODE = "99";

// From this remittance amount (JPY, the typed amount without the charge),
// the remitter's company details are required (compliance)
export const COMPANY_DETAILS_MIN_AMOUNT = 500_000;

// Send Money's countries: always from Japan to the Philippines (yen-to-yen
// payouts included)
export const ORIGINATING_COUNTRY = "JP";
export const DESTINATION_COUNTRY = "PH";

// What send-money gets for a value that doesn't apply: no rate (JPY -> JPY)
// no lifting fee (not JPY -> JPY), and a text that wasn't asked for
export const NO_RATE = 0;
export const NO_LIFTING_FEE = 0;
export const NOT_ASKED_TEXT = "";
