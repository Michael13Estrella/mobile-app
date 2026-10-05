import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Language } from "../../types/language.types";

interface UIState {
  themeMode: "light" | "dark" | "system";
  locale: Language;
  isLoading: boolean;
  isAppReady: boolean;
  isLocked: boolean;
  isAuthenticating: boolean;
  needsPinSetup: boolean;
  needsBiometricPrompt: boolean;
  toast: {
    visible: boolean;
    message: string;
    type: "success" | "error" | "info" | "warning";
  } | null;
}

const initialState: UIState = {
  themeMode: "system",
  locale: "en",
  isLoading: false,
  isAppReady: false,
  isLocked: false,
  isAuthenticating: false,
  needsPinSetup: false,
  needsBiometricPrompt: false,
  toast: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setThemeMode: (
      state,
      action: PayloadAction<"light" | "dark" | "system">,
    ) => {
      state.themeMode = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAppReady: (state, action: PayloadAction<boolean>) => {
      state.isAppReady = action.payload;
    },
    setLocked: (state, action: PayloadAction<boolean>) => {
      state.isLocked = action.payload;
    },
    setAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticating = action.payload;
    },
    setNeedsPinSetup: (state, action: PayloadAction<boolean>) => {
      state.needsPinSetup = action.payload;
    },
    setNeedsBiometricPrompt: (state, action: PayloadAction<boolean>) => {
      state.needsBiometricPrompt = action.payload;
    },
    showToast: (state, action: PayloadAction<UIState["toast"]>) => {
      state.toast = action.payload;
    },
    hideToast: (state) => {
      state.toast = null;
    },
    setLocale: (state, action: PayloadAction<Language>) => {
      state.locale = action.payload;
    },
  },
});

export const {
  setThemeMode,
  setLoading,
  setAppReady,
  setLocked,
  setAuthenticating,
  setNeedsPinSetup,
  setNeedsBiometricPrompt,
  showToast,
  hideToast,
  setLocale,
} = uiSlice.actions;

export default uiSlice.reducer;
