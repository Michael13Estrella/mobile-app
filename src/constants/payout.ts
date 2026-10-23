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
export const METROBANK_BANK_CODE = "";
// 13 digits, shown as "345 678 912 1237"
export const METROBANK_ACCOUNT_NO_TEMPLATE = "xxx xxx xxx xxxx";
export const METROBANK_ACCOUNT_NO_LENGTH = 13;
// A Metrobank account can receive any currency the app sends
export { RECEIVE_CURRENCIES as METROBANK_ACCOUNT_CURRENCIES } from "./currency";
