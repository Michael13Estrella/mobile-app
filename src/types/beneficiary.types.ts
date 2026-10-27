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

import { BENEFICIARY_TYPE } from "../constants/beneficiary";
import { PAYOUT_TYPE } from "../constants/payout";
import { Gender } from "../constants/userFields";

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
  birthOrEstablishDate: string | null;
  beneAlias: string;
  // ISO date-time; null when there was no transfer yet
  lastTransactionDate: string | null;
  myAccountFlg: number;
}

// Beneficiary's payout
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

// The beneficiary part of POST /api/remitters/{remitterGuid}/beneficiaries
// Only the fields of its beneficiaryType are sent; optional fields left
// empty are left out. The server sets the guid, number, status and audit fields
interface CreateBeneficiaryBase {
  relationToBeneCode: string;
  // Free text when the relationship is "Others"
  relationToBeneOthers?: string;
  address1: string;
  address2?: string;
  cityProvCode: string;
  zipPosCode: string;
  mobileNo?: string;
  // Birth date (individuals) or establishment date (corporate), ISO date-time
  birthOrEstablishDate?: string;
  // 1 for the remitter's own account, otherwise 0
  myAccountFlg: number;
}

export interface CreateIndividualBeneficiary extends CreateBeneficiaryBase {
  beneficiaryType: typeof BENEFICIARY_TYPE.INDIVIDUAL;
  beneAlias?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender?: Gender;
}

export interface CreateCorporateBeneficiary extends CreateBeneficiaryBase {
  beneficiaryType: typeof BENEFICIARY_TYPE.CORPORATE;
  companyName: string;
  officeTelNo: string;
}

export type CreateBeneficiaryDetails =
  | CreateIndividualBeneficiary
  | CreateCorporateBeneficiary;

export interface CreateBeneficiaryPayoutCA {
  payoutType: typeof PAYOUT_TYPE.METROBANK_ACCOUNT;
  // "PHP", "USD", "JPY"
  currency: string;
  caBankNameCode: string;
  caAccountNo: string;
  caBranchName?: string;
}

export interface CreateBeneficiaryPayoutOB {
  payoutType: typeof PAYOUT_TYPE.OTHER_BANKS;
  // "PHP", "USD"
  currency: string;
  obBankNameCode: string;
  // E-wallets: the 11-digit mobile number
  obAccountNo: string;
  // Bank only: e-wallets have no branch
  obBranchName?: string;
}

export interface CreateBeneficiaryPayoutCP {
  payoutType: typeof PAYOUT_TYPE.CASH_PICKUP;
}

export type CreateBeneficiaryPayout =
  | CreateBeneficiaryPayoutCA
  | CreateBeneficiaryPayoutOB
  | CreateBeneficiaryPayoutCP;

// POST /api/remitters/{remitterGuid}/beneficiaries
export interface CreateBeneficiaryRequest {
  beneficiary: CreateBeneficiaryDetails;
  payout: CreateBeneficiaryPayout;
}

// The result of saving a new beneficiary. message: the server's first error
// message, when it sent one (otherwise the screen shows a generic error)
export type CreateBeneficiaryResult =
  | Readonly<{ ok: true }>
  | Readonly<{ ok: false; message?: string }>;

// What a payout row shows: a saved payout, or a new one before it's saved
export type PayoutSummary = Pick<
  BeneficiaryPayout,
  "payoutType" | "bankCode" | "bankName" | "accountNo" | "currency"
>;
