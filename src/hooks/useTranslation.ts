/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-04
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import i18n from "../locales/_i18n";
import { useAppDispatch, useAppSelector } from "../store";
import { setLocale as setLocaleAction } from "../store/slices/uiSlice";
import { preferenceService } from "../services/storage/preferenceService";
import { Language } from "../types/language.types";
import { deviceEnrollmentService } from "../services/security/deviceEnrollmentService";
import { TranslationKey } from "../types";
import { useCallback } from "react";

export const useTranslation = () => {
  const dispatch = useAppDispatch();
  const locale = useAppSelector((state) => state.ui.locale);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  // The same function until the language changes: a new one each render
  // would re-run every effect and memo that depends on it (an endless
  // re-render in Send Money). `locale` is a dependency on purpose: i18n.t
  // reads the current language, so a new language needs a new t
  const t = useCallback(
    (key: TranslationKey, options?: Record<string, unknown>) =>
      i18n.t(key, options),
    [locale],
  );

  const setLocale = async (lang: Language) => {
    i18n.locale = lang;
    dispatch(setLocaleAction(lang));
    await preferenceService.setLocale(lang);

    if (isAuthenticated) {
      deviceEnrollmentService.setLanguage(lang).catch(() => {});
    }
  };

  return { t, locale, setLocale };
};

// The t function, for code outside components (e.g. schema builders)
export type Translate = ReturnType<typeof useTranslation>["t"];
