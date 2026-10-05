import * as AuthSession from "expo-auth-session";
import { keycloakService } from "../services/auth/keycloakService";
import { useAppDispatch, useAppSelector } from "../store";
import {
  setTokens,
  setLoading,
  setError,
  logout,
  setUser,
} from "../store/slices/authSlice";
import { CONFIG } from "../constants/config";
import { useCallback } from "react";
import {
  AuthExchangeRequest,
  AuthTokens,
  OtpRequiredResponse,
  OtpResendRequest,
  OtpVerifyRequest,
  TokenResponse,
} from "../types/auth.types";
import { decodeToken } from "../utils/tokenUtils";
import { deviceEnrollmentService } from "../services/security/deviceEnrollmentService";
import { biometricService } from "../services/security/biometricService";
import { biometricEnrollment } from "../services/security/biometricEnrollmentService";
import { useTranslation } from "./useTranslation";
import { apiClient } from "../services/api/apiClient";
import { ENDPOINTS } from "../constants/endpoints";
import { pinService } from "../services/security/pinService";
import {
  BiometricRefreshRequest,
  ChallengeResponse,
  StatusResponse,
} from "../types";
import {
  setNeedsBiometricPrompt,
  setNeedsPinSetup,
} from "../store/slices/uiSlice";
import { notificationService } from "../services/notifications/notificationService";
import { firstErrorMessage } from "../utils/apiErrors";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, user, error } = useAppSelector(
    (state) => state.auth,
  );
  const { locale } = useAppSelector((state) => state.ui);
  const { t } = useTranslation();

  const redirectUri = keycloakService.getRedirectUri();

  const [request, , promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CONFIG.KEYCLOAK.CLIENT_ID,
      scopes: ["openid", "profile", "email", "offline_access"],
      redirectUri,
      prompt: AuthSession.Prompt.Login,
      extraParams: {
        kc_locale: locale,
        ui_locales: locale,
      },
    },
    keycloakService.discovery,
  );

  const finalizeSession = useCallback(
    async (tokens: AuthTokens) => {
      const decoded = decodeToken(tokens.accessToken);
      if (!decoded) return;

      // needsPin = true means the user is first login
      const needsPin = !(await pinService.isSet(decoded.id));
      const needsBiometricPrompt = await biometricService.needsReprompt(
        decoded.id,
      );
      await keycloakService.saveTokens(tokens);

      dispatch(setNeedsPinSetup(needsPin));
      dispatch(setNeedsBiometricPrompt(needsBiometricPrompt));
      dispatch(setTokens(tokens));
      dispatch(setUser(decoded));

      // Account switch: drop a different user's biometric
      const activeBioUser = await biometricService.getActiveUser();
      if (activeBioUser && activeBioUser !== decoded.id) {
        await biometricService.disable(activeBioUser);
      }

      // OIDC re-auth clears PIN lockout
      await pinService.resetAttempts(decoded.id);

      // Enroll device
      try {
        await deviceEnrollmentService.ensureEnrolled(decoded.id);
      } catch (e) {
        if (__DEV__) console.log("Device enrollment failed:", e);
        await keycloakService.clearTokens(); // roll back
        throw e;
      }
    },
    [dispatch],
  );

  // OIDC login -> exchange -> returns OTP requirement (no tokens yet).
  const login = useCallback(async (): Promise<{
    status: "otp" | "failed";
    txId?: string;
  }> => {
    if (!request || isLoading) return { status: "failed" };

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const result = await promptAsync();

      if (result.type === "cancel" || result.type === "dismiss")
        return { status: "failed" };

      if (result.type !== "success") {
        dispatch(setError("Login failed."));
        return { status: "failed" };
      }

      const body: AuthExchangeRequest = {
        code: result.params.code,
        codeVerifier: request?.codeVerifier ?? "",
        redirectUri,
        lang: locale,
      };

      const res = await apiClient.plain.post<OtpRequiredResponse>(
        ENDPOINTS.AUTH_EXCHANGE,
        body,
      );

      if (res.data?.otpRequired && res.data.txId)
        return { status: "otp", txId: res.data.txId };

      if (res.status === 423) {
        const lockoutMsg = firstErrorMessage(res.errors);
        dispatch(
          setError(lockoutMsg ?? "Too many attempts. Please try again later."),
        );
        return { status: "failed" };
      }

      dispatch(setError("Login failed."));
      return { status: "failed" };
    } catch {
      dispatch(setError("An error occurred during login."));
      return { status: "failed" };
    } finally {
      dispatch(setLoading(false));
    }
  }, [promptAsync, request, dispatch, isLoading, redirectUri]);

  // Verify the emailed OTP -> get the held tokens -> finalize the session.
  const verifyOtp = useCallback(
    async (
      txId: string,
      otp: string,
    ): Promise<"success" | "failed" | "locked"> => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const body: OtpVerifyRequest = { txId, otp };
        const { ok, status, data, errors } =
          await apiClient.plain.post<TokenResponse>(
            ENDPOINTS.AUTH_OTP_VERIFY,
            body,
          );

        if (!ok || !data) {
          if (status === 423) {
            dispatch(setError("Too many attempts. Please try again later."));
            return "locked";
          }
          const msg = firstErrorMessage(errors);
          dispatch(
            setError(
              msg?.toLowerCase().includes("expired")
                ? "Code expired."
                : "Incorrect code.",
            ),
          );
          return "failed";
        }

        await finalizeSession({
          ...data,
          refreshToken: data.refreshToken ?? "",
        });
        return "success";
      } catch {
        dispatch(setError("Verification failed."));
        return "failed";
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, finalizeSession],
  );

  // Request a fresh OTP code for an existing txId
  const resendOtp = useCallback(
    async (txId: string): Promise<string | null> => {
      try {
        dispatch(setError(null));
        const body: OtpResendRequest = { txId, lang: locale };
        const { ok, data } = await apiClient.plain.post<OtpRequiredResponse>(
          ENDPOINTS.AUTH_OTP_RESEND,
          body,
        );

        if (!ok || !data) {
          dispatch(setError("Could not resend the code"));
          return null;
        }
        return data.txId;
      } catch {
        dispatch(setError("Could not resend the code"));
        return null;
      }
    },
    [dispatch],
  );

  // Biometric login (used while logged out). Returns false if biometrics can't be
  // used so the caller can fall back to OIDC `login()`.
  const biometricLogin = useCallback(async (): Promise<
    "success" | "cancelled" | "fallback" | "invalidated"
  > => {
    const userId = await biometricService.getActiveUser();
    if (!userId || !(await biometricService.canUseBiometricLogin(userId)))
      return "fallback";

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      // 1. Server challenge (DBRS-signed; no Bearer token while logged out).
      const challengeRes = await apiClient.dbrs.post<ChallengeResponse>(
        ENDPOINTS.BIOMETRIC_CHALLENGE,
      );

      if (!challengeRes.ok || !challengeRes.data) return "fallback";
      const { challenge } = challengeRes.data;

      const signature = await biometricService.getAssertion(
        challenge,
        t("biometric.promptMessage"),
      );

      const refreshToken = await keycloakService.getRefreshToken();
      if (!refreshToken) return "fallback"; // nothing to refresh -> OIDC

      const body: BiometricRefreshRequest = {
        userId,
        challenge,
        signature,
        refreshToken,
      };
      const { ok, data } = await apiClient.dbrs.post<TokenResponse>(
        ENDPOINTS.BIOMETRIC_REFRESH,
        body,
      );
      if (!ok || !data) return "fallback";

      const tokens: AuthTokens = {
        ...data,
        refreshToken: data.refreshToken ?? refreshToken,
      };

      await keycloakService.saveTokens(tokens);
      dispatch(setTokens(tokens));

      const decoded = decodeToken(tokens.accessToken);
      if (decoded) dispatch(setUser(decoded));

      return "success";
    } catch (e) {
      if (__DEV__) console.log("Biometric login error:", e);

      if (biometricService.isUserCancel(e)) return "cancelled";

      if (biometricService.isKeyInvalidated(e)) {
        await biometricService.handleInvalidation(userId);
        return "invalidated";
      }

      return "fallback";
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, t]);

  // Settings: explicitly enable biometrics for the current user.
  const enableBiometric = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    try {
      await biometricEnrollment.enroll(user.id, t("biometric.promptMessage"));
      return true;
    } catch (e) {
      if (__DEV__) console.log("Enable biometric failed: ", e);
      dispatch(setError("Could not enable biometrics."));
      return false;
    }
  }, [user, dispatch, t]);

  // Settings: disable biometrics for the current user (revoke server-side + wipe key).
  const disableBiometric = useCallback(async (): Promise<void> => {
    if (!user) return;
    try {
      await apiClient.critical.post<StatusResponse>(ENDPOINTS.BIOMETRIC_REVOKE);
    } catch {
      // Proceed with local cleanup even if the server revoke call fails.
    }
    await biometricService.disable(user.id);
  }, [user]);

  // Sign out: clear TOKENS ONLY. The biometric key intentionally survives.
  const signOut = useCallback(async () => {
    if (!user) return;

    await notificationService.unregister(user.id).catch(() => {});
    await keycloakService.clearTokens(); // delete access + refresh
    dispatch(logout());
  }, [dispatch]);

  return {
    isAuthenticated,
    isLoading,
    user,
    error,
    request,
    login,
    verifyOtp,
    resendOtp,
    finalizeSession,
    biometricLogin,
    enableBiometric,
    disableBiometric,
    signOut,
  };
};
