import { StyleSheet, View } from "react-native";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { Spacing } from "../../../constants/spacing";
import { AppText } from "../../common/AppText";

const EMPTY_VALUE = "-";

type ConfirmRowProps = Readonly<{
  label: string;
  value?: string;
}>;

// One "LABEL ....... value" line in a confirm-screen card.
export function ConfirmRow({ label, value }: ConfirmRowProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      <AppText
        typographyType="overline2"
        weight="bold"
        color={colors.textSecondary}
        style={[styles.label, styles.uppercase]}
      >
        {label}
      </AppText>
      <AppText
        typographyType="body3"
        color={colors.textPrimary}
        style={styles.value}
      >
        {value || EMPTY_VALUE}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.s5,
  },
  label: {
    flex: 1,
  },
  uppercase: {
    textTransform: "uppercase",
  },
  value: {
    flex: 1,
    textAlign: "right",
  },
});
