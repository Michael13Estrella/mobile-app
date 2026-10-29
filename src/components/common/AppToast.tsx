/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useTranslation } from "../../hooks/useTranslation";
import { Spacing } from "../../constants/spacing";
import { BrandIcon } from "../icons";
import { AppText } from "./AppText";
import { ToastVariant } from "../../types";

type AppToastProps = Readonly<{
  message: string;
  variant?: ToastVariant;
  visible: boolean;
  duration?: number;
  // Called after `duration`, and by the ✕ (no ✕ without it)
  onDismiss?: () => void;
}>;

const DEFAULT_DURATION_MS = 10000;
const TOAST_RADIUS = Spacing.s4;
const TOAST_BORDER_WIDTH = 1;
const CLOSE_ICON_SIZE = 24;
const CLOSE_HIT_SLOP = Spacing.s3;

/**
 * A short message that hides itself after `duration` (unlike AppAlert,
 * which stays on the screen): the text in a light box colored by its
 * variant, and a ✕ to close it sooner.
 *
 * @example <AppToast visible={isSaved} variant="success" message={t("beneficiaryDetails.payoutAdded")} onDismiss={hideToast} />
 */
export function AppToast({
  message,
  variant = "success",
  visible,
  duration = DEFAULT_DURATION_MS,
  onDismiss,
}: AppToastProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  useEffect(() => {
    if (!visible || !onDismiss) return;

    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onDismiss]);

  if (!visible) return null;

  // Same colors as AppAlert: a toast is an alert that goes away
  const colorsByVariant: Record<
    ToastVariant,
    Readonly<{ background: string; border: string }>
  > = {
    success: {
      background: colors.alertSuccessBackground,
      border: colors.alertSuccessBorder,
    },
    error: {
      background: colors.alertErrorBackground,
      border: colors.alertErrorBorder,
    },
    info: {
      background: colors.alertInfoBackground,
      border: colors.alertInfoBorder,
    },
    warning: {
      background: colors.alertWarningBackground,
      border: colors.alertWarningBorder,
    },
  };

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.container,
        {
          backgroundColor: colorsByVariant[variant].background,
          borderColor: colorsByVariant[variant].border,
        },
      ]}
    >
      <AppText
        typographyType="body2"
        color={colors.textPrimary}
        style={styles.message}
      >
        {message}
      </AppText>

      {!!onDismiss && (
        <Pressable
          onPress={onDismiss}
          hitSlop={CLOSE_HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={t("common.close")}
        >
          <BrandIcon
            name="xLine"
            size={CLOSE_ICON_SIZE}
            color={colors.iconSecondary}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s3,
    borderRadius: TOAST_RADIUS,
    borderWidth: TOAST_BORDER_WIDTH,
    paddingVertical: Spacing.s4,
    paddingLeft: Spacing.s6,
    paddingRight: Spacing.s5,
  },
  // Wraps next to the ✕ instead of pushing it off screen
  message: {
    flex: 1,
  },
});
