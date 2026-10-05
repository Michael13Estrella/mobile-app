import { Pressable, StyleSheet } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { Typography } from "../../constants/typography";
import { ActivityIndicator } from "react-native-paper";
import { AppText } from "./AppText";

type TextAlign = "left" | "center" | "right";

type AppTextButtonProps = Readonly<{
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  align?: TextAlign;
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
          typographyType="button3"
          weight="bold"
          color={colors.buttonPrimary}
        >
          {label}
        </AppText>
        // <Text
        //   style={[
        //     styles.label,
        //     { color: disabled ? colors.textSecondary : colors.buttonPrimary },
        //   ]}
        // >
        //   {label}
        // </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
  },
  label: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
});
