import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { Typography } from "../../constants/typography";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IconName } from "../../types";

type MenuRowProps = Readonly<{
  icon: IconName;
  label: string;
  value?: string;
  onPress: () => void;
  isLast?: boolean;
  expanded?: boolean;
  color?: string;
}>;

export const MenuRow = ({
  icon,
  label,
  value,
  onPress,
  isLast = false,
  expanded,
  color,
}: MenuRowProps) => {
  const { colors } = useAppTheme();

  const getChevron = () => {
    if (expanded == undefined) return "chevron-right";
    return expanded ? "chevron-down" : "chevron-right";
  };

  return (
    <TouchableOpacity
      style={[
        styles.row,
        !isLast && {
          borderBottomWidth: 1,
          borderBottomColor: colors.dividerDefault,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={color ?? colors.primary}
      />
      <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>

      {value && (
        <Text style={[styles.value, { color: colors.textSecondary }]}>
          {value}
        </Text>
      )}
      <MaterialCommunityIcons
        name={getChevron()}
        size={20}
        color={colors.textSecondary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 0,
    paddingVertical: 14,
  },

  label: {
    flex: 1,
    fontSize: Typography.sizes.md,
  },
  value: {
    fontSize: Typography.sizes.sm,
  },
});
