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

// BeneficiaryDetail.myAccountFlg: whether it's the remitter's own account
export const MY_ACCOUNT_FLAG = {
  NO: 0,
  YES: 1,
} as const;
