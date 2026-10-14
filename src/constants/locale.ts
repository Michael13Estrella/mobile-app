/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Language } from "../types/language.types";

// App language -> locale used for number and date formatting (Intl).
export const INTL_LOCALE: Readonly<Record<Language, string>> = {
  en: "en-US",
  ja: "ja-JP",
};

// Locale for short date-time in lists ("23 Feb 3036, 07:32"): the design
// uses day-month-year and a 24-hour clock in English
export const LIST_DATE_LOCALE: Readonly<Record<Language, string>> = {
  en: "en-GB",
  ja: "ja-JP",
};
