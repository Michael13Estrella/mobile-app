import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../../../src/hooks/useAppTheme";
import { useAuth } from "../../../src/hooks/useAuth";
import { useTranslation } from "../../../src/hooks/useTranslation";
import { useAppDispatch } from "../../../src/store";
import { useEffect, useState } from "react";
import { setNeedsPinSetup } from "../../../src/store/slices/uiSlice";
import { router } from "expo-router";
import { biometricService } from "../../../src/services/security/biometricService";
import { StyleSheet, View, Text } from "react-native";
import { Typography } from "../../../src/constants/typography";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppButton } from "../../../src/components/common/AppButton";

export default function EnableBiometricScreen() {
  const { enableBiometric, user } = useAuth();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const [ready, setReady] = useState(false); // avoid a flash before availability check
  const [busy, setBusy] = useState(false);

  const finish = () => {
    dispatch(setNeedsPinSetup(false));
    if (user) biometricService.clearReprompt(user.id);
    router.replace("/(protected)/(tabs)/home");
  };

  // Device has no biometrics -> skip this screen entirely
  useEffect(() => {
    (async () => {
      const { available } = await biometricService.isAvailable();
      if (available) setReady(true);
      else finish();
    })();
  }, []);

  const onEnable = async () => {
    setBusy(true);
    try {
      await enableBiometric(); //enrolls; a cancel/failure is non-fatal
    } finally {
      setBusy(false);
      finish();
    }
  };

  const onSkip = async () => {
    finish();
  };

  if (!ready) return null;

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
          name="fingerprint"
          size={72}
          color={colors.iconPrimary}
        />
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t("onboarding.biometricTitle")}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t("onboarding.biometricSubtitle")}
        </Text>
      </View>

      <View style={styles.actions}>
        <AppButton
          label={t("onboarding.biometricEnable")}
          variant="solid"
          loading={busy}
          onPress={onEnable}
        />
        <AppButton
          label={t("onboarding.biometricSkip")}
          variant="ghost"
          disabled={busy}
          onPress={onSkip}
        />
      </View>
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
  actions: { gap: 8 },
});
