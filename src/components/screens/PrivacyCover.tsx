import { StyleSheet, View } from "react-native";
import { AppLogo } from "../common/AppLogo";
import { Palette } from "../../constants/palette";

export const PrivacyCover = () => (
  <View style={styles.cover}>
    <AppLogo onDark />
  </View>
);

const styles = StyleSheet.create({
  cover: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Palette.mbBlue600,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
    elevation: 200,
  },
});
