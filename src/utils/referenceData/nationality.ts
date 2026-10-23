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

import { Language } from "../../types/language.types";
import { Nationality } from "../../types/referenceData.types";
import { DropdownOption } from "./referenceData";

// Words that stay lowercase inside a name ("Antigua and Barbuda").
const MINOR_WORDS_PATTERN = /(?!^)\b(And|Of|The|Da|De)\b/g;

/**
 * A country name sent in capitals by the API, in display form: each word
 * capitalized (also after "-", "(", "/", "'"), minor words in lowercase
 * except at the start.
 *
 * @param name - The English name as sent (e.g. "ANTIGUA AND BARBUDA").
 * @returns The display name.
 * @example formatCountryName("GUINEA-BISSAU"); // "Guinea-Bissau"
 */
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

/**
 * A nationality's display name in the app language: the Japanese name as
 * sent, or the English name formatted.
 *
 * @param item - The nationality from the API.
 * @param locale - The app language.
 * @returns The display name.
 * @example getNationalityName(philippines, "en"); // "Philippines"
 */
export const getNationalityName = (item: Nationality, locale: Language) =>
  locale === "ja" ? item.countryJp : formatCountryName(item.countryEn);

/**
 * Picker options for the nationality select: `value` is the code the API
 * expects back, `isoAlpha2` drives the flag.
 *
 * @param items - The nationalities from the API.
 * @param locale - The app language (for the labels).
 * @returns One option per nationality.
 * @example toNationalityOptions(items, "en")[0]; // { value: "PHL", label: "Philippines", isoAlpha2: "PH" }
 */
export const toNationalityOptions = (
  items: Nationality[],
  locale: Language,
): DropdownOption[] =>
  items.map((item) => ({
    value: item.nationality,
    label: getNationalityName(item, locale),
    isoAlpha2: item.isoAlpha2,
  }));

/**
 * The display name for a saved nationality code (e.g. on the confirm
 * screen).
 *
 * @param items - The nationalities from the API.
 * @param code - The saved nationality code.
 * @param locale - The app language.
 * @returns The display name, or `code` itself if it isn't in `items`.
 * @example findNationalityName(items, "PHL", "ja"); // "フィリピン"
 */
export const findNationalityName = (
  items: Nationality[],
  code: string,
  locale: Language,
): string => {
  const found = items.find((item) => item.nationality === code);
  return found ? getNationalityName(found, locale) : code;
};
