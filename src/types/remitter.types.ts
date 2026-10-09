/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

export interface Remitter {
  remitterGuid: string;
  remitterStatus: number;
  submitDate: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nickName: string;
  gender: string;
  postalCode: string;
  prefecture: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  birthDate: string;
  mobile: string;
  mobileCountryCode: string;
  professionCode: string;
  professionOthers: string;
  companyName: string;
  nationality: string;
  visaStatusCode: string;
  visaStatusOthers: string;
  schoolName: string;
  natureOfBusiness: string;
  primaryIDType: string;
  primaryIDNo: string;
  primaryIDExpiry: string;
  advertisingCode: string;
  residentType: number;
  riskProfile: string;
  riskUpdatedDate: string;
  dueDate: string;
  cafRequiredFlg: number;
  remitterGroup: string;
}

// RemitterState is Redux state - do not use readonly
export interface RemitterState {
  // null until the dashboard has loaded (and after logout)
  profile: Remitter | null;
}
