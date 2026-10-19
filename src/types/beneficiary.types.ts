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

export interface BeneficiarySummary {
  remitterGuid: string;
  beneficiaryGuid: string;
  beneficiaryType: string;
  firstName: string;
  middleName: string;
  lastName: string;
  companyName: string;
  nameInitial: string;
  beneAlias: string;
  relationToBeneDesc: string;
  payoutCount: number;
  myAccountFlag: number;
}

// GET /api/remitters/{remitterGuid}/manage-beneficiaries
export interface ManageBeneficiariesResponse {
  ownAccount: BeneficiarySummary[];
  individual: BeneficiarySummary[];
  corporate: BeneficiarySummary[];
}

// The tabs of the screen, in display order
export type BeneficiaryCategory = keyof ManageBeneficiariesResponse;
