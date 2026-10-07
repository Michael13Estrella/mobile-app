/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-08-27
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

export interface CheckEmailRequest {
  email: string;
  lang: string;
}

export interface CheckEmailResendRequest {
  txId: string;
  lang: string;
}

export interface VerifyEmailRequest {
  txId: string;
  otp: string;
}

export interface VerifyEmailResponse {
  challenge: string;
}

export interface RegisterRequest {
  challenge: string;
  email: string;
  password: string;
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
  birthDate: string; // ISO date string
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
  primaryIDExpiry: string; // ISO date string
  advertisingCode: string;
}
