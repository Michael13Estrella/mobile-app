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

import { TranslationKey } from "../types";

export const GENDER_VALUES = ["M", "F"] as const;
export type Gender = (typeof GENDER_VALUES)[number];

export const GENDER_OPTIONS: { value: Gender; labelKey: TranslationKey }[] = [
  { value: "M", labelKey: "remitter.gender.male" },
  { value: "F", labelKey: "remitter.gender.female" },
];
