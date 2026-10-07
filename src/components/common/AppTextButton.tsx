/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-15
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Pressable, StyleSheet } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { Typography } from "../../constants/typography";
import { ActivityIndicator } from "react-native-paper";
import { AppText } from "./AppText";
import { Spacing } from "../../constants/spacing";

type TextAlign = "left" | "center" | "right";

type AppTextButtonProps = Readonly<{
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  align?: TextAlign;
  // Text size: "button1" matches a full-size AppButton next to it.
  size?: "button1" | "button2" | "button3";
}>;

function alignToFlex(align: TextAlign): "flex-start" | "center" | "flex-end" {
  if (align === "right") return "flex-end";
  if (align === "center") return "center";
  return "flex-start";
}

export function AppTextButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  align = "left",
  size = "button3",
}: AppTextButtonProps) {
  const { colors } = useAppTheme();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      hitSlop={8}
      style={[styles.container, { alignItems: alignToFlex(align) }]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.buttonPrimary} />
      ) : (
        <AppText
          typographyType={size}
          weight="bold"
          color={colors.buttonPrimary}
        >
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    justifyContent: "center",
    paddingVertical: Spacing.s3,
  },
  label: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
});
