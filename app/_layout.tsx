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

import { ReactNode, useEffect, useState } from "react";
import { Slot, router, useSegments } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import * as WebBrowser from "expo-web-browser";
import { useAppSelector, useAppDispatch, store } from "../src/store";
import { useAppTheme } from "../src/hooks/useAppTheme";
import { setTokens, setUser } from "../src/store/slices/authSlice";
import { keycloakService } from "../src/services/auth/keycloakService";
import { decodeToken, isTokenExpired } from "../src/utils/tokenUtils";
import {
  setAppReady,
  setLocale,
  setLocked,
  setNeedsPasscodeSetup,
  setThemeMode,
} from "../src/store/slices/uiSlice";
import * as SplashScreen from "expo-splash-screen";
import { preferenceService } from "../src/services/storage/preferenceService";
import { getLocales } from "expo-localization";
import i18n from "../src/locales/_i18n";
import { deviceEnrollmentService } from "../src/services/security/deviceEnrollmentService";
import { useAppLock } from "../src/hooks/useAppLock";
import { LockScreen } from "../src/components/screens/lock/LockScreen";
import { lockService } from "../src/services/security/lockService";
import { usePushNotification } from "../src/hooks/usePushNotification";
import { Language } from "../src/types/language.types";
import { StatusBar } from "react-native";
import { passcodeService } from "../src/services/security/passcodeService";
import { SplashScreen as AppSplashScreen } from "../src/components/screens/SplashScreen";
import { useFonts } from "expo-font";
import {
  NotoSans_100Thin,
  NotoSans_200ExtraLight,
  NotoSans_300Light,
  NotoSans_400Regular,
  NotoSans_500Medium,
  NotoSans_600SemiBold,
  NotoSans_700Bold,
  NotoSans_800ExtraBold,
  NotoSans_900Black,
  NotoSans_400Regular_Italic,
  NotoSans_700Bold_Italic,
} from "@expo-google-fonts/noto-sans";
import {
  NotoSansJP_100Thin,
  NotoSansJP_200ExtraLight,
  NotoSansJP_300Light,
  NotoSansJP_400Regular,
  NotoSansJP_500Medium,
  NotoSansJP_600SemiBold,
  NotoSansJP_700Bold,
  NotoSansJP_800ExtraBold,
  NotoSansJP_900Black,
} from "@expo-google-fonts/noto-sans-jp";
import {
  BRAND_WEIGHT_FONTS_EN,
  BRAND_ITALIC_FONTS_EN,
  GLOBAL_ITALIC_FONTS_EN,
  GLOBAL_WEIGHT_FONTS_EN,
  GLOBAL_WEIGHT_FONTS_JA,
} from "../src/constants/typography";

const SPLASH_MIN_DURATION_MS = 3000;

SplashScreen.preventAutoHideAsync().catch(() => {});
WebBrowser.maybeCompleteAuthSession();

if (__DEV__) {
  console.log("🟢 APP BOOT", new Date().toISOString());
  console.log("API BASE URL: ", process.env.EXPO_PUBLIC_API_BASE_URL);
}

// Single source of truth for where to land right after authentication.
const resolvePostLoginRoute = (
  needsPasscodeSetup: boolean,
  needsBiometricPrompt: boolean,
): string => {
  if (needsPasscodeSetup) return "/(protected)/(onboarding)/secure-prompt";
  if (needsBiometricPrompt) return "/(protected)/(onboarding)/biometric";
  return "/(protected)/(tabs)/home";
};

