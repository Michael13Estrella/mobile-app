/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-07
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { BiometryType } from "react-native-biometrics";
import { Spacing } from "../../../constants/spacing";
import { IconName } from "../../../types";
import { QuickUnlockMethod } from "../../../hooks/useUnlockFlow";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useTranslation } from "../../../hooks/useTranslation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppScreen } from "../../common/AppScreen";
import { StyleSheet, View } from "react-native";
import { AppText } from "../../common/AppText";
import { APP } from "../../../constants/app";
import { ExchangeRateCard } from "../../common/ExchangeRateCard";
import { GradientText } from "../../common/GradientText";
import { AppButton } from "../../common/AppButton";
import { AppTextButton } from "../../common/AppTextButton";
import { resolveShadows } from "../../../theme/shadows";

const SHEET_RADIUS = Spacing.s9;

const biometricIcon = (type: BiometryType | null): IconName =>
  type === "FaceID" ? "face-recognition" : "fingerprint";

type LockWelcomeScreenProps = Readonly<{
  method: QuickUnlockMethod;
  biometryType: BiometryType | null;
  busy: boolean;
  onBiometricLogin: () => void;
  onPasscodeLogin: () => void;
  onLoginWithPassword: () => void;
  onForgotPassword: () => void;
}>;

// First view of the lock screen: rates, greeting and the ways to unlock
export function LockWelcomeScreen({
  method,
  biometryType,
  busy,
  onBiometricLogin,
  onPasscodeLogin,
  onLoginWithPassword,
  onForgotPassword,
}: LockWelcomeScreenProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const shadows = resolveShadows(colors);

  // TODO (getRemitter): use "lockScreen.greetingWithName" once the remitter's name is available.
  const greeting = t("lockScreen.greeting", { name: "Mike" });

  const isBiometric = method === "biometric";

  return (
    <AppScreen gradient contentContainerStyle={styles.content}>
      <View style={styles.top}>
        <View style={styles.logoContainer}>
          <AppText typographyType="h1" color={colors.textBrandPrimary}>
            {APP.NAME}
          </AppText>
          <AppText typographyType="body2" color={colors.textSecondary}>
            {t("common.version", { version: APP.VERSION })}
          </AppText>
        </View>

        <ExchangeRateCard />
      </View>

      {/* Edge-to-edge sheet: AppScreen's bottom padding is off, so it adds the safe area itself */}
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.surface,
            paddingBottom: insets.bottom + Spacing.s7,
            boxShadow: shadows.tinted02Top,
          },
        ]}
      >
        <GradientText typographyType="h3" style={styles.greeting}>
          {greeting}
        </GradientText>

        <AppButton
          label={
            isBiometric
              ? t("lockScreen.loginWithBiometrics")
              : t("lockScreen.loginWithPasscode")
          }
          icon={isBiometric ? biometricIcon(biometryType) : undefined}
          variant="gradient"
          loading={busy}
          disabled={busy}
          onPress={isBiometric ? onBiometricLogin : onPasscodeLogin}
        />

        <AppButton
          label={t("lockScreen.loginWithPassword")}
          variant="gradientOutline"
          disabled={busy}
          onPress={onLoginWithPassword}
        />

        <AppTextButton
          label={t("lockScreen.forgotPassword")}
          size="button2"
          align="center"
          disabled={busy}
          onPress={onForgotPassword}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  // Overrides AppScreen's padding so the sheet reaches the the edges and bottom
  // (the top keeps AppScreen's safe-area padding)
  content: {
    paddingHorizontal: Spacing.s0,
    paddingBottom: Spacing.s0,
    gap: Spacing.s0,
  },
  top: {
    flex: 1,
    paddingHorizontal: Spacing.s7,
    paddingBottom: Spacing.s7,
    gap: Spacing.s7,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.s3,
  },
  sheet: {
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    paddingTop: Spacing.s9,
    paddingHorizontal: Spacing.s7,
    paddingBottom: Spacing.s5,
    gap: Spacing.s5,
  },
  greeting: {
    textAlign: "center",
    paddingBottom: Spacing.s4,
  },
});
