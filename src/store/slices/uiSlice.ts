/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-02
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Language } from "../../types/language.types";
import type { ToastVariant } from "../../types";

// The toast on screen. id changes with every showToast, so the same
// message shown twice restarts its timer
type Toast = Readonly<{ id: number; message: string; variant: ToastVariant }>;

interface UIState {
  themeMode: "light" | "dark" | "system";
  locale: Language;
  isLoading: boolean;
  isAppReady: boolean;
  isLocked: boolean;
  isAuthenticating: boolean;
  needsPasscodeSetup: boolean;
  needsBiometricPrompt: boolean;
  toast: Toast | null;
  // A toast for the screen that gets focus next (e.g. saved, then back):
  // navigation runs after the current code, so that screen shows it itself
  pendingToast: Omit<Toast, "id"> | null;
}

const initialState: UIState = {
  themeMode: "system",
  locale: "en",
  isLoading: false,
  isAppReady: false,
  isLocked: false,
  isAuthenticating: false,
  needsPasscodeSetup: false,
  needsBiometricPrompt: false,
  toast: null,
  pendingToast: null,
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
    setNeedsPasscodeSetup: (state, action: PayloadAction<boolean>) => {
      state.needsPasscodeSetup = action.payload;
    },
    setNeedsBiometricPrompt: (state, action: PayloadAction<boolean>) => {
      state.needsBiometricPrompt = action.payload;
    },
    // Replaces the toast on screen (only one at a time)
    showToast: (state, action: PayloadAction<Omit<Toast, "id">>) => {
      state.toast = { id: (state.toast?.id ?? 0) + 1, ...action.payload };
    },
    hideToast: (state) => {
      state.toast = null;
    },
    // Shown by the next screen that gets focus, not this one
    showToastOnNextScreen: (
      state,
      action: PayloadAction<Omit<Toast, "id">>,
    ) => {
      state.pendingToast = action.payload;
    },
    // Called by a screen when it gets focus
    showPendingToast: (state) => {
      if (!state.pendingToast) return;
      state.toast = {
        id: (state.toast?.id ?? 0) + 1,
        ...state.pendingToast,
      };
      state.pendingToast = null;
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
  setNeedsPasscodeSetup,
  setNeedsBiometricPrompt,
  showToast,
  hideToast,
  showToastOnNextScreen,
  showPendingToast,
  setLocale,
} = uiSlice.actions;

export default uiSlice.reducer;
