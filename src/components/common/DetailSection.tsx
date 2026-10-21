/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-20
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ReactNode } from "react";
import { useAppTheme } from "../../hooks/useAppTheme";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Spacing } from "../../constants/spacing";
import { AppText } from "./AppText";
import { AppCard } from "./AppCard";

type DetailSectionProps = Readonly<{
  title: string;
  // Overrides for the card (e.g. rows that set their own spacing)
  cardStyle?: ViewStyle;
  children: ReactNode;
}>;

/**
 * An uppercase section title above a card of rows
 * (e.g. "BENEFICIARY DETAILS" with `DetailRow`s).
 *
 * @example <DetailSection title="Beneficiary details"><DetailRow … /></DetailSection>
 */
export function DetailSection({
  title,
  cardStyle,
  children,
}: DetailSectionProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.section}>
      <AppText
        typographyType="overline1"
        weight="bold"
        color={colors.textSecondary}
        style={styles.title}
      >
        {title}
      </AppText>
      <AppCard style={{ ...styles.card, ...cardStyle }}>{children}</AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.s4,
  },
  title: {
    textTransform: "uppercase",
  },
  card: {
    gap: Spacing.s5,
  },
});
