/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-23
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet, View } from "react-native";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { Spacing } from "../../../constants/spacing";
import { BeneficiaryAvatar } from "./BeneficiaryAvatar";
import { GradientText } from "../../common/GradientText";
import { AppText } from "../../common/AppText";

const AVATAR_SIZE = 56;

type BeneficiaryProfileProps = Readonly<{
  initials: string;
  name: string;
}>;

/**
 * The top of a beneficiary's screen: the avatar with the initials, and the
 * name under it.
 *
 * @example <BeneficiaryProfile initials="JS" name="Josh Cullen Santos" />
 */
export function BeneficiaryProfile({
  initials,
  name,
}: BeneficiaryProfileProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.details}>
      <BeneficiaryAvatar size={AVATAR_SIZE}>
        <GradientText typographyType="h4">{initials}</GradientText>
      </BeneficiaryAvatar>
      <AppText
        typographyType="h3"
        color={colors.textPrimary}
        style={styles.name}
      >
        {name}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  details: {
    alignItems: "center",
    gap: Spacing.s5,
  },
  name: {
    textAlign: "center",
  },
});
