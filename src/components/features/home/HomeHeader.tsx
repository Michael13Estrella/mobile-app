/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-09
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
import Logo from "../../../../assets/icons/brand.svg";
import { AppText } from "../../common/AppText";
import { formatDateTimeWithSeconds } from "../../../utils/format/formatDate";
import { INTL_LOCALE } from "../../../constants/locale";

const LOGO_SIZE = 32;
const BELL_BUTTON_SIZE = 40;
const BELL_ICON_SIZE = 24;
const BADGE_SIZE = 16;
// Badge shows "99+" above this
const MAX_BADGE_COUNT = 9;

type HomeHeaderProps = Readonly<{
  // null until the dashboard loads -> "Welcome!"
  displayName: string | null;
  // ISO date; null on the first login (nothing to show)
  lastLogin: string | null;
  unreadCount: number;
  onNotificationPress?: () => void;
}>;

export function HomeHeader({
  displayName,
  lastLogin,
  unreadCount,
  onNotificationPress,
}: HomeHeaderProps) {
  const { colors } = useAppTheme();
  const { t, locale } = useTranslation();

  return (
    <View style={styles.container}>
      <Logo width={LOGO_SIZE} height={LOGO_SIZE} />

      <View style={styles.texts}>
        <AppText
          typographyType="title1"
          color={colors.textBrandPrimary}
          numberOfLines={1}
        >
          {displayName ? (
            <>
              {t("home.welcomeWithName.before")}
              <AppText typographyType="title1" weight="bold">
                {displayName}
              </AppText>
              {t("home.welcomeWithName.after")}
            </>
          ) : (
            t("home.welcome")
          )}
        </AppText>
        {!!lastLogin && (
          <AppText typographyType="title3" color={colors.textSecondary}>
            {t("home.lastLogin", {
              date: formatDateTimeWithSeconds(lastLogin, INTL_LOCALE[locale]),
            })}
          </AppText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s4,
  },
  texts: {
    flex: 1,
    gap: Spacing.s1,
  },
  bellButton: {
    width: BELL_BUTTON_SIZE,
    height: BELL_BUTTON_SIZE,
    borderRadius: BELL_BUTTON_SIZE / 2,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // Top-right corner of the bell button.
  badge: {
    position: "absolute",
    top: -Spacing.s2,
    right: -Spacing.s2,
    minWidth: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    paddingHorizontal: Spacing.s1,
    alignItems: "center",
    justifyContent: "center",
  },
});
