/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-23
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ReceiveCurrency } from "./currency";

export const PAYOUT_TYPE = {
  METROBANK_ACCOUNT: "CA",
  CASH_PICKUP: "CP",
  OTHER_BANKS: "OB",
  BILLS_PAYMENT: "BP",
} as const;

export type PayoutType = (typeof PAYOUT_TYPE)[keyof typeof PAYOUT_TYPE];

// The payout types a beneficiary can be added with
// (bills payment has its own section), in display order
export const BENEFICIARY_PAYOUT_TYPES = [
  PAYOUT_TYPE.METROBANK_ACCOUNT,
  PAYOUT_TYPE.OTHER_BANKS,
  PAYOUT_TYPE.CASH_PICKUP,
] as const;

export type BeneficiaryPayoutType = (typeof BENEFICIARY_PAYOUT_TYPES)[number];

// BeneficiaryPayout.bankCode of e-wallets (sent as "Other banks")
export const E_WALLET_BANK_CODES: readonly string[] = [
  "0273", // GCash
  "0270", // Maya
];

// Metrobank account payouts (CA)
export const METROBANK_BANK_CODE = "1066";
// 13 digits, shown as "345 678 912 1237"
export const METROBANK_ACCOUNT_NO_TEMPLATE = "xxx xxx xxx xxxx";
export const METROBANK_ACCOUNT_NO_LENGTH = 13;
// A Metrobank account can receive any currency the app sends
export { RECEIVE_CURRENCIES as METROBANK_ACCOUNT_CURRENCIES } from "./currency";

// Shown as the bank of a Metrobank account payout
export const METROBANK_BANK_NAME = "Metrobank";

// Other bank payouts (OB) can receive PHP and USD only
export const OTHER_BANK_CURRENCIES = [
  "PHP",
  "USD",
] as const satisfies readonly ReceiveCurrency[];

// E-wallets (GCash, Maya) receive PHP only: their form has no currency
export const E_WALLET_CURRENCY =
  "PHP" satisfies (typeof OTHER_BANK_CURRENCIES)[number];

// The branch name of a bank account payout (Metrobank and other banks)
export const PAYOUT_BRANCH_MAX_LENGTH = 40;

// Masked account numbers show only the last digits ("•••• 7890")
export const ACCOUNT_NO_MASK = "••••";
export const ACCOUNT_NO_VISIBLE_DIGITS = 4;
