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

import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "../../../src/hooks/useAppTheme";
import { useAuth } from "../../../src/hooks/useAuth";
import { Typography } from "../../../src/constants/typography";
import { ScreenWrapper } from "../../../src/components/layout/ScreenWrapper";
import { MenuRow } from "../../../src/components/common/MenuRow";

export default function MoreScreen() {
  const { colors } = useAppTheme();
  const { signOut, user } = useAuth();

  return (
    <ScreenWrapper scrollable padded={false}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <MaterialCommunityIcons
            name="account"
            size={36}
            color={colors.textInverse}
          />
        </View>
        <Text style={[styles.email, { color: colors.textInverse }]}>
          {user?.email ?? "User"}
        </Text>
      </View>

      {/* Menu Items */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          SETTINGS
        </Text>
        <MenuRow icon="bell-outline" label="Notifications" onPress={() => {}} />
        <MenuRow
          icon="shield-lock-outline"
          label="Security"
          onPress={() => {}}
        />
        <MenuRow
          icon="theme-light-dark"
          label="Appearance"
          onPress={() => {}}
        />
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          SUPPORT
        </Text>
        <MenuRow
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => {}}
        />
        <MenuRow icon="information-outline" label="About" onPress={() => {}} />
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <MenuRow
          icon="logout"
          label="Logout"
          onPress={signOut}
          color={colors.error}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  email: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
  },
  section: {
    marginTop: 12,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    letterSpacing: 1,
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: Typography.sizes.md,
  },
});
