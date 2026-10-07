/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-29
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import en from "./en.json";
import ja from "./ja.json";

const i18n = new I18n({ en, ja });

i18n.locale = getLocales()[0]?.languageCode ?? "en";
i18n.enableFallback = true;
i18n.defaultLocale = "en";

export default i18n;
