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

// Re-checks the logged-in remitter's email before a sensitive action (Send
// Money); the response is an OtpRequiredResponse
export interface CurrentEmailOtpRequest {
  sendToSms: boolean;
}

export interface VerifyCurrentEmailOtpRequest {
  txId: string;
  otp: string;
}

export interface ResendCurrentEmailOtpRequest {
  txId: string;
  lang: Language;
  sendToSms: boolean;
}

// Proof of the check, passed on to the action (send-money's `challenge`)
export interface VerifyCurrentEmailOtpResponse {
  challenge: string;
}

// How a current-email OTP check ended: the challenge on success; otherwise
// why, so the screen can say so (or leave after too many tries)
export type VerifyCurrentEmailOtpResult =
  | Readonly<{ status: "success"; challenge: string }>
  | Readonly<{ status: "incorrect" | "expired" | "locked" }>;

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
