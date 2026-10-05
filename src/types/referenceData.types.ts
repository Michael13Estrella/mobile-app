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
