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

export interface ReferenceDataItem {
  code: string;
  codeDescEng: string;
  codeDescJap: string;
}

export interface Nationality {
  nationality: string;
  isoAlpha2: string;
  isoAlpha3: string;
  isoNumeric: string;
  countryEn: string;
  countryJp: string;
}

export interface PostalLookupResult {
  postalCode: string;
  cityOrPrefecture: string;
  addressLine2: string;
  addressLine3: string;
}

export interface PhilippineAreaResult {
  areaZipCodeAndCityProvCode: string;
  areaNameAndCityProvName: string;
}
