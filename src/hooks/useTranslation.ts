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

export const useTranslation = () => {
  const dispatch = useAppDispatch();
  const locale = useAppSelector((state) => state.ui.locale);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  const t = (key: string, options?: Record<string, unknown>) => {
    return i18n.t(key, options);
  };

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
