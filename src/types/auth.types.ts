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

import { Language } from "./language.types";

export interface AuthExchangeRequest {
  code: string;
  codeVerifier: string;
  redirectUri: string;
  lang?: string;
}

export interface OtpVerifyRequest {
  txId: string;
  otp: string;
}

export interface OtpResendRequest {
  txId: string;
  lang: Language;
}

export interface OtpRequiredResponse {
  otpRequired: boolean;
  txId: string;
}

export interface TokenRefreshRequest {
  refreshToken: string;
  isWriteLoginInfo?: boolean; // set to true during Passcode login
}

// Wire shape from the API (refresh token may be omitted by Keycloak)
export interface TokenResponse {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number;
  tokenType: string;
}

// Domain shape — what the app stores & keeps in state (never null)
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface User {
  id: string;
  email: string;
}

// AuthState is Redux state - do not use readonly
export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}
