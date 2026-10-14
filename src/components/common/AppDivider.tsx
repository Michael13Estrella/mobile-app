/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-04
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet, View } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { Spacing } from "../../constants/spacing";

type AppDividerProps = Readonly<{
  style?: object;
  marginVertical?: boolean;
}>;

export const AppDivider = ({
  style,
  marginVertical = true,
}: AppDividerProps) => {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: colors.dividerDefault,
          marginVertical: marginVertical ? Spacing.s3 : Spacing.s0,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: "100%",
    height: 1,
  },
});
