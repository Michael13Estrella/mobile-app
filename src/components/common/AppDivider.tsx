import { StyleSheet, View, Text } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { Typography } from "../../constants/typography";
import { Palette } from "../../constants/palette";

type AppDividerProps = Readonly<{
  label?: string;
  onDark?: boolean;
  style?: object;
}>;

export const AppDivider = ({
  label,
  onDark = false,
  style,
}: AppDividerProps) => {
  const { colors } = useAppTheme();

  const lineColor = onDark ? `${Palette.white100}4D` : colors.divider;

  const textColor = onDark ? Palette.white100 : colors.textSecondary;

  if (!label) {
    return (
      <View
        style={[styles.simpleDivider, { backgroundColor: lineColor }, style]}
      ></View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.line, { backgroundColor: lineColor }]} />
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <View style={[styles.line, { backgroundColor: lineColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
  },
  simpleDivider: {
    width: "100%",
    height: 1,
  },
  label: {
    fontSize: Typography.sizes.xs,
  },
});
