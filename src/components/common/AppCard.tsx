import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { Palette } from "../../constants/palette";
import { Spacing } from "../../constants/spacing";

type AppCardProps = Readonly<{
  style?: ViewStyle;
  children?: React.ReactNode;
}>;

export const AppCard = ({ style, children }: AppCardProps) => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: Spacing.s5,
    shadowColor: Palette.mbAzure500,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    shadowOpacity: 0.1,
    elevation: 3,
  },
});
