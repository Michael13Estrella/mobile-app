import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../src/hooks/useAuth";
import { useAppTheme } from "../../src/hooks/useAppTheme";
import { useTranslation } from "../../src/hooks/useTranslation";
import { AppButton } from "../../src/components/common/AppButton";
import { AppCodeInput } from "../../src/components/form/AppCodeInput";
import { Typography } from "../../src/constants/typography";
import { AppLogo } from "../../src/components/common/AppLogo";
import { useAppDispatch } from "../../src/store";
import { setAuthenticating } from "../../src/store/slices/uiSlice";
import { SECURITY } from "../../src/constants/security";
import { useCooldown } from "../../src/hooks/useCooldown";
import { useForm, useWatch } from "react-hook-form";

const OTP_LENGTH = SECURITY.OTP.LENGTH;
const RESEND_COOLDOWN_SECONDS: number = SECURITY.OTP.RESEND_COOLDOWN_SECONDS;

export default function OtpScreen() {
  const { txId: initialTxId } = useLocalSearchParams<{ txId: string }>();
  const { verifyOtp, resendOtp, error } = useAuth();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const [txId, setTxId] = useState(initialTxId);
  const { control, setValue } = useForm({ defaultValues: { otp: "" } });
  const otp = useWatch({ control, name: "otp" }) ?? "";

  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const { cooldown, startCooldown } = useCooldown();

  const submit = async () => {
    if (!txId || otp.length !== OTP_LENGTH || verifying) return;
    setVerifying(true);
    try {
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
      if (__DEV__) {
        console.log(`Resend OTP: OLD=${txId} NEW=${newTxId}`);
      }
      if (newTxId) {
        setTxId(newTxId);
        setValue("otp", "");
        startCooldown(RESEND_COOLDOWN_SECONDS);
      }
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    dispatch(setAuthenticating(false));
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundVariant,
          paddingTop: insets.top + 24,
        },
      ]}
    >
      {/* <Image source={logo} style={styles.logo} resizeMode="contain" /> */}
      <AppLogo style={styles.logo} />

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {t("otp.title")}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {t("otp.subtitle")}
      </Text>

      <AppCodeInput control={control} name="otp" length={OTP_LENGTH} />

      {!!error && <Text style={{ color: colors.error }}>{error}</Text>}

      <AppButton
        label={t("otp.verify")}
        variant="solid"
        loading={verifying}
        disabled={verifying || otp.length !== OTP_LENGTH}
        onPress={submit}
        style={styles.verify}
      />

      <AppButton
        label={
          cooldown > 0
            ? t("otp.resendIn", { seconds: cooldown })
            : t("otp.resend")
        }
        variant="ghost"
        loading={resending}
        disabled={resending || cooldown > 0 || verifying}
        onPress={handleResend}
      />

      <AppButton
        label={t("common.cancel")}
        variant="ghost"
        disabled={verifying}
        onPress={() => router.push("/welcome")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, gap: 8 },
  logo: { width: 200, height: 40, marginBottom: 16 },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
  },
  subtitle: { fontSize: Typography.sizes.md, marginBottom: 16 },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    fontSize: 24,
    letterSpacing: 8,
    textAlign: "center",
    width: 220,
    paddingVertical: 12,
  },
  verify: { marginTop: 16 },
});
