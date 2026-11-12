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

import { useForm, useWatch } from "react-hook-form";
import { SECURITY } from "../../../constants/security";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useCurrentEmailOtp } from "../../../hooks/useCurrentEmailOtp";
import { useTranslation } from "../../../hooks/useTranslation";
import { useAppDispatch } from "../../../store";
import { useEffect } from "react";
import { showToast } from "../../../store/slices/uiSlice";
import { AppScreen } from "../../common/AppScreen";
import { AppHeader } from "../../common/AppHeader";
import { router } from "expo-router";
import { AppButton } from "../../common/AppButton";
import { StyleSheet, View } from "react-native";
import { Spacing } from "../../../constants/spacing";
import { AppText } from "../../common/AppText";
import { maskEmail } from "../../../utils/format/maskEmail";
import { AppCodeInput } from "../../form/AppCodeInput";
import { OtpResendRow } from "./OtpResendRow";

const OTP_LENGTH = SECURITY.OTP.LENGTH;
const EMAIL_PREFIX = SECURITY.OTP.EMAIL_PREFIX;

type CurrentEmailOtpVerificationProps = Readonly<{
  // The remitter's current email (shown masked)
  email: string;
  // The code was right: the challenge for the action
  onVerified: (challenge: string) => void;
  // Too many wrong codes: the screen should be left
  onLocked: () => void;
  // While the action after the check runs (e.g. Send Money's send)
  isSubmitting?: boolean;
}>;

/**
 * "Verification": the email OTP that re-checks the remitter before a
 * sensitive action. A code is sent when it opens.
 *
 * @example <CurrentEmailOtpVerification email={email} onVerified={send} onLocked={leave} />
 */
export function CurrentEmailOtpVerification({
  email,
  onVerified,
  onLocked,
  isSubmitting = false,
}: CurrentEmailOtpVerificationProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    isReady,
    isSending,
    isVerifying,
    cooldown,
    error,
    resend,
    verify,
    clearError,
  } = useCurrentEmailOtp();

  const { control, setValue, setError, clearErrors } = useForm({
    defaultValues: { otp: "" },
  });
  const otp = useWatch({ control, name: "otp" }) ?? "";
  const isComplete = otp.length === OTP_LENGTH;
  const isBusy = isVerifying || isSubmitting;

  // The hook's error goes under the boxes (typing clears it); cleared in the
  // hook, so the same error shows again next time
  useEffect(() => {
    if (!error) return;
    setError("otp", { message: error });
    clearError();
  }, [error, setError, clearError]);

  const handleVerify = async () => {
    if (!isComplete || isBusy) return;
    const result = await verify(otp);
    if (!result) return;

    if (result.status === "success") {
      onVerified(result.challenge);
      return;
    }
    if (result.status === "locked") {
      onLocked();
      return;
    }
    // Wrong or expired: empty boxes for another try
    setValue("otp", "");
  };

  const handleResend = async () => {
    const isSent = await resend();
    if (!isSent) return;
    setValue("otp", "");
    clearErrors("otp");
    dispatch(
      showToast({ message: t("otp.resendSuccessMsg"), variant: "success" }),
    );
  };

  return (
    <AppScreen
      gradient
      header={
        <AppHeader title={t("otp.headerTitle")} onBack={() => router.back()} />
      }
      footer={
        <AppButton
          label={t("otp.verify")}
          variant="gradient"
          loading={isBusy}
          disabled={!isReady || !isComplete || isBusy}
          onPress={handleVerify}
        />
      }
    >
      <View style={styles.titles}>
        <AppText typographyType="h3" color={colors.textPrimary}>
          {t("otp.title")}
        </AppText>
        <AppText typographyType="body2" color={colors.textSecondary}>
          {t("otp.sentTo")}
          {"\n"}
          <AppText typographyType="body2" weight="bold">
            {maskEmail(email)}
          </AppText>
        </AppText>
      </View>

      <AppCodeInput
        control={control}
        name="otp"
        prefix={EMAIL_PREFIX}
        length={OTP_LENGTH}
        clearErrors={clearErrors}
      />

      <OtpResendRow
        cooldown={cooldown}
        resending={isSending}
        disabled={isBusy}
        onResend={handleResend}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  titles: {
    gap: Spacing.s3,
  },
});
