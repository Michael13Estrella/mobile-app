/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-18
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ReactNode } from "react";
import { BrandIcon, BrandIconName } from "../../icons";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { Pressable, StyleSheet, View } from "react-native";
import { Spacing } from "../../../constants/spacing";
import { AppText } from "../../common/AppText";

const ICON_BOX_SIZE = 36;
const ICON_BOX_RADIUS = 6;
const ICON_SIZE = 16;
const CHEVRON_SIZE = 16;

type SettingsRowProps = Readonly<{
  icon: BrandIconName;
  title: string;
  // A second line under the title
  description?: string;
  onPress?: () => void;
  right?: ReactNode;
}>;

/**
 * One row of a Profile & Settings card: the icon box, the title (and an
 * optional description), then a chevron, or a control such as a switch.
 *
 * @example <SettingsRow icon="user01Line" title="Personal information" onPress={open} />
 */
export function SettingsRow({
  icon,
  title,
  description,
  onPress,
  right,
}: SettingsRowProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={title}
      style={styles.row}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: colors.settingsIconBackground },
        ]}
      >
        <BrandIcon
          name={icon}
          size={ICON_SIZE}
          grid="S"
          color={colors.iconBrandPrimary}
        />
      </View>

      <View style={styles.texts}>
        <AppText
          typographyType="body2"
          weight="semibold"
          color={colors.textPrimary}
        >
          {title}
        </AppText>
        {!!description && (
          <AppText typographyType="body4" color={colors.textSecondary}>
            {description}
          </AppText>
        )}
      </View>

      {right ?? (
        <BrandIcon
          name="chevronSingleRightLine"
          size={CHEVRON_SIZE}
          color={colors.iconBrandPrimary}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s5,
    paddingVertical: Spacing.s5,
  },
  iconBox: {
    width: ICON_BOX_SIZE,
    height: ICON_BOX_SIZE,
    borderRadius: ICON_BOX_RADIUS,
    alignItems: "center",
    justifyContent: "center",
  },
  texts: {
    flex: 1,
    gap: Spacing.s1,
  },
});
