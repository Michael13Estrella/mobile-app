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
}>;

export const AppDivider = ({ style }: AppDividerProps) => {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: colors.dividerDefault },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: "100%",
    height: 1,
    marginVertical: Spacing.s3,
  },
});
