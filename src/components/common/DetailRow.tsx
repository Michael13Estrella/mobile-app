/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-02
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet, View } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { AppText } from "./AppText";
import { Spacing } from "../../constants/spacing";

const EMPTY_VALUE = "-";

type DetailRowProps = Readonly<{
  label: string;
  value?: string;
}>;

/**
 * One "LABEL ....... value" line in a details card: the label in grey
 * capitals on the left, the value on the right. Long values wrap.
 *
 * @param label - The filed name (uppercased by style; pass normal text).
 * @param value - The value; shows "-" when empty or missing
 * @example <DetailRow label={t("remitter.mobile.label")} value={phoneNumber} />
 */
export function DetailRow({ label, value }: DetailRowProps) {
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
