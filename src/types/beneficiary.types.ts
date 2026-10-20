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

// Beneficiary's full details (Beneficiary Information screen).
export interface BeneficiaryDetail {
  remitterGuid: string;
  beneficiaryGuid: string;
  beneficiaryNo: number;
  beneficiaryType: string;
  beneficiaryStatus: number;
  firstName: string;
  middleName: string;
  lastName: string;
  nameInitial: string;
  gender: string;
  mobileNo: string;
  // Corporate beneficiaries: company name and office phone instead
  companyName: string;
  officeTelNo: string;
  relationToBeneCode: string;
  // Free text when the relationship is "Others"
  relationToBeneOthers: string;
  relationToBeneDesc: string;
  address1: string;
  address2: string;
  cityProvCode: string;
  zipPosCode: string;
  countryCode: string;
  // Birth date (persons) or establishment date (companies), ISO date-time.
  birthOrEstablishDate: string;
  beneAlias: string;
  // ISO data-time; may be empty when there was no transfer yet
  lastTransactionDate: string;
  myAccountFlg: number;
}

// One way the beneficiary can receive money (e.g. a bank account).
export interface BeneficiaryPayout {
  payoutId: number;
  beneficiaryGuid: string;
  payoutType: string;
  accountName: string;
  accountNo: string;
  currency: string;
  bankCode: string;
  bankName: string;
}

// GET /api/remitters/{remitterGuid}/beneficiaries/{beneficiaryGuid}/payouts
export interface BeneficiaryPayoutsResponse {
  beneficiary: BeneficiaryDetail;
  payouts: BeneficiaryPayout[];
}
