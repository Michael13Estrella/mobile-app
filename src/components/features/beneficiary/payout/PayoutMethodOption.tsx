/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-22
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Pressable, StyleSheet, View } from "react-native";
import { Spacing } from "../../../../constants/spacing";
import { useAppTheme } from "../../../../hooks/useAppTheme";
import { FIELD_SIZE } from "../../../../theme/field";
import { resolveShadows } from "../../../../theme/shadows";
import { AppCard } from "../../../common/AppCard";
import { AppRichText } from "../../../common/AppRichText";
import { AppText } from "../../../common/AppText";
import { BrandIcon, BrandIconName } from "../../../icons";

const ICON_SIZE = 32;

type PayoutMethodOptionProps = Readonly<{
  icon: BrandIconName;
  title: string;
  // Bold parts between double asterisks
  description: string;
  selected: boolean;
  onPress: () => void;
}>;

/**
 * One choice on the payout method screen: a card with an icon, a title and
 * a description; the selected one has a blue border.
 *
 * @example <PayoutMethodOption icon="bankLine" title="Metrobank account" description="…" selected onPress={select} />
 */
export function PayoutMethodOption({
  icon,
  title,
  description,
  selected,
  onPress,
}: PayoutMethodOptionProps) {
  const { colors } = useAppTheme();
  const shadows = resolveShadows(colors);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={title}
    >
      <AppCard
        variant="elevated"
        style={{
          ...styles.card,
          boxShadow: shadows.neutral02Bottom,
          // Always a border (transparent when not selected), so selecting
          // doesn't shift the content by its width
          borderColor: selected ? colors.inputBorderFocused : "transparent",
        }}
      >
        <BrandIcon name={icon} size={ICON_SIZE} gradient />

        <View style={styles.texts}>
          <AppText
            typographyType="body1"
            weight="bold"
            color={colors.textPrimary}
          >
            {title}
          </AppText>
          <AppRichText
            text={description}
            typographyType="body3"
            color={colors.textSecondary}
          />
        </View>
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.s5,
    borderWidth: FIELD_SIZE.borderWidth,
  },
  texts: {
    flex: 1,
    gap: Spacing.s2,
  },
});
