import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useAppTheme } from "../../../src/hooks/useAppTheme";

export default function HomeScreen() {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.textPrimary }}>Home Screen</Text>
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