function AppContent() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isAppReady = useAppSelector((state) => state.ui.isAppReady);
  const isLocked = useAppSelector((state) => state.ui.isLocked);
  const needsPasscodeSetup = useAppSelector(
    (state) => state.ui.needsPasscodeSetup,
  );
  const needsBiometricPrompt = useAppSelector(
    (state) => state.ui.needsBiometricPrompt,
  );
  const dispatch = useAppDispatch();
  const segments = useSegments();
  const [showAppSplash, setShowAppSplash] = useState(true);
  const [nativeSplashHidden, setNativeSplashHidden] = useState(false);
  const [minSplashTimeElapsed, setMinSplashTimeElapsed] = useState(false);

  const [fontsLoaded] = useFonts({
    // Metrobank Sans — upright
    [BRAND_WEIGHT_FONTS_EN.light]: require("../assets/fonts/MetrobankSans/MetrobankSans-Light.ttf"),
    [BRAND_WEIGHT_FONTS_EN.regular]: require("../assets/fonts/MetrobankSans/MetrobankSans-Regular.ttf"),
    [BRAND_WEIGHT_FONTS_EN.bold]: require("../assets/fonts/MetrobankSans/MetrobankSans-Bold.ttf"),
    // Metrobank Sans — italic
    [BRAND_ITALIC_FONTS_EN.light]: require("../assets/fonts/MetrobankSans/MetrobankSans-LightItalic.ttf"),
    [BRAND_ITALIC_FONTS_EN.regular]: require("../assets/fonts/MetrobankSans/MetrobankSans-Italic.ttf"),
    [BRAND_ITALIC_FONTS_EN.bold]: require("../assets/fonts/MetrobankSans/MetrobankSans-BoldItalic.ttf"),
    // Noto Sans — English
    [GLOBAL_WEIGHT_FONTS_EN.thin]: NotoSans_100Thin,
    [GLOBAL_WEIGHT_FONTS_EN.extraLight]: NotoSans_200ExtraLight,
    [GLOBAL_WEIGHT_FONTS_EN.light]: NotoSans_300Light,
    [GLOBAL_WEIGHT_FONTS_EN.regular]: NotoSans_400Regular,
    [GLOBAL_WEIGHT_FONTS_EN.medium]: NotoSans_500Medium,
    [GLOBAL_WEIGHT_FONTS_EN.semibold]: NotoSans_600SemiBold,
    [GLOBAL_WEIGHT_FONTS_EN.bold]: NotoSans_700Bold,
    [GLOBAL_WEIGHT_FONTS_EN.extrabold]: NotoSans_800ExtraBold,
    [GLOBAL_WEIGHT_FONTS_EN.black]: NotoSans_900Black,
    // Noto Sans - italic
    [GLOBAL_ITALIC_FONTS_EN.regular]: NotoSans_400Regular_Italic,
    [GLOBAL_ITALIC_FONTS_EN.bold]: NotoSans_700Bold_Italic,
    // Noto Sans JP — used for ALL Japanese text, brand and global tokens alike
    [GLOBAL_WEIGHT_FONTS_JA.thin]: NotoSansJP_100Thin,
    [GLOBAL_WEIGHT_FONTS_JA.extraLight]: NotoSansJP_200ExtraLight,
    [GLOBAL_WEIGHT_FONTS_JA.light]: NotoSansJP_300Light,
    [GLOBAL_WEIGHT_FONTS_JA.regular]: NotoSansJP_400Regular,
    [GLOBAL_WEIGHT_FONTS_JA.medium]: NotoSansJP_500Medium,
    [GLOBAL_WEIGHT_FONTS_JA.semibold]: NotoSansJP_600SemiBold,
    [GLOBAL_WEIGHT_FONTS_JA.bold]: NotoSansJP_700Bold,
    [GLOBAL_WEIGHT_FONTS_JA.extrabold]: NotoSansJP_800ExtraBold,
    [GLOBAL_WEIGHT_FONTS_JA.black]: NotoSansJP_900Black,
  });

  // Lock layer: cold-start + background-timeout triggers
  useAppLock();
  usePushNotification();

  // Enforce a minimum on-screen duration for the branded splash, independent
  // of how fast session restore actually finishes.
  useEffect(() => {
    const timer = setTimeout(
      () => setMinSplashTimeElapsed(true),
      SPLASH_MIN_DURATION_MS,
    );
    return () => clearTimeout(timer);
  }, []);

  // Remove the JS cover only once the native splash has actually hidden AND
  // the minimum duration has elapsed - whichever finishes later.
  useEffect(() => {
    if (nativeSplashHidden && minSplashTimeElapsed) {
      setShowAppSplash(false);
    }
  }, [nativeSplashHidden, minSplashTimeElapsed]);

  // Restore session on app load
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Restore locale
        const savedLocale = await preferenceService.getLocale();
        const deviceLanguage = getLocales()[0]?.languageCode;
        const resolvedLocale: Language =
          savedLocale ?? (deviceLanguage === "ja" ? "ja" : "en");
        i18n.locale = resolvedLocale;
        dispatch(setLocale(resolvedLocale));

        if (!savedLocale) {
          await preferenceService.setLocale(resolvedLocale);
        }

        // Restore theme
        const savedTheme = await preferenceService.getTheme();
        if (savedTheme) {
          dispatch(setThemeMode(savedTheme));
        }

        const accessToken = await keycloakService.getAccessToken();
        const refreshToken = await keycloakService.getRefreshToken();

        // No refresh token -> must log in
        if (!refreshToken) return;

        // Access token still valid -> restore directly
        if (accessToken && !isTokenExpired(accessToken)) {
          dispatch(
            setTokens({
              accessToken,
              refreshToken,
              expiresIn: 300,
              tokenType: "Bearer",
            }),
          );
          const user = decodeToken(accessToken);
          if (user) {
            dispatch(setUser(user));
            await deviceEnrollmentService.ensureEnrolled(user.id);
          }
        }

        // Access expired/missing -> try to refresh. Let the SERVER decide if the refresh
        // token is valid (don't decode its exp - offline tokens have exp = 0).
        const newTokens = await keycloakService.refreshAccessToken();
        if (newTokens) {
          dispatch(setTokens(newTokens));
          const user = decodeToken(newTokens.accessToken);
          if (user) {
            dispatch(setUser(user));
            await deviceEnrollmentService.ensureEnrolled(user.id);
          } else {
            await keycloakService.clearTokens(); // refresh truly failed -> login
          }
        }
      } catch {
        await keycloakService.clearTokens();
      } finally {
        // Re-derive onboarding state on every cold start. Without this, killing the
        // app mid-onboarding leaves needsPasscodeSetup at its initial 'false' and the
        // redirect effect sends the user to home with no PASSCODE set.
        const userId = await keycloakService.getCurrentUserId();
        if (userId) {
          dispatch(
            setNeedsPasscodeSetup(!(await passcodeService.isSet(userId))),
          );
        }

        // Decide lock state BEFORE the splash hides (splash hides on isAppReady),
        // so the LockScreen overlay is up on the first frame instead of flashing home
        if (await lockService.shouldLock()) {
          dispatch(setLocked(true));
        }
        dispatch(setAppReady(true));
      }
    };

    void restoreSession();
  }, []);

  // Redirect based on auth state. Single navigation authority for post-login:
  // onboarding (no PASSCODE yet) -> set-passcode, otherwise home.
  useEffect(() => {
    if (!isAppReady) return; // wait until session is restored
    if (!fontsLoaded) return; // wait until custom fonts are ready

    const inProtected = segments[0] === "(protected)";
    const inAuth = segments[0] === "(auth)";
    const inOnboarding = inProtected && segments.includes("(onboarding)");
    const atRoot = !segments[0]; // "/" - index.tsx, before any group mounts

    // isLocked is only ever set when a session exists, so it counts as one here:
    // a restore whose refresh call hasn't landed yet still belongs post-login
    const hasSession = isAuthenticated || isLocked;
    const postLoginRoute = resolvePostLoginRoute(
      needsPasscodeSetup,
      needsBiometricPrompt,
    );

    if (atRoot) {
      router.replace(hasSession ? postLoginRoute : "/(auth)/welcome");
      return; // keep splash up until we land
    }

    if (!isAuthenticated && inProtected) {
      router.replace("/(auth)/welcome");
      return;
    }

    if (isAuthenticated && inAuth) {
      router.replace(postLoginRoute);
      return;
    }

    // HARD GATE: an authenticated session without a PASSCODE may not sit anywhere in
    // (protected) except the onboarding group.
    if (isAuthenticated && needsPasscodeSetup && inProtected && !inOnboarding) {
      router.replace("/(protected)/(onboarding)/secure-prompt");
      return;
    }

    // Remove the JS cover even if hiding the native splash fails (e.g. it was
    // already hidden); otherwise the cover would stay up forever.
    const markNativeSplashHidden = () => setNativeSplashHidden(true);
    SplashScreen.hideAsync().then(
      markNativeSplashHidden,
      markNativeSplashHidden,
    );
  }, [
    isAuthenticated,
    isAppReady,
    isLocked,
    needsBiometricPrompt,
    needsPasscodeSetup,
    segments,
  ]);

  return (
    <>
      <Slot />
      {isLocked && <LockScreen />}
      {showAppSplash && <AppSplashScreen />}
    </>
  );
}

function AppProviders({ children }: { readonly children: ReactNode }) {
  const { theme, isDark } = useAppTheme();
  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      {children}
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <AppProviders>
            <AppContent />
          </AppProviders>
        </SafeAreaProvider>
      </KeyboardProvider>
    </Provider>
  );
}
