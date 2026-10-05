import { StyleSheet, View, Text } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";
import { OldPalette } from "../../constants/colors";
import { Typography } from "../../constants/typography";
import { AppLogo } from "../common/AppLogo";
import { ActivityIndicator } from "react-native-paper";
import { useEffect } from "react";

export const AuthLoadingOverlay = () => {
  useEffect(() => {
    if (__DEV__) console.log("OVERLAY MOUNTED");
    return () => {
      if (__DEV__) console.log("OVERLAY UNMOUNTED");
    };
  }, []);
  const { t } = useTranslation();
  return (
    <View style={styles.overlay}>
      <AppLogo onDark />
      <ActivityIndicator
        size="large"
        color={OldPalette.white}
        style={styles.spinner}
      />
      <Text style={styles.text}>{t("auth.signingIn")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: OldPalette.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    zIndex: 10,
    elevation: 10,
  },
  spinner: { marginTop: 16 },
  text: {
    color: OldPalette.white,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
});
