import { router } from "expo-router";
import { useAuth } from "../../../src/hooks/useAuth";
import { pinService } from "../../../src/services/security/pinService";
import { useAppTheme } from "../../../src/hooks/useAppTheme";
import { useTranslation } from "../../../src/hooks/useTranslation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Typography } from "../../../src/constants/typography";
import { AppButton } from "../../../src/components/common/AppButton";
import { AppCodeInput } from "../../../src/components/form/AppCodeInput";
import { SECURITY } from "../../../src/constants/security";

const PIN_LENGTH = SECURITY.PIN.LENGTH;

export default function SetPinScreen() {
  const { user } = useAuth();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<"enter" | "confirm">("enter");
  const [firstPin, setFirstPin] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setStep("enter");
    setFirstPin("");
    setPin("");
  };

  const save = async (value: string) => {
    setBusy(true);
    setError(null);

    if (!user) return;

    try {
      await pinService.set(user.id, value);
      router.push("/(protected)/(onboarding)/biometric");
    } catch (e) {
      if (__DEV__) console.log("Set PIN failed: ", e);
      setError(t("errors.generic"));
      reset();
    } finally {
      setBusy(false);
    }
  };

  // Triggered by the button (no auto-submit on 6 digits)
  const onSubmit = () => {
    if (pin.length !== PIN_LENGTH) return;

    if (step === "enter") {
      setFirstPin(pin);
      setPin("");
      setError(null);
      setStep("confirm");
      return;
    }

    if (pin !== firstPin) {
      setError(t("onboarding.pinMismatch"));
      reset();
      return;
    }

    save(pin);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top + 48 },
      ]}
    >
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {step === "enter"
          ? t("onboarding.pinTitle")
          : t("onboarding.pinConfirmTitle")}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {step === "enter"
          ? t("onboarding.pinSubtitle")
          : t("onboarding.pinConfirmSubtitle")}
      </Text>

      <AppCodeInput
        value={pin}
        onChangeText={setPin}
        length={PIN_LENGTH}
        secure
      />

      {!!error && <Text style={{ color: colors.error }}>{error}</Text>}

      <AppButton
        label={step === "enter" ? t("common.next") : t("common.confirm")}
        variant="solid"
        loading={busy}
        disabled={pin.length !== PIN_LENGTH}
        onPress={onSubmit}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", gap: 4, padding: 16 },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    textAlign: "center",
    marginBottom: 32,
  },
  button: { marginTop: 32 },
});
