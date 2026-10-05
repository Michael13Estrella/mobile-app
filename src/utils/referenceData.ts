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
