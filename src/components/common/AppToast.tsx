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
import { useAppTheme } from "../../hooks/useAppTheme";
import { BrandIcon, BrandIconName } from "../icons";
import { StyleSheet, View } from "react-native";
import { Spacing } from "../../constants/spacing";
import { AppText } from "./AppText";
import { resolveShadows } from "../../theme/shadows";

type ToastVariant = "success" | "error" | "info" | "warning";

type AppToastProps = Readonly<{
  message: string;
  variant?: ToastVariant;
  visible: boolean;
  duration?: number;
  onDismiss?: () => void;
}>;

const DEFAULT_DURATION_MS = 10000;
const TOAST_ICON_SIZE = 14;
const TOAST_RADIUS = Spacing.s3;

const ICON_BY_VARIANT: Record<ToastVariant, BrandIconName> = {
  success: "checkCircleSolid",
  warning: "alertTriangleSolid",
  error: "alertTriangleSolid",
  info: "infoSquareSolid",
};

export function AppToast({
  message,
  variant = "success",
  visible,
  duration = DEFAULT_DURATION_MS,
  onDismiss,
}: AppToastProps) {
  const { colors } = useAppTheme();
  const shadows = resolveShadows(colors);

  useEffect(() => {
    if (!visible || !onDismiss) return;

    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onDismiss]);

  if (!visible) return null;

  const iconColorByVariant: Record<ToastVariant, string> = {
    success: colors.toastSuccessIcon,
    error: colors.toastErrorIcon,
    info: colors.toastInfoIcon,
    warning: colors.toastWarningIcon,
  };

  const bgColorByVariant: Record<ToastVariant, string> = {
    success: colors.toastSuccessBg,
    error: colors.toastErrorBg,
    info: colors.toastInfoBg,
    warning: colors.toastWarningBg,
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bgColorByVariant[variant],
          boxShadow: shadows.tinted02Bottom,
        },
      ]}
    >
      <BrandIcon
        name={ICON_BY_VARIANT[variant]}
        size={TOAST_ICON_SIZE}
        color={iconColorByVariant[variant]}
      />

      <AppText
        typographyType="body2"
        color={colors.textSecondary}
        style={styles.message}
      >
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s3,
    borderRadius: TOAST_RADIUS,
    padding: Spacing.s4,
  },
  // Wraps next to the icon instead of pushing it off screen
  message: {
    flex: 1,
  },
});
