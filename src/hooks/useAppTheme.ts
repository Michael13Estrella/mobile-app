import { useColorScheme } from "react-native";
import { useAppDispatch, useAppSelector } from "../store";
import { darkTheme, lightTheme } from "../theme/paperTheme";
import { DarkColors, LightColors } from "../constants/colors";
import { setThemeMode as setThemeModeAction } from "../store/slices/uiSlice";
import { preferenceService } from "../services/storage/preferenceService";

export const useAppTheme = () => {
  const systemScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.ui.themeMode);

  const isDark =
    themeMode === "dark" || (themeMode === "system" && systemScheme === "dark");

  const theme = isDark ? darkTheme : lightTheme;
  const colors = isDark ? DarkColors : LightColors;

  const setThemeMode = async (themeMode: "light" | "dark" | "system") => {
    dispatch(setThemeModeAction(themeMode));
    await preferenceService.setTheme(themeMode);
  };

  return {
    theme,
    colors,
    isDark,
    themeMode,
    setThemeMode,
  };
};
