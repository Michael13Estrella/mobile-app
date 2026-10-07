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

type ToastVariant = "success" | "error" | "info" | "warning";

type AppToastProps = Readonly<{
  message: string;
  variant?: ToastVariant;
  visible: boolean;
  duration?: number;
  onDismiss?: () => void;
}>;

const DEFAULT_DURATION_MS = 10000;
const ICON_CIRCLE_SIZE = 16;

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
      style={[styles.container, { backgroundColor: bgColorByVariant[variant] }]}
    >
      <View style={[styles.iconCircle]}>
        <BrandIcon
          name={ICON_BY_VARIANT[variant]}
          size={14}
          color={iconColorByVariant[variant]}
        />
      </View>
      <AppText typographyType="body2" color={colors.textSecondary}>
        {message}
      </AppText>
      {/* <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s3,
    borderRadius: 8,
    padding: Spacing.s4,
    shadowColor: "#001052",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 6,
  },
  iconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: ICON_CIRCLE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    flex: 1,
  },
});
