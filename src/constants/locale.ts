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
