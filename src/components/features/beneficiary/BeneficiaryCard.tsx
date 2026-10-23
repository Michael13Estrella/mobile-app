/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-19
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Pressable, StyleSheet, View } from "react-native";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useTranslation } from "../../../hooks/useTranslation";
import { BeneficiarySummary } from "../../../types";
import { Spacing } from "../../../constants/spacing";
import { AppCard } from "../../common/AppCard";
import { BeneficiaryAvatar } from "./BeneficiaryAvatar";
import { AppText } from "../../common/AppText";
import { getBeneficiaryTitle } from "../../../utils/beneficiary/beneficiary";
import { resolveShadows } from "../../../theme/shadows";
import { GradientText } from "../../common/GradientText";

const ICON_SIZE = 20;

type BeneficiaryCardProps = Readonly<{
  beneficiary: BeneficiarySummary;
  onPress: () => void;
}>;

/**
 * A saved beneficiary in the Manage Beneficiaries list: name (or alias),
 * relationship and how many payout methods it has.
 *
 * @returns <BeneficiaryCard beneficiary={beneficiary} onPress={openDetails} />
 */
export function BeneficiaryCard({
  beneficiary,
  onPress,
}: BeneficiaryCardProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const shadows = resolveShadows(colors);
  const title = getBeneficiaryTitle(beneficiary);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <AppCard
        variant="elevated"
        style={{ ...styles.card, boxShadow: shadows.neutral02Bottom }}
      >
        <BeneficiaryAvatar>
          <GradientText typographyType="h5" weight="bold">
            {beneficiary.nameInitial}
          </GradientText>
        </BeneficiaryAvatar>

        <View style={styles.texts}>
          <AppText
            typographyType="body2"
            weight="semibold"
            color={colors.textPrimary}
            numberOfLines={1}
          >
            {title}
          </AppText>
          <View style={styles.detailsRow}>
            <AppText
              typographyType="title3"
              color={colors.textSecondary}
              numberOfLines={1}
              style={styles.relation}
            >
              {beneficiary.relationToBeneDesc}
            </AppText>
            <AppText typographyType="body4" color={colors.textSecondary}>
              {t("beneficiaries.payoutMethods", {
                count: beneficiary.payoutCount,
              })}
            </AppText>
          </View>
        </View>
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s5,
  },
  texts: {
    flex: 1,
    gap: Spacing.s2,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.s3,
  },
  relation: {
    flex: 1,
  },
});
