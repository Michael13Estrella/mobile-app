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

// BeneficiaryPayout.bankCode of e-wallets (sent as "Other banks")
export const E_WALLET_BANK_CODES: readonly string[] = [
  "0273", // GCash
  "0270", // Maya
];
