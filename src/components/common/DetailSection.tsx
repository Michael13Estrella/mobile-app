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
import { StyleSheet, View } from "react-native";
import { Spacing } from "../../constants/spacing";
import { AppText } from "./AppText";
import { AppCard } from "./AppCard";

type DetailSectionProps = Readonly<{
  title: string;
  children: ReactNode;
}>;

/**
 * An uppercase section title above a card of rows
 * (e.g. "BENEFICIARY DETAILS" with `DetailRow`s).
 *
 * @example <DetailSection title="Beneficiary details"><DetailRow … /></DetailSection>
 */
export function DetailSection({ title, children }: DetailSectionProps) {
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
      <AppCard style={styles.card}>{children}</AppCard>
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
