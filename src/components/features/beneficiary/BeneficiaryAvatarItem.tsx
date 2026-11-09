/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { Spacing } from "../../../constants/spacing";
import { AppText } from "../../common/AppText";
import { BeneficiaryAvatar } from "./BeneficiaryAvatar";

export const AVATAR_ITEM_SIZE = 50;
export const AVATAR_ITEM_WIDTH = 72;
const ADD_BORDER_WIDTH = 1;

// beneficiary: a raised gradient avatar; add: a flat dashed circle
type AvatarItemVariant = "beneficiary" | "add";

type BeneficiaryAvatarItemProps = Readonly<{
  label: string;
  variant?: AvatarItemVariant;
  onPress: () => void;
  // The circle's content: initials, or an icon
  children: ReactNode;
}>;

/**
 * A round avatar with its name underneath (Home's recent beneficiaries,
 * the beneficiary picker's "Most recent").
 *
 * @example <BeneficiaryAvatarItem label="Josh" onPress={select}><GradientText …>JS</GradientText></BeneficiaryAvatarItem>
 */
export function BeneficiaryAvatarItem({
  label,
  variant = "beneficiary",
  onPress,
  children,
}: BeneficiaryAvatarItemProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.item}
    >
      {variant === "add" ? (
        <View
          style={[
            styles.addAvatar,
            {
              backgroundColor: colors.addAvatarBackground,
              borderColor: colors.addAvatarBorder,
            },
          ]}
        >
          {children}
        </View>
      ) : (
        <BeneficiaryAvatar size={AVATAR_ITEM_SIZE}>
          {children}
        </BeneficiaryAvatar>
      )}
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

const styles = StyleSheet.create({
  item: {
    width: AVATAR_ITEM_WIDTH,
    alignItems: "center",
    gap: Spacing.s3,
  },
  addAvatar: {
    width: AVATAR_ITEM_SIZE,
    height: AVATAR_ITEM_SIZE,
    borderRadius: AVATAR_ITEM_SIZE / 2,
    borderWidth: ADD_BORDER_WIDTH,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    textAlign: "center",
  },
});
