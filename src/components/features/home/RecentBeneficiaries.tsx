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

import { Spacing } from "../../../constants/spacing";
import { RecentBeneficiary } from "../../../types";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "../../../hooks/useTranslation";
import { BrandIcon } from "../../icons";
import { GradientText } from "../../common/GradientText";
import { AppTextButton } from "../../common/AppTextButton";
import { AppSkeleton } from "../../common/AppSkeleton";
import {
  AVATAR_ITEM_SIZE,
  AVATAR_ITEM_WIDTH,
  BeneficiaryAvatarItem,
} from "../beneficiary/BeneficiaryAvatarItem";
import { getRecentBeneficiaryLabel } from "../../../utils/beneficiary/beneficiary";

const ADD_ICON_SIZE = 24;

const SCREEN_PADDING = Spacing.s7;

const SKELETON_ITEM_COUNT = 4;
const SKELETON_LABEL_HEIGHT = Spacing.s4;
const SKELETON_ITEMS = Array.from(
  { length: SKELETON_ITEM_COUNT },
  (_, index) => `skeleton-${index}`,
);

type RecentBeneficiariesProps = Readonly<{
  // null while the dashboard is loading (only "Add is shown then")
  beneficiaries: readonly RecentBeneficiary[] | null;
  // First load: placeholders show beside "Add"
  isLoading: boolean;
  onAddPress: () => void;
  onBeneficiaryPress: (beneficiary: RecentBeneficiary) => void;
  onViewAllPress: () => void;
}>;

export function RecentBeneficiaries({
  beneficiaries,
  isLoading,
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
      <BeneficiaryAvatarItem
        label={t("home.beneficiaries.add")}
        variant="add"
        onPress={onAddPress}
      >
        <BrandIcon
          name="plusLine"
          size={ADD_ICON_SIZE}
          color={colors.iconBrandSecondary}
        />
      </BeneficiaryAvatarItem>

      {isLoading && (
        <ScrollView
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
          contentContainerStyle={styles.list}
        >
          {SKELETON_ITEMS.map((item) => (
            <View key={item} style={styles.skeletonItem}>
              <AppSkeleton circle height={AVATAR_ITEM_SIZE} />
              <AppSkeleton
                width={AVATAR_ITEM_SIZE}
                height={SKELETON_LABEL_HEIGHT}
              />
            </View>
          ))}
        </ScrollView>
      )}

      {recent?.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
          contentContainerStyle={styles.list}
        >
          {recent?.map((beneficiary) => (
            <BeneficiaryAvatarItem
              key={beneficiary.beneficiaryGuid}
              label={getRecentBeneficiaryLabel(beneficiary)}
              onPress={() => onBeneficiaryPress(beneficiary)}
            >
              <GradientText typographyType="h5" weight="bold">
                {beneficiary.nameInitial}
              </GradientText>
            </BeneficiaryAvatarItem>
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
  skeletonItem: {
    width: AVATAR_ITEM_WIDTH,
    alignItems: "center",
    gap: Spacing.s3,
  },
  viewAll: {
    height: AVATAR_ITEM_SIZE,
    justifyContent: "center",
  },
});
