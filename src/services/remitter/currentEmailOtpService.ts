/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-11
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ENDPOINTS } from "../../constants/endpoints";
import { HTTP_STATUS } from "../../constants/http";
import { SECURITY } from "../../constants/security";
import {
  CurrentEmailOtpRequest,
  Language,
  OtpRequiredResponse,
  ResendCurrentEmailOtpRequest,
  VerifyCurrentEmailOtpRequest,
  VerifyCurrentEmailOtpResponse,
  VerifyCurrentEmailOtpResult,
} from "../../types";
import { firstErrorMessage } from "../../utils/api/apiErrors";
import { apiClient } from "../api/apiClient";
import { remitterService } from "./remitterService";

// How the server's message says the code is too old (as the login OTP)
const EXPIRED_KEYWORD = "expired";

/**
 * The email OTP that re-checks the logged-in remitter before a sensitive
 * action (Send Money): send a code, resend it, verify it.
 */
export const currentEmailOtpService = {
  /**
   * Emails a code to the remitter's current email.
   *
   * @returns The attempt's txId, or `null` when it couldn't be sent
   */
  requestOtp: async (): Promise<string | null> => {
    try {
      const remitterGuid = await remitterService.getCurrentRemitterGuid();
      if (!remitterGuid) return null;

      const body: CurrentEmailOtpRequest = {
        sendToSms: SECURITY.OTP.SEND_TO_SMS,
      };
      const { ok, data } = await apiClient.critical.post<OtpRequiredResponse>(
        ENDPOINTS.REMITTER_OTP_CURRENT_EMAIL(remitterGuid),
        body,
      );
      return ok && data ? data.txId : null;
    } catch {
      // getCurrentRemitterGuid throws when the guid can't be fetched
      return null;
    }
  },

  /**
   * Emails a new code for the same attempt.
   *
   * @param txId - The current attempt
   * @param lang - The app's language, for the email
   * @returns The new txId, or `null` when it couldn't be sent
   */
  resendOtp: async (txId: string, lang: Language): Promise<string | null> => {
    try {
      const remitterGuid = await remitterService.getCurrentRemitterGuid();
      if (!remitterGuid) return null;

      const body: ResendCurrentEmailOtpRequest = {
        txId,
        lang,
        sendToSms: SECURITY.OTP.SEND_TO_SMS,
      };
      const { ok, data } = await apiClient.critical.post<OtpRequiredResponse>(
        ENDPOINTS.REMITTER_RESEND_OTP_CURRENT_EMAIL(remitterGuid),
        body,
      );
      return ok && data ? data.txId : null;
    } catch {
      return null;
    }
  },

  /**
   * Checks the typed code.
   *
   * @param txId - The current attempt
   * @param otp - The 6 digits
   * @returns The challenge for the action, or why it failed
   * @example const result = await currentEmailOtpService.verifyOtp(txId, "123456");
   */
  verifyOtp: async (
    txId: string,
    otp: string,
  ): Promise<VerifyCurrentEmailOtpResult> => {
    try {
      const remitterGuid = await remitterService.getCurrentRemitterGuid();
      if (!remitterGuid) return { status: "incorrect" };

      const body: VerifyCurrentEmailOtpRequest = { txId, otp };
      const { ok, status, data, errors } =
        await apiClient.critical.post<VerifyCurrentEmailOtpResponse>(
          ENDPOINTS.REMITTER_VERIFY_OTP_CURRENT_EMAIL(remitterGuid),
          body,
        );

      if (ok && data) return { status: "success", challenge: data.challenge };
      if (status === HTTP_STATUS.LOCKED) return { status: "locked" };

      const message = firstErrorMessage(errors)?.toLowerCase();
      return message?.includes(EXPIRED_KEYWORD)
        ? { status: "expired" }
        : { status: "incorrect" };
    } catch {
      return { status: "incorrect" };
    }
  },
};
