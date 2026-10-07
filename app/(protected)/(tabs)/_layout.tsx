/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-02
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "../../../src/hooks/useAppTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ColorValue, StyleSheet } from "react-native";

type TabBarIconProps = Readonly<{
  focused: boolean;
  color: ColorValue;
  size: number;
}>;

const HomeIcon = ({ color, size }: TabBarIconProps) => (
  <MaterialCommunityIcons name="home" color={color} size={size} />
);

const HistoryIcon = ({ color, size }: TabBarIconProps) => (
  <MaterialCommunityIcons name="history" color={color} size={size} />
);

const ProfileIcon = ({ color, size }: TabBarIconProps) => (
  <MaterialCommunityIcons name="account" color={color} size={size} />
);

const MenuIcon = ({ color, size }: TabBarIconProps) => (
  <MaterialCommunityIcons name="menu" color={color} size={size} />
);

export default function TabLayout() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderDefault,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: HomeIcon,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ProfileIcon,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: HistoryIcon,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: MenuIcon,
        }}
      />
    </Tabs>
  );
}
