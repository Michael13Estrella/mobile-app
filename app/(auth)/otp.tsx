/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-25
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../src/hooks/useAuth";
import { useAppTheme } from "../../src/hooks/useAppTheme";
import { useTranslation } from "../../src/hooks/useTranslation";
import { AppButton } from "../../src/components/common/AppButton";
import { AppCodeInput } from "../../src/components/form/AppCodeInput";
import { useAppDispatch } from "../../src/store";
import { setAuthenticating } from "../../src/store/slices/uiSlice";
import { SECURITY } from "../../src/constants/security";
import { useCooldown } from "../../src/hooks/useCooldown";
import { useForm, useWatch } from "react-hook-form";
import { clearError } from "../../src/store/slices/authSlice";
import { Spacing } from "../../src/constants/spacing";
import { AppScreen } from "../../src/components/common/AppScreen";
import { AppHeader } from "../../src/components/common/AppHeader";
import Mail02 from "../../assets/images/icons/mail-02.svg";
import { AppText } from "../../src/components/common/AppText";
import { OtpResendRow } from "../../src/components/features/otp/OtpResendRow";
import { AppToast } from "../../src/components/common/AppToast";

const OTP_LENGTH = SECURITY.OTP.LENGTH;
const RESEND_COOLDOWN_SECONDS: number = SECURITY.OTP.RESEND_COOLDOWN_SECONDS;
const EMAIL_PREFIX = SECURITY.OTP.EMAIL_PREFIX;

// Login step 2: the server emailed a code (txId identifies the attempt)
export default function OtpScreen() {
  const { txId: initialTxId } = useLocalSearchParams<{ txId: string }>();
  const { verifyOtp, resendOtp, error } = useAuth();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [txId, setTxId] = useState(initialTxId);
  const { control, setValue, setError, clearErrors } = useForm({
    defaultValues: { otp: "" },
  });
  const otp = useWatch({ control, name: "otp" }) ?? "";

  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [showResendToast, setShowResendToast] = useState(false);
  // The login just sent the first code, so resending starts on cooldown
  const { cooldown, startCooldown } = useCooldown(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    dispatch(setAuthenticating(false));
    dispatch(clearError()); // don't show an error left over from the login
  }, [dispatch]);

  // useAuth reports wrong/expired codes and resend failures; show them under
  // the boxes (typing clears it)
  useEffect(() => {
    if (error) setError("otp", { message: error });
  }, [error, setError]);

  const handleSubmit = async () => {
    if (!txId || otp.length !== OTP_LENGTH || verifying) return;
    setVerifying(true);
    try {
      // Success: the root layout leaves (auth) once the session exists.
      const result = await verifyOtp(txId, otp);
      if (result === "locked") {
        router.replace("/(auth)/welcome");
        return;
      }
      if (result === "failed") setValue("otp", ""); // wrong/expired -> clear for retry
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!txId || resending || cooldown > 0) return;
    setResending(true);
    try {
      const newTxId = await resendOtp(txId);
      if (!newTxId) return; // the message arrives through `error`
      setTxId(newTxId);
      setValue("otp", "");
      setShowResendToast(true);
      startCooldown(RESEND_COOLDOWN_SECONDS);
    } finally {
      setResending(false);
    }
  };

  return (
    <AppScreen
      gradient
      header={
        <AppHeader
          title={t("otp.headerTitle")}
          onBack={() => {
            router.dismissTo("(auth)/welcome");
          }}
        />
      }
      footer={
        <AppButton
          label={t("common.next")}
          variant="gradient"
          loading={verifying}
          disabled={verifying || otp.length !== OTP_LENGTH}
          onPress={handleSubmit}
        />
      }
    >
      <View style={styles.iconContainer}>
        <Mail02 />
      </View>

      <View style={styles.titleContainer}>
        <AppText typographyType="h3" color={colors.textPrimary}>
          {t("otp.title")}
        </AppText>
        <AppText typographyType="body2" color={colors.textSecondary}>
          {t("otp.subtitle.before")}{" "}
          <AppText typographyType="body2" weight="bold">
            {t("otp.subtitle.emphasis")}
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
        resending={resending}
        disabled={verifying}
        onResend={handleResend}
      />

      <View style={styles.spacer} />

      <AppToast
        message={t("otp.resendSuccessMsg")}
        variant="success"
        visible={showResendToast}
        onDismiss={() => setShowResendToast(false)}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
  },
  titleContainer: {
    gap: Spacing.s3,
  },
  spacer: { flex: 1 },
});
