/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-17
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Pressable, StyleSheet, View } from "react-native";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { resolveShadows } from "../../../theme/shadows";
import { EnrolledBiller } from "../../../types";
import { AppCard } from "../../common/AppCard";
import { Spacing } from "../../../constants/spacing";
import { AppText } from "../../common/AppText";
import { getEnrolledBillerNumber } from "../../../utils/biller/enrolledBillers";
import { BrandIcon } from "../../icons";

const CHEVRON_SIZE = 16;

type EnrolledBillerCardProps = Readonly<{
  biller: EnrolledBiller;
  onPress: () => void;
}>;

/**
 * An enrolled biller in the Enrolled Billers list: its name and its
 * subscriber number (a card's last digits only).
 *
 * @example <EnrolledBillerCard biller={biller} onPress={openDetails} />
 */
export function EnrolledBillerCard({
  biller,
  onPress,
}: EnrolledBillerCardProps) {
  const { colors } = useAppTheme();
  const shadows = resolveShadows(colors);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={biller.bpSubscriberName}
    >
      <AppCard
        variant="elevated"
        style={{ ...styles.card, boxShadow: shadows.neutral02Bottom }}
      >
        <View style={styles.texts}>
          <AppText
            typographyType="body2"
            weight="semibold"
            color={colors.textPrimary}
          >
            {biller.bpSubscriberName}
          </AppText>
          <AppText typographyType="body4" color={colors.textSecondary}>
            {getEnrolledBillerNumber(biller)}
          </AppText>
        </View>

        <BrandIcon
          name="chevronSingleRightLine"
          size={CHEVRON_SIZE}
          color={colors.iconBrandPrimary}
        />
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s5,
    borderRadius: Spacing.s3,
  },
  texts: {
    flex: 1,
    gap: Spacing.s1,
  },
});
