import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "../../../src/components/common/AppButton";
import { useAppTheme } from "../../../src/hooks/useAppTheme";
import { useTranslation } from "../../../src/hooks/useTranslation";
import { useAuth } from "../../../src/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "../../../src/store";
import { clearRegistration } from "../../../src/store/slices/registrationSlice";
import { Typography } from "../../../src/constants/typography";

export default function RegisterSubmittedScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { finalizeSession } = useAuth();

  const tokens = useAppSelector((s) => s.registration.tokens);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goHome = async () => {
    if (!tokens) return;
    setBusy(true);
    setError(null);
    try {
      // Enrolls the device + sets needsPinSetup; throws if enrollment fails.
      await finalizeSession(tokens);
      dispatch(clearRegistration()); // wipe password + tokens from memory
      // No manual navigation — needsPinSetup=true → _layout → onboarding → home
    } catch (e) {
      if (__DEV__) console.log("Registration finalize failed:", e);
      setError(t("errors.generic"));
      setBusy(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 64,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <View style={styles.body}>
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={80}
          color={colors.primary}
        />
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t("register.submittedTitle")}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t("register.submittedSubtitle")}
        </Text>
        {!!error && <Text style={{ color: colors.error }}>{error}</Text>}
      </View>

      <AppButton
        label={t("register.goHome")}
        variant="gradient"
        loading={busy}
        disabled={busy || !tokens}
        onPress={goHome}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
    textAlign: "center",
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    textAlign: "center",
    lineHeight: 22,
  },
});
