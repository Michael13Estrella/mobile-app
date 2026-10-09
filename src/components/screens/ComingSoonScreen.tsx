/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-08
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { AppHeader } from "../common/AppHeader";
import { AppScreen } from "../common/AppScreen";
import { AppText } from "../common/AppText";

type ComingSoonScreenProps = Readonly<{ title: string }>;

// Placeholder for a screen that isn't built yet.
export function ComingSoonScreen({ title }: ComingSoonScreenProps) {
  const { colors } = useAppTheme();

  return (
    <AppScreen
      gradient
      header={<AppHeader title={title} />}
      contentContainerStyle={styles.content}
    >
      <AppText typographyType="body2" color={colors.textSecondary}>
        Coming soon ...
      </AppText>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
});
