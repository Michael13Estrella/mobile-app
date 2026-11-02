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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language } from "../../types/language.types";

const LOCALE_KEY = "@mbj-app/locale";
const THEME_KEY = "@mbj-app/theme";
const INSTALL_MARKER_KEY = "@mbj-app/install-marker";
const INSTALL_MARKER_VALUE = "true";
const PASSCODE_MARKER_PREFIX = "@mbj-app/passcode-marker-";

const passcodeMarkerKey = (kcId: string) => `${PASSCODE_MARKER_PREFIX}${kcId}`;

export const preferenceService = {
  getLocale: async (): Promise<Language | null> => {
    const value = await AsyncStorage.getItem(LOCALE_KEY);
    return value === "en" || value === "ja" ? value : null;
  },

  setLocale: async (lang: Language): Promise<void> => {
    await AsyncStorage.setItem(LOCALE_KEY, lang);
  },

  getTheme: async (): Promise<"light" | "dark" | "system" | null> => {
    const value = await AsyncStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" || value === "system"
      ? value
      : null;
  },

  setTheme: async (theme: "light" | "dark" | "system"): Promise<void> => {
    await AsyncStorage.setItem(THEME_KEY, theme);
  },

  hasInstallMarker: async (): Promise<boolean> => {
    return (await AsyncStorage.getItem(INSTALL_MARKER_KEY)) !== null;
  },

  setInstallMarker: async (): Promise<void> => {
    await AsyncStorage.setItem(INSTALL_MARKER_KEY, INSTALL_MARKER_VALUE);
  },

  hasPasscodeMarker: async (kcId: string): Promise<boolean> => {
    return (await AsyncStorage.getItem(passcodeMarkerKey(kcId))) !== null;
  },

  setPasscodeMarker: async (kcId: string): Promise<void> => {
    await AsyncStorage.setItem(passcodeMarkerKey(kcId), INSTALL_MARKER_VALUE);
  },

  clearPasscodeMarker: async (kcId: string): Promise<void> => {
    await AsyncStorage.removeItem(passcodeMarkerKey(kcId));
  },
};
