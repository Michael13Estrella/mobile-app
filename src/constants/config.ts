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

import { Platform } from "react-native";

const ANDROID_EMULATOR_HOST = process.env.EXPO_PUBLIC_ANDROID_LOCALHOST;

const LOCALHOST_PATTERN = /\/\/(localhost|127\.0\.0\.1)(?=[:/]|$)/;

const resolveLocalHost = (url: string): string =>
  Platform.OS === "android"
    ? url.replace(LOCALHOST_PATTERN, `//${ANDROID_EMULATOR_HOST}`)
    : url;

export const CONFIG = {
  API_BASE_URL: resolveLocalHost(process.env.EXPO_PUBLIC_API_BASE_URL!),
  API_KEY: process.env.EXPO_PUBLIC_API_KEY!,
  APP_BUNDLE_ID: process.env.EXPO_PUBLIC_APP_BUNDLE_ID!,
  KEYCLOAK: {
    URL: process.env.EXPO_PUBLIC_KEYCLOAK_URL!,
    CLIENT_ID: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID!,
    REDIRECT_URI_SCHEME: process.env.EXPO_PUBLIC_KEYCLOAK_REDIRECT_SCHEME!,
    REDIRECT_PATH: process.env.EXPO_PUBLIC_KEYCLOAK_REDIRECT_PATH!,
  },
} as const;
