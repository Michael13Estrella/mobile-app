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

import { router } from "expo-router";
import { useTranslation } from "../../../../src/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "../../../../src/store";
import { showToastOnNextScreen } from "../../../../src/store/slices/uiSlice";
import { CurrentEmailOtpVerification } from "../../../../src/components/features/otp/CurrentEmailOtpVerification";
import { useState } from "react";
import { sendMoneyService } from "../../../../src/services/remittance/sendMoneyService";
import { buildSendMoneyRequest } from "../../../../src/utils/remittance/sendMoneyRequest";
import { markSendMoneySent } from "../../../../src/store/slices/sendMoneySlice";
import { ROUTES } from "../../../../src/constants/routes";

// Send Money's "Verification": after Review's Confirm, the email OTP that
// allows the send
export default function SendMoneyVerifyScreen() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { form, beneficiary, payout, companyDetails, confirmation } =
    useAppSelector((s) => s.sendMoney);
  const email = useAppSelector((s) => s.auth.user?.email);
  const [isSending, setIsSending] = useState(false);

  // Only reachable through Review's Confirm, after the draft is set
  if (!form || !beneficiary || !payout || !confirmation || !email) {
    return null;
  }

  // The code was right: send what Review showed
  const handleVerified = async (challenge: string) => {
    setIsSending(true);
    const result = await sendMoneyService.sendMoney(
      buildSendMoneyRequest({
        form,
        payout,
        companyDetails,
        confirmation,
        challenge,
        subject: email,
      }),
    );
    setIsSending(false);

    if (!result.ok) {
      // Back to Review, which says why; Confirm starts a new verification
      dispatch(
        showToastOnNextScreen({
          message: result.message ?? t("errors.generic"),
          variant: "error",
        }),
      );
      router.back();
      return;
    }

    // Sent: the result page, in place of this one (no way back to the OTP)
    dispatch(markSendMoneySent());
    router.replace(ROUTES.SEND_MONEY_FOR_PROCESSING);
  };

  // Too many wrong codes: back to Review, which says why
  const handleLocked = () => {
    dispatch(
      showToastOnNextScreen({
        message: t("otp.errors.locked"),
        variant: "error",
      }),
    );
    router.back();
  };

  return (
    <CurrentEmailOtpVerification
      email={email}
      onVerified={handleVerified}
      onLocked={handleLocked}
      isSubmitting={isSending}
    />
  );
}
