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

import { useCallback, useEffect, useRef, useState } from "react";
import { SECURITY } from "../constants/security";
import { TranslationKey, VerifyCurrentEmailOtpResult } from "../types";
import { useTranslation } from "./useTranslation";
import { useCooldown } from "./useCooldown";
import { currentEmailOtpService } from "../services/remitter/currentEmailOtpService";

const RESEND_COOLDOWN_SECONDS = SECURITY.OTP.RESEND_COOLDOWN_SECONDS;

// What the screen shows for each failed check
const VERIFY_ERROR_KEYS: Readonly<
  Record<
    Exclude<VerifyCurrentEmailOtpResult["status"], "success">,
    TranslationKey
  >
> = {
  incorrect: "otp.errors.incorrect",
  expired: "otp.errors.expired",
  locked: "otp.errors.locked",
};

/**
 * The email OTP that re-checks the remitter before a sensitive action:
 * sends a code when the screen opens, re-sends it (after a cooldown) and
 * verifies it. Errors come back translated, for under the code boxes.
 *
 * @returns The state (cooldown, sending, verifying, error) and the actions
 * @example const { verify, resend, cooldown, error } = useCurrentEmailOtp();
 */
export function useCurrentEmailOtp() {
  const { t, locale } = useTranslation();
  const [txId, setTxId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cooldown, startCooldown } = useCooldown();

  // The first code: sent once when the screen opens (not twice in dev,
  // where React mounts twice)
  const hasRequested = useRef(false);
  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    const request = async () => {
      setIsSending(true);
      const newTxId = await currentEmailOtpService.requestOtp();
      setIsSending(false);
      if (!newTxId) {
        setError(t("otp.errors.sendFailed"));
        return;
      }
      setTxId(newTxId);
      startCooldown(RESEND_COOLDOWN_SECONDS);
    };
    void request();
  }, [t, startCooldown]);

  /**
   * Sends a new code; before the first one arrived, tries the first again.
   *
   * @returns Whether it was sent (the screen then clears the boxes and
   *   shows "We've sent a new code")
   */
  const resend = useCallback(async (): Promise<boolean> => {
    if (isSending || cooldown > 0) return false;
    setIsSending(true);
    setError(null);

    const newTxId = txId
      ? await currentEmailOtpService.resendOtp(txId, locale)
      : await currentEmailOtpService.requestOtp();
    setIsSending(false);

    if (!newTxId) {
      setError(t("otp.errors.sendFailed"));
      return false;
    }
    setTxId(newTxId);
    startCooldown(RESEND_COOLDOWN_SECONDS);
    return true;
  }, [isSending, cooldown, txId, locale, t, startCooldown]);

  /**
   * Checks the typed code.
   *
   * @param otp - The 6 digits
   * @returns The result (with the challenge on success), or `null` when no
   *   code was sent yet
   */
  const verify = useCallback(
    async (otp: string): Promise<VerifyCurrentEmailOtpResult | null> => {
      if (!txId || isVerifying) return null;
      setIsVerifying(true);
      setError(null);

      const result = await currentEmailOtpService.verifyOtp(txId, otp);
      setIsVerifying(false);

      if (result.status !== "success") {
        setError(t(VERIFY_ERROR_KEYS[result.status]));
      }
      return result;
    },
    [txId, isVerifying, t],
  );

  // Typing again hides the last error
  const clearError = useCallback(() => setError(null), []);

  return {
    // Whether a code was sent (verify needs it)
    isReady: txId !== null,
    isSending,
    isVerifying,
    cooldown,
    error,
    resend,
    verify,
    clearError,
  };
}
