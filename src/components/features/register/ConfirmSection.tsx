/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-02
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ReactNode } from "react";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useTranslation } from "../../../hooks/useTranslation";
import { Pressable, StyleSheet, View } from "react-native";
import { Spacing } from "../../../constants/spacing";
import { AppText } from "../../common/AppText";
import { BrandIcon } from "../../icons";
import { AppCard } from "../../common/AppCard";

const EDIT_ICON_SIZE = 16;

type ConfirmSectionProps = Readonly<{
  title: string;
  onEdit: () => void;
  children: ReactNode; // Confirm row items
}>;

// "SECTION TITLE ............. Edit" followed by a card of rows.
export function ConfirmSection({
  title,
  onEdit,
  children,
}: ConfirmSectionProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <AppText
          typographyType="overline1"
          weight="bold"
          color={colors.textSecondary}
          style={styles.uppercase}
        >
          {title}
        </AppText>
        <Pressable
          onPress={onEdit}
          hitSlop={Spacing.s3}
          accessibilityRole="button"
          accessibilityLabel={`${t("registerConfirm.edit")} ${title}`}
          style={styles.editButton}
        >
          <BrandIcon
            name="edit02Line"
            size={EDIT_ICON_SIZE}
            color={colors.textBrandPrimary}
          />
          <AppText
            typographyType="button2"
            weight="bold"
            color={colors.textBrandPrimary}
          >
            {t("registerConfirm.edit")}
          </AppText>
        </Pressable>
      </View>

      <AppCard style={styles.card}>{children}</AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.s4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  uppercase: {
    textTransform: "uppercase",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.s2,
  },
  card: {
    gap: Spacing.s4,
  },
});
