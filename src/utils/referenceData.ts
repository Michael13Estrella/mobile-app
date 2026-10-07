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

import { Language } from "../types/language.types";
import { ReferenceDataItem } from "../types/referenceData.types";

export interface DropdownOption {
  label: string;
  value: string;
  // ISO alpha-2 code for country lists; shows a flag in the picker.
  isoAlpha2?: string;
}

export const toDropdownOptions = (
  items: ReferenceDataItem[],
  locale: Language,
): DropdownOption[] =>
  items.map((item) => ({
    value: item.code,
    label: locale === "ja" ? item.codeDescJap : item.codeDescEng,
  }));

// Display name of a reference-data code in the current language.
// Unknown code (e.g. data not loaded yet) -> the code itself
export const getReferenceLabel = (
  items: ReferenceDataItem[],
  code: string,
  locale: Language,
): string => {
  const item = items.find((entry) => entry.code === code);
  if (!item) return code;
  return locale === "ja" ? item.codeDescJap : item.codeDescEng;
};
