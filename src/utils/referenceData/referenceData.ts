/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-08-28
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Language } from "../../types/language.types";
import {
  PhilippineAreaResult,
  ReferenceDataItem,
} from "../../types/referenceData.types";

export interface DropdownOption {
  label: string;
  value: string;
  // ISO alpha-2 code for country lists; shows a flag in the picker.
  isoAlpha2?: string;
}

// The item's description in the app language.
const labelOf = (item: ReferenceDataItem, locale: Language): string =>
  locale === "ja" ? item.codeDescJap : item.codeDescEng;

/**
 * Picker options for a reference-data list: `value` is the code the API
 * expects back, `label` the description in the app language.
 *
 * @param items - The list from the reference-master API.
 * @param locale - The app language.
 * @returns One option per item, in the API's order.
 * @example toDropdownOptions(professions, "en")[0]; // { value: "01", label: "Employee" }
 */
export const toDropdownOptions = (
  items: ReferenceDataItem[],
  locale: Language,
): DropdownOption[] =>
  items.map((item) => ({
    value: item.code,
    label: labelOf(item, locale),
  }));

/**
 * The display name of a saved code in the app language.
 *
 * @param items - The list from the reference-master API.
 * @param code - The saved code.
 * @param locale - The app language.
 * @returns The description, or `code` itself if it isn't in `items` (e.g.
 *   the list hasn't loaded yet).
 * @example getReferenceLabel(professions, "01", "ja"); // "会社員"
 */
export const getReferenceLabel = (
  items: ReferenceDataItem[],
  code: string,
  locale: Language,
): string => {
  const item = items.find((entry) => entry.code === code);
  if (!item) return code;
  return item ? labelOf(item, locale) : code;
};

/**
 * Picker options for Philippine areas (provinces or towns): `value` is the
 * code the API expects back, `label` the name.
 *
 * @param areas - The list from the area API
 * @returns One option per area, in the API's order
 * @example toAreaOptions([{ code: "1376", name: "Metro Manila" }]); // [{ value: "1376", label: "Metro Manila" }]
 */
export const toAreaOptions = (
  areas: readonly PhilippineAreaResult[],
): DropdownOption[] =>
  areas.map(({ code, name }) => ({ value: code, label: name }));
