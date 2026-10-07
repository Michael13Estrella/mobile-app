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

import { Language } from "../types/language.types";
import { Nationality } from "../types/referenceData.types";
import { DropdownOption } from "./referenceData";

// Words that stay lowercase inside a name ("Antigua and Barbuda").
const MINOR_WORDS_PATTERN = /(?!^)\b(And|Of|The|Da|De)\b/g;

// The API sends English names in capitals:
// "ANTIGUA AND BARBUDA" -> "Antigua and Barbuda", "GUINEA-BISSAU" -> "Guinea-Bissau"
export const formatCountryName = (name: string): string =>
  name
    .trim()
    .toLowerCase()
    .replace(
      /(^|[\s\-(/'])([a-zà-ÿ])/g,
      (_, separator: string, letter: string) =>
        separator + letter.toUpperCase(),
    )
    .replace(MINOR_WORDS_PATTERN, (word) => word.toLowerCase());

export const getNationalityName = (item: Nationality, locale: Language) =>
  locale === "ja" ? item.countryJp : formatCountryName(item.countryEn);

// Nationality counterpart of toDropdownOptions: value is the code the API
// expects back, and isoAlpha2 drives the flag in the picker.
export const toNationalityOptions = (
  items: Nationality[],
  locale: Language,
): DropdownOption[] =>
  items.map((item) => ({
    value: item.nationality,
    label: getNationalityName(item, locale),
    isoAlpha2: item.isoAlpha2,
  }));

// Display name for a saved code (e.g. on the confirm screen); falls back to the code.
export const findNationalityName = (
  items: Nationality[],
  code: string,
  locale: Language,
): string => {
  const found = items.find((item) => item.nationality === code);
  return found ? getNationalityName(found, locale) : code;
};
