/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-05
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useAppTheme } from "../../hooks/useAppTheme";
import { StyleSheet, View, Pressable } from "react-native";
import { router } from "expo-router";
import { Spacing } from "../../constants/spacing";
import { BrandIcon } from "../icons";
import { AppText } from "./AppText";

const BACK_HIT_SLOP = 10;
const SIDE_WIDTH = 40; // matches the back button's footprint, keeps title centered

type AppHeaderProps = Readonly<{
  title: string;
  onBack?: () => void;
}>;

export const AppHeader = ({ title, onBack }: AppHeaderProps) => {
  const { colors } = useAppTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container]}>
      {onBack ? (
        <Pressable
          onPress={handleBack}
          hitSlop={BACK_HIT_SLOP}
          style={styles.side}
        >
          <BrandIcon name="arrowLeftLine" />
        </Pressable>
      ) : (
        <View style={styles.side} />
      )}
      <AppText
        typographyType="title1"
        weight="bold"
        style={[styles.title]}
        color={colors.textPrimary}
      >
        {title}
      </AppText>
      <View style={styles.side} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.s5,
    paddingVertical: Spacing.s3,
    gap: Spacing.s5,
    height: 48,
  },
  side: {
    width: SIDE_WIDTH,
  },
  title: {
    flex: 1,
    textAlign: "center",
  },
});
