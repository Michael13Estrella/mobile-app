/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-01
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

export type PhoneCountry = Readonly<{
  dialCode: string; // without "+", the value the API expects in mobileCountryCode
  isoAlpha2: string; // ISO 3166-1 alpha-2 for the flag
  template: string; // input mask; each "x" is on digit
}>;

export const PHONE_DIGIT_PLACEHOLDER = "x";

export const PHONE_COUNTRIES = {
  JP: { dialCode: "81", isoAlpha2: "JP", template: "xx - xxxx - xxxx" },
  PH: { dialCode: "63", isoAlpha2: "PH", template: "xxx - xxx - xxxx" },
} as const satisfies Record<string, PhoneCountry>;

export const REMITTER_PHONE_COUNTRY: PhoneCountry = PHONE_COUNTRIES.JP;
export const BENEFICIARY_PHONE_COUNTRY: PhoneCountry = PHONE_COUNTRIES.PH;
