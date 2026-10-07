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

import { useForm, useWatch } from "react-hook-form";
import { SECURITY } from "../../../constants/security";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useTranslation } from "../../../hooks/useTranslation";
import { AppScreen } from "../../common/AppScreen";
import { useEffect } from "react";
import { AppHeader } from "../../common/AppHeader";
import { AppButton } from "../../common/AppButton";
import { StyleSheet, View } from "react-native";
import { Spacing } from "../../../constants/spacing";
import PasscodeLockIcon from "../../../../assets/images/icons/passcode-lock.svg";
import { router } from "expo-router";
import { AppText } from "../../common/AppText";
import { AppCodeInput } from "../../form/AppCodeInput";
import { AppTextButton } from "../../common/AppTextButton";

const PASSCODE_LENGTH = SECURITY.PASSCODE.LENGTH;
const ICON_SIZE = 72;

type PasscodeUnlockViewProps = Readonly<{
  busy: boolean;
  // message for a wrong passcode (e.g. "... 3 attempts left"), from useUnlockFlow
  error: string | null;
  onSubmit: (passcode: string) => void;
  onLoginWithPassword: () => void;
  // Back to the lock screen's welcome view (not a route: the lock is an overlay)
  onBack: () => void;
}>;

// "Verification" step of the lock screen: enter the 6-digit passcode
export function PasscodeUnlockScreen({
  busy,
  error,
  onSubmit,
  onLoginWithPassword,
  onBack,
}: PasscodeUnlockViewProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const { control, setError, setValue } = useForm({
    defaultValues: { passcode: "" },
  });
  const passcode = useWatch({ control, name: "passcode" });
  const isComplete = passcode.length === PASSCODE_LENGTH;

  // A wrong passcode: show the message under the boxes and clear them for
  // the next try
  useEffect(() => {
    if (!error) return;
    setValue("passcode", "");
    setError("passcode", { message: error });
  }, [error, setError, setValue]);

  return (
    <AppScreen
      gradient
      header={
        <AppHeader
          title={t("lockScreen.passcode.headerTitle")}
          onBack={() => router.back()}
        />
      }
      footer={
        <AppButton
          label={t("common.next")}
          variant="gradient"
          loading={busy}
          disabled={!isComplete || busy}
          onPress={() => onSubmit(passcode)}
        />
      }
    >
      <View style={styles.iconWrapper}>
        <PasscodeLockIcon width={ICON_SIZE} height={ICON_SIZE} />
      </View>

      <AppText typographyType="h4" color={colors.textPrimary}>
        {t("lockScreen.passcode.title")}
      </AppText>

      <AppCodeInput
        control={control}
        name="passcode"
        length={PASSCODE_LENGTH}
        secure
      />

      <View style={styles.forgotRow}>
        <AppText typographyType="body2" color={colors.textSecondary}>
          {t("lockScreen.passcode.forgot")}
        </AppText>
        <AppTextButton
          label={t("lockScreen.loginWithPassword")}
          size="button2"
          disabled={busy}
          onPress={onLoginWithPassword}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
  },
  forgotRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.s3,
  },
});
