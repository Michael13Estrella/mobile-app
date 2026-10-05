import { StyleSheet, View } from "react-native";
import { Spacing } from "../../constants/spacing";
import { useAppTheme } from "../../hooks/useAppTheme";
import { BrandIcon, BrandIconName } from "../icons";

export const LEADING_ICON_SIZE = 16;
export const LEADING_ICON_LEFT_INSET = Spacing.s4; // gap from the outline to the icon
export const LEADING_ICON_GAP = Spacing.s3; // gap from the icon to the text
export const LEADING_ICON_CONTENT_PADDING =
  LEADING_ICON_LEFT_INSET + LEADING_ICON_SIZE + LEADING_ICON_GAP;

type FieldLeadingIconProps = Readonly<{ name?: BrandIconName; color?: string }>;

// Shared leading-icon overlay
export function FieldLeadingIcon({ name, color }: FieldLeadingIconProps) {
  const { colors } = useAppTheme();

  if (!name) return null;

  return (
    <View style={styles.overlay}>
      <BrandIcon
        name={name}
        size={LEADING_ICON_SIZE}
        color={color ?? colors.iconTertiary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: LEADING_ICON_LEFT_INSET,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    pointerEvents: "none",
  },
});
