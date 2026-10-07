/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-08-27
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  AuthTokens,
  CheckEmailRequest,
  CheckEmailResendRequest,
  OtpRequiredResponse,
  RegisterRequest,
  TokenResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "../types";
import { apiClient } from "../services/api/apiClient";
import { ENDPOINTS } from "../constants/endpoints";
import {
  setChallenge,
  setRegistrationTokens,
  setTxId,
} from "../store/slices/registrationSlice";
import { firstErrorMessage } from "../utils/apiErrors";
import { trimFields, uppercaseFields } from "../utils/formatFields";

type Result = { ok: boolean; message?: string };
// A successful registration return the new session's tokens for sign-in.
type SubmitResult = Result & { tokens?: AuthTokens };

export function useRegistration() {
  const dispatch = useAppDispatch();
  const { email, password, txId, challenge, details } = useAppSelector(
    (s) => s.registration,
  );
  const locale = useAppSelector((s) => s.ui.locale);

  const checkEmail = useCallback(
    async (emailToVerify: string): Promise<Result> => {
      const body: CheckEmailRequest = { email: emailToVerify, lang: locale };
      const { ok, data, errors } =
        await apiClient.plain.post<OtpRequiredResponse>(
          ENDPOINTS.REGISTER_CHECK_EMAIL,
          body,
        );

      if (!ok || !data?.txId) {
        const msg = firstErrorMessage(errors);
        return { ok: false, message: msg ?? "Could not verify the email." };
      }

      dispatch(setTxId(data.txId));
      return { ok: true };
    },
    [dispatch, locale],
  );

  const resendCheckEmail = useCallback(async (): Promise<Result> => {
    if (!txId) return { ok: false, message: "Missing verification session." };

    const body: CheckEmailResendRequest = {
      txId,
      lang: locale,
    };

    const { ok, data, errors } =
      await apiClient.plain.post<OtpRequiredResponse>(
        ENDPOINTS.REGISTER_CHECK_EMAIL_RESEND,
        body,
      );

    if (!ok || !data?.txId) {
      const msg = firstErrorMessage(errors);
      return { ok: false, message: msg ?? "Could not resend the code." };
    }

    dispatch(setTxId(data.txId));
    return { ok: true };
  }, [dispatch, txId, locale]);

  const verifyEmail = useCallback(
    async (otp: string): Promise<Result> => {
      if (!txId) return { ok: false, message: "Missing verification session." };

      const body: VerifyEmailRequest = { txId, otp };
      const { ok, status, data, errors } =
        await apiClient.plain.post<VerifyEmailResponse>(
          ENDPOINTS.REGISTER_VERIFY_EMAIL,
          body,
        );

      if (!ok || !data?.challenge) {
        if (status === 423) {
          return {
            ok: false,
            message: "Too many attempts. Please try again later",
          };
        }

        const msg = firstErrorMessage(errors);
        return {
          ok: false,
          message: msg?.toLowerCase().includes("expired")
            ? "Code expired."
            : "The email OTP you entered is incorrect. Please try again. Please try again.",
        };
      }
      dispatch(setChallenge(data.challenge));
      return { ok: true };
    },
    [dispatch, txId],
  );

  const UPPERCASE_FIELDS: (keyof RegisterRequest)[] = [
    "firstName",
    "middleName",
    "lastName",
    "nickName",
    "prefecture",
    "addressLine1",
    "addressLine2",
    "addressLine3",
    "companyName",
    "nationality",
    "professionOthers",
    "visaStatusOthers",
    "schoolName",
    "natureOfBusiness",
    "primaryIDNo",
  ];

  const submitRegister = useCallback(async (): Promise<SubmitResult> => {
    if (!challenge) return { ok: false, message: "Email not verified." };

    let body: RegisterRequest = { challenge, email, password, ...details };
    body = trimFields(body, ["challenge"]);
    body = uppercaseFields(body, UPPERCASE_FIELDS);

    if (__DEV__) console.log("remitterBody: ", body);

    const { ok, data, errors } = await apiClient.plain.post<TokenResponse>(
      ENDPOINTS.REGISTER_SUBMIT,
      body,
    );

    if (!ok || !data) {
      console.log(errors);
      const msg = firstErrorMessage(errors);
      return { ok: false, message: msg ?? "Registration failed." };
    }

    const tokens = { ...data, refreshToken: data.refreshToken ?? "" };
    dispatch(setRegistrationTokens(tokens));

    return { ok: true, tokens };
  }, [dispatch, challenge, email, password, details]);

  return { checkEmail, resendCheckEmail, verifyEmail, submitRegister };
}
