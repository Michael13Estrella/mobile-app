import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { Palette } from "../../constants/palette";
import { Spacing } from "../../constants/spacing";

const CARD_RADIUS = 16;
const CARD_BORDER_WIDTH = 1;

// elevated: shadow
// outlined: thin border, no shadow
export type AppCardVariant = "elevated" | "outlined";

type AppCardProps = Readonly<{
  variant?: AppCardVariant;
  style?: ViewStyle;
  children?: React.ReactNode;
}>;

export const AppCard = ({
  variant = "outlined",
  style,
  children,
}: AppCardProps) => {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface },
        variant === "elevated"
          ? styles.elevated
          : [styles.outlined, { borderColor: colors.borderSubtle }],
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: CARD_RADIUS,
    padding: Spacing.s5,
    gap: Spacing.s4,
  },
  elevated: {
    shadowColor: Palette.mbAzure500,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  outlined: {
    borderWidth: CARD_BORDER_WIDTH,
  },
});
