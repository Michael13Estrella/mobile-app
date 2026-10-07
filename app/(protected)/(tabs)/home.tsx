/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-07
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useAppTheme } from "../../../src/hooks/useAppTheme";
import { BrandIcon } from "../../../src/components/icons";

export default function HomeScreen() {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.textPrimary }}>Home Screen</Text>
      <BrandIcon
        name="home03Solid"
        gradient={{
          from: colors.brandGradientStart,
          to: colors.brandGradientEnd,
        }}
      />
      <BrandIcon
        name="users01Line"
        gradient={{
          from: colors.brandGradientStart,
          to: colors.brandGradientEnd,
        }}
      />

      <BrandIcon
        name="bankNote01Line"
        gradient={{
          from: colors.brandGradientStart,
          to: colors.brandGradientEnd,
        }}
      />
      <BrandIcon
        name="receiptCheckLine"
        gradient={{
          from: colors.brandGradientStart,
          to: colors.brandGradientEnd,
        }}
      />
      <BrandIcon
        name="dotsHorizontalLine"
        gradient={{
          from: colors.brandGradientStart,
          to: colors.brandGradientEnd,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
