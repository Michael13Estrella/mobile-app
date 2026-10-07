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

import { StyleSheet, View } from "react-native";
import { SECURITY } from "../../../src/constants/security";
import { useRegistration } from "../../../src/hooks/useRegistration";
import { useAppTheme } from "../../../src/hooks/useAppTheme";
import { useTranslation } from "../../../src/hooks/useTranslation";
import { useState } from "react";
import { router } from "expo-router";
import { AppCodeInput } from "../../../src/components/form/AppCodeInput";
import { AppButton } from "../../../src/components/common/AppButton";
import { useCooldown } from "../../../src/hooks/useCooldown";
import { AppScreen } from "../../../src/components/common/AppScreen";
import { AppHeader } from "../../../src/components/common/AppHeader";
import { Spacing } from "../../../src/constants/spacing";
import { useAppSelector } from "../../../src/store";
import { maskEmail } from "../../../src/utils/maskEmail";
import { useForm, useWatch } from "react-hook-form";
import { AppTextButton } from "../../../src/components/common/AppTextButton";
import { formatCooldown } from "../../../src/utils/formatCooldown";
import { AppToast } from "../../../src/components/common/AppToast";
import { RegisterStepper } from "../../../src/components/features/register/RegisterStepper";
import { AppText } from "../../../src/components/common/AppText";
import Mail02 from "../../../assets/images/icons/mail-02.svg";

const OTP_LENGTH = SECURITY.OTP.LENGTH;
const RESEND_COOLDOWN_SECONDS = SECURITY.OTP.RESEND_COOLDOWN_SECONDS;

export default function VerifyEmailScreen() {
  const { verifyEmail, resendCheckEmail } = useRegistration();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const email = useAppSelector((s) => s.registration.email);

  const { control, setValue, setError, clearErrors } = useForm({
    defaultValues: { otp: "" },
  });
  const otp = useWatch({ control, name: "otp" }) ?? "";

  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [showResendToast, setShowResendToast] = useState(false);

  const { cooldown, startCooldown } = useCooldown(RESEND_COOLDOWN_SECONDS);

  const submit = async () => {
    if (otp.length !== OTP_LENGTH || verifying) return;
    setVerifying(true);

    try {
      const result = await verifyEmail(otp);
      if (!result.ok) {
        setError("otp", { message: result.message ?? t("errors.generic") });
        return;
      }
      router.replace("/(auth)/(register)/basic-info");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resending || cooldown > 0) return;
    setResending(true);

    try {
      const result = await resendCheckEmail();
      if (!result.ok) {
        setError("otp", { message: result.message ?? t("errors.generic") });
      }

      if (result.ok) {
        setShowResendToast(true);
      }

      setValue("otp", "");
      startCooldown(RESEND_COOLDOWN_SECONDS);
    } finally {
      setResending(false);
    }
  };

  return (
    <AppScreen
      gradient
      header={
        <>
          <AppHeader
            title={t("common.signUp")}
            onBack={() => {
              router.back();
            }}
          />
          <RegisterStepper currentStep={1} />
        </>
      }
      footer={
        <AppButton
          label={t("common.submit")}
          variant="gradient"
          loading={verifying}
          disabled={verifying || otp.length !== OTP_LENGTH}
          onPress={submit}
        />
      }
    >
      <View style={styles.imageContainer}>
        <Mail02 />
      </View>

      <View style={styles.titleContainer}>
        <AppText typographyType="h3" color={colors.textPrimary}>
          {t("verifyEmail.title")}
        </AppText>

        <AppText typographyType="body2" color={colors.textSecondary}>
          {t("verifyEmail.subtitle")}
          {"\n"}
          <AppText typographyType="body2">{maskEmail(email)}</AppText>
        </AppText>
      </View>

      <AppCodeInput
        control={control}
        name="otp"
        prefix="EM -"
        length={OTP_LENGTH}
        clearErrors={clearErrors}
      />

      {cooldown > 0 ? (
        <AppText
          typographyType="body3"
          weight="regular"
          color={colors.textSecondary}
        >
          {t("otp.resendIn")}
          {"  "}
          <AppText
            typographyType="button3"
            weight="bold"
            color={colors.textBrandPrimary}
          >
            {formatCooldown(cooldown)}
          </AppText>
        </AppText>
      ) : (
        <AppTextButton
          label={t("otp.resend")}
          loading={resending}
          disabled={resending}
          align="left"
          onPress={handleResend}
        />
      )}

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
  imageContainer: {
    alignItems: "center",
  },
  titleContainer: {
    gap: Spacing.s3,
  },
  spacer: { flex: 1 },
});
