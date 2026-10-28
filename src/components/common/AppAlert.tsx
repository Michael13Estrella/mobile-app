/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-28
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet, View } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { BrandIcon, BrandIconName } from "../icons";
import { Spacing } from "../../constants/spacing";
import { AppText } from "./AppText";

const ICON_SIZE = 16;
const ALERT_RADIUS = 12;
const ALERT_BORDER_WIDTH = 1;

type AlertVariant = "success" | "error" | "info" | "warning";

type AlertColors = Readonly<{
  background: string;
  border: string;
  icon: string;
}>;

type AppAlertProps = Readonly<{
  message: string;
  variant?: AlertVariant;
}>;

const ICON_BY_VARIANT: Record<AlertVariant, BrandIconName> = {
  success: "checkCircleSolid",
  warning: "alertTriangleSolid",
  error: "alertTriangleSolid",
  info: "infoCircleSolid",
};

/**
 * A message that stays on the screen (unlike AppToast): an icon and text
 * in a light box, colored by its variant.
 *
 * @example <AppAlert variant="info" message={t("cashPickupGuide.idNote")} />
 */
export function AppAlert({ message, variant = "info" }: AppAlertProps) {
  const { colors } = useAppTheme();

  const colorsByVariant: Record<AlertVariant, AlertColors> = {
    success: {
      background: colors.alertSuccessBackground,
      border: colors.alertSuccessBorder,
      icon: colors.alertSuccessIcon,
    },
    error: {
      background: colors.alertErrorBackground,
      border: colors.alertErrorBorder,
      icon: colors.alertErrorIcon,
    },
    info: {
      background: colors.alertInfoBackground,
      border: colors.alertInfoBorder,
      icon: colors.alertInfoIcon,
    },
    warning: {
      background: colors.alertWarningBackground,
      border: colors.alertWarningBorder,
      icon: colors.alertWarningIcon,
    },
  };

  const alertColors = colorsByVariant[variant];

  return (
    <View
      style={[
        styles.alert,
        {
          backgroundColor: alertColors.background,
          borderColor: alertColors.border,
        },
      ]}
    >
      <BrandIcon
        name={ICON_BY_VARIANT[variant]}
        size={ICON_SIZE}
        color={alertColors.icon}
      />

      <AppText
        typographyType="body3"
        color={colors.textPrimary}
        style={styles.message}
      >
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  alert: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.s3,
    padding: Spacing.s4,
    borderRadius: ALERT_RADIUS,
    borderWidth: ALERT_BORDER_WIDTH,
  },

  // Wraps next to the icon instead of push it off screen
  message: {
    flex: 1,
  },
});
