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

import { router } from "expo-router";
import { useAuth } from "../../../src/hooks/useAuth";
import { passcodeService } from "../../../src/services/security/passcodeService";
import { useAppTheme } from "../../../src/hooks/useAppTheme";
import { useTranslation } from "../../../src/hooks/useTranslation";
import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { AppButton } from "../../../src/components/common/AppButton";
import { AppCodeInput } from "../../../src/components/form/AppCodeInput";
import { SECURITY } from "../../../src/constants/security";
import { useForm, useWatch } from "react-hook-form";
import { Spacing } from "../../../src/constants/spacing";
import { AppScreen } from "../../../src/components/common/AppScreen";
import { AppHeader } from "../../../src/components/common/AppHeader";
import PasscodeLockIcon from "../../../assets/images/icons/passcode-lock.svg";
import { AppText } from "../../../src/components/common/AppText";

const PASSCODE_LENGTH = SECURITY.PASSCODE.LENGTH;
const ICON_SIZE = 72;

export default function SetPasscodeScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { user } = useAuth();

  const { control } = useForm({ defaultValues: { passcode: "" } });
  const passcode = useWatch({ control, name: "passcode" });
  const isComplete = passcode.length === PASSCODE_LENGTH;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async () => {
    if (!user || !isComplete) return;

    setSaving(true);
    setError(null);

    try {
      await passcodeService.set(user.id, passcode);
      // Saved: the user can't come back to this screen with Back
      router.replace("/(protected)/(onboarding)/biometric");
    } catch {
      setError(t("errors.generic"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppScreen
      gradient
      header={
        <AppHeader
          title={t("onboarding.setPasscode.headerTitle")}
          onBack={() => router.back()}
        />
      }
      footer={
        <AppButton
          label={t("common.next")}
          variant="gradient"
          loading={saving}
          disabled={!isComplete || saving}
          onPress={handleNext}
        />
      }
    >
      <View style={styles.iconWrapper}>
        <PasscodeLockIcon width={ICON_SIZE} height={ICON_SIZE} />
      </View>

      <View style={styles.texts}>
        <AppText typographyType="h4" weight="bold" color={colors.textPrimary}>
          {t("onboarding.setPasscode.title", { length: PASSCODE_LENGTH })}
        </AppText>
        <AppText typographyType="body2" color={colors.textSecondary}>
          {t("onboarding.setPasscode.subtitle")}
        </AppText>
      </View>

      <AppCodeInput
        control={control}
        name="passcode"
        length={PASSCODE_LENGTH}
      />

      {!!error && <Text style={{ color: colors.error }}>{error}</Text>}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
  },
  texts: {
    gap: Spacing.s3,
  },
});
