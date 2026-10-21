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

import { Pressable, StyleSheet, View } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { ActivityIndicator } from "react-native-paper";
import { AppText } from "./AppText";
import { Spacing } from "../../constants/spacing";
import { BrandIcon, BrandIconName } from "../icons";

type TextAlign = "left" | "center" | "right";

// Extra touch area around the text, so a short label is still easy to tap.
const HIT_SLOP = Spacing.s2;
const ICON_SIZE = 16;

type AppTextButtonProps = Readonly<{
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  align?: TextAlign;
  // Text size: "button1" matches a full-size AppButton next to it.
  size?: "button1" | "button2" | "button3";
  // Optional icon before the label
  icon?: BrandIconName;
  tone?: "primary" | "danger";
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
  icon,
  tone = "primary",
}: AppTextButtonProps) {
  const { colors } = useAppTheme();
  const isDisabled = disabled || loading;
  const color = tone === "danger" ? colors.textError : colors.buttonPrimary;

  return (
    // Layout box: takes the row/column space and positions the button.
    <View style={[styles.container, { alignItems: alignToFlex(align) }]}>
      {/* Touch area: only as big as the label (plus HIT_SLOP). */}
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={[styles.pressable, size === "button1" && styles.buttonHeight]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={color} />
        ) : (
          <>
            {icon && <BrandIcon name={icon} size={ICON_SIZE} color={color} />}
            <AppText typographyType={size} weight="bold" color={color}>
              {label}
            </AppText>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    justifyContent: "center",
  },
  pressable: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s2,
    paddingVertical: Spacing.s3,
  },
  buttonHeight: {
    minHeight: 48,
  },
});
