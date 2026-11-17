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

import { StyleSheet, View } from "react-native";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useTranslation } from "../../../hooks/useTranslation";
import { Spacing } from "../../../constants/spacing";
import { BeneficiaryAvatar } from "../beneficiary/BeneficiaryAvatar";
import { GradientText } from "../../common/GradientText";
import { AppText } from "../../common/AppText";

const AVATAR_SIZE = 56;

type ProfileSummaryProps = Readonly<{
  initials: string;
  name: string;
  customerId: string;
}>;

/**
 * The top of Profile & Settings: the remitter's avatar with the initials,
 * the name and the customer ID.
 *
 * @example <ProfileSummary initials="JD" name="Juan Dela Cruz" customerId="1234567890" />
 */
export function ProfileSummary({
  initials,
  name,
  customerId,
}: ProfileSummaryProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <BeneficiaryAvatar size={AVATAR_SIZE}>
        <GradientText typographyType="h4">{initials}</GradientText>
      </BeneficiaryAvatar>

      <View style={styles.texts}>
        <AppText
          typographyType="title1"
          weight="bold"
          color={colors.textPrimary}
          numberOfLines={1}
        >
          {name}
        </AppText>
        <AppText
          typographyType="body3"
          color={colors.textSecondary}
          numberOfLines={1}
        >
          {t("profileSettings.customerId", { id: customerId })}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s5,
  },
  texts: {
    flex: 1,
    gap: Spacing.s1,
  },
});
