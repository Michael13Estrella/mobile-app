/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-07-10
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useAppTheme } from "../../../src/hooks/useAppTheme";
import { useAuth } from "../../../src/hooks/useAuth";
import { useTranslation } from "../../../src/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "../../../src/store";
import { FC, useEffect, useState } from "react";
import { setNeedsPasscodeSetup } from "../../../src/store/slices/uiSlice";
import { router } from "expo-router";
import { biometricService } from "../../../src/services/security/biometricService";
import { StyleSheet, View } from "react-native";
import { AppButton } from "../../../src/components/common/AppButton";
import { BiometryType } from "react-native-biometrics";
import { SvgProps } from "react-native-svg";
import FaceIdIcon from "../../../assets/images/icons/face-id.svg";
import FingerprintIcon from "../../../assets/images/icons/fingerprint.svg";
import { Spacing } from "../../../src/constants/spacing";
import { AppScreen } from "../../../src/components/common/AppScreen";
import { AppText } from "../../../src/components/common/AppText";
import { AppTextButton } from "../../../src/components/common/AppTextButton";

const ICON_SIZE = 72;

// Face ID only on iPhones that report it. Android reports a generic
// "Biometrics" (face or fingerprint unknown): fingerprint is the most common.
const iconForBiometry = (type?: BiometryType): FC<SvgProps> =>
  type === "FaceID" ? FaceIdIcon : FingerprintIcon;

export default function EnableBiometricScreen() {
  const { enableBiometric, user } = useAuth();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // Sign-up data is still in the memory only right after a new registration
  const hasJustRegistered = useAppSelector((s) => !!s.registration.email);

  // Unknown until checked: render nothing, to avoid a flash before skipping
  const [biometryType, setBiometryType] = useState<BiometryType | null>(null);
  const [busy, setBusy] = useState(false);

  const finish = () => {
    dispatch(setNeedsPasscodeSetup(false));
    if (user) void biometricService.clearReprompt(user.id);
    router.replace(
      hasJustRegistered
        ? "/(protected)/(onboarding)/submitted"
        : "/(protected)/(tabs)/home",
    );
  };

  // Device has no biometrics -> skip this screen entirely
  useEffect(() => {
    const checkAvailability = async () => {
      const { available, biometryType: type } =
        await biometricService.isAvailable();
      if (available && type) setBiometryType(type);
      else finish();
    };
    void checkAvailability();
  }, []);

  const handleEnable = async () => {
    setBusy(true);
    try {
      await enableBiometric(); //enrolls; a cancel/failure is non-fatal
    } finally {
      setBusy(false);
      finish();
    }
  };

  if (!biometryType) return null;

  const BiometryIcon = iconForBiometry(biometryType);

  return (
    <AppScreen
      gradient
      footer={
        <View style={styles.actions}>
          <AppButton
            label={t("onboarding.enableBiometrics.enable")}
            variant="gradient"
            loading={busy}
            disabled={busy}
            onPress={handleEnable}
          />
          <AppTextButton
            label={t("onboarding.enableBiometrics.skip")}
            size="button1"
            align="center"
            loading={busy}
            disabled={busy}
            onPress={finish}
          />
        </View>
      }
    >
      <View style={styles.body}>
        <BiometryIcon width={ICON_SIZE} height={ICON_SIZE} />
        <AppText
          typographyType="h3"
          color={colors.textPrimary}
          style={styles.centered}
        >
          {t("onboarding.enableBiometrics.title")}
        </AppText>
        <AppText
          typographyType="body2"
          color={colors.textSecondary}
          style={styles.centered}
        >
          {t("onboarding.enableBiometrics.subtitle")}
        </AppText>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.s4,
  },
  centered: { textAlign: "center" },
  actions: { gap: Spacing.s6 },
});
