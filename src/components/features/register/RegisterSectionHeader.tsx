/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet, View } from "react-native";
import { Spacing } from "../../../constants/spacing";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { ProgressNumberCircle } from "../../common/ProgressNumberCircle";
import { AppText } from "../../common/AppText";

const NUMBER_CIRCLE_SIZE = 26;
const DEFAULT_PROGRESS = 0;

type SectionHeaderProps = Readonly<{
  title: string;
  subtitle?: string;
  number?: number;
  progress?: number;
}>;

export function RegisterSectionHeader({
  number,
  title,
  subtitle,
  progress = DEFAULT_PROGRESS,
}: SectionHeaderProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {number && (
          <ProgressNumberCircle
            number={number}
            progress={progress}
            size={NUMBER_CIRCLE_SIZE}
            textColor={colors.textBrandPrimary}
          />
        )}
        <AppText typographyType="h4" color={colors.textPrimary}>
          {title}
        </AppText>
      </View>
      {!!subtitle && (
        <AppText typographyType="body2" color={colors.textSecondary}>
          {subtitle}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.s3,
  },
  headerContainer: {
    flexDirection: "row",
    gap: Spacing.s4,
  },
});
