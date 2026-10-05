import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { Typography } from "../../constants/typography";

type SummaryRowProps = Readonly<{
  label: string;
  value: string;
}>;

export const SummaryRow = ({ label, value }: SummaryRowProps) => {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.row, { borderBottomColor: colors.divider }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.value, { color: colors.textPrimary }]}>
        {value || "-"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 12,
  },
  label: { fontSize: Typography.sizes.md, flex: 1 },
  value: { fontSize: Typography.sizes.md, flex: 1.5, textAlign: "right" },
});
