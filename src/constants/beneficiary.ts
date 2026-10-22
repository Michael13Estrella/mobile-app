/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-19
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { BeneficiaryCategory } from "../types";

// The Manage Beneficiaries tabs, in display order
export const BENEFICIARY_CATEGORIES: readonly BeneficiaryCategory[] = [
  "ownAccount",
  "individual",
  "corporate",
];

// BeneficiaryDetail.beneficiaryType
export const BENEFICIARY_TYPE = {
  INDIVIDUAL: "I",
  CORPORATE: "C",
} as const;

export type BeneficiaryType =
  (typeof BENEFICIARY_TYPE)[keyof typeof BENEFICIARY_TYPE];

// RecentTransaction.payoutType: how the beneficiary receives it.
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

// BeneficiaryDetail.myAccountFlg: whether it's the remitter's own account
export const MY_ACCOUNT_FLAG = {
  NO: 0,
  YES: 1,
} as const;
