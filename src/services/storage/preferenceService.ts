import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language } from "../../types/language.types";

const LOCALE_KEY = "@mbj-app/locale";
const THEME_KEY = "@mbj-app/theme";

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
};
