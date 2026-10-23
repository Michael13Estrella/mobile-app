/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-13
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ReactNode } from "react";
import { Spacing } from "../../../constants/spacing";
import { RecentBeneficiary } from "../../../types";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { resolveShadows } from "../../../theme/shadows";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "../../../hooks/useTranslation";
import { BrandIcon } from "../../icons";
import { GradientText } from "../../common/GradientText";
import { AppText } from "../../common/AppText";
import { formatPersonName } from "../../../utils/format/formatName";
import { AppTextButton } from "../../common/AppTextButton";

const AVATAR_SIZE = 50;
const ITEM_WIDTH = 72;
const ADD_ICON_SIZE = 24;

const SCREEN_PADDING = Spacing.s7;

// Company beneficiaries have a company name instead of a person's name
const beneficiaryName = (beneficiary: RecentBeneficiary) =>
  beneficiary.companyName.trim() ||
  (formatPersonName(beneficiary.firstName).split(" ").at(0) ?? "");

type ItemProps = Readonly<{
  label: string;
  onPress: () => void;
  children: ReactNode;
}>;

// A round avatar with its name underneath.
function BeneficiaryItem({ label, onPress, children }: ItemProps) {
  const { colors } = useAppTheme();
  const shadows = resolveShadows(colors);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.item}
    >
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: colors.surface,
            boxShadow: shadows.neutral02Bottom,
          },
        ]}
      >
        {children}
      </View>
      <AppText
        typographyType="body3"
        color={colors.textPrimary}
        numberOfLines={2}
        style={styles.label}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

type RecentBeneficiariesProps = Readonly<{
  // null while the dashboard is loading (only "Add is shown then")
  beneficiaries: readonly RecentBeneficiary[] | null;
  onAddPress: () => void;
  onBeneficiaryPress: (beneficiary: RecentBeneficiary) => void;
  onViewAllPress: () => void;
}>;

export function RecentBeneficiaries({
  beneficiaries,
  onAddPress,
  onBeneficiaryPress,
  onViewAllPress,
}: RecentBeneficiariesProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  const recent = beneficiaries ?? [];

  return (
    <View style={styles.container}>
      {/* Fixed: stays in place while the list scrolls. */}
      <BeneficiaryItem label={t("home.beneficiaries.add")} onPress={onAddPress}>
        <BrandIcon
          name="plusLine"
          size={ADD_ICON_SIZE}
          color={colors.iconBrandPrimary}
        />
      </BeneficiaryItem>

      {recent?.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
          contentContainerStyle={styles.list}
        >
          {recent?.map((beneficiary) => (
            <BeneficiaryItem
              key={beneficiary.beneficiaryGuid}
              label={beneficiaryName(beneficiary)}
              onPress={() => onBeneficiaryPress(beneficiary)}
            >
              <GradientText typographyType="h5" weight="bold">
                {beneficiary.nameInitial}
              </GradientText>
            </BeneficiaryItem>
          ))}

          {/* Centered on the circles, not on circle + label. */}
          <View style={styles.viewAll}>
            <AppTextButton
              label={t("common.viewAll")}
              size="button2"
              align="center"
              onPress={onViewAllPress}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Edge to edge: cancel the screen padding, then add it back inside.
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.s4,
    marginRight: -SCREEN_PADDING,
    paddingVertical: Spacing.s3,
  },
  scroll: {
    flex: 1,
  },
  list: {
    alignItems: "flex-start",
    gap: Spacing.s4,
    paddingRight: SCREEN_PADDING,
  },
  item: {
    width: ITEM_WIDTH,
    alignItems: "center",
    gap: Spacing.s3,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    textAlign: "center",
  },
  viewAll: {
    height: AVATAR_SIZE,
    justifyContent: "center",
  },
});
