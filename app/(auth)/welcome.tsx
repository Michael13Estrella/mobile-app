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

import React from "react";
import { StyleSheet, View, TouchableOpacity, StatusBar } from "react-native";
import { Text } from "react-native-paper";
import { router } from "expo-router";
import { AppButton } from "../../src/components/common/AppButton";
import { useAuth } from "../../src/hooks/useAuth";
import { Typography } from "../../src/constants/typography";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { OldPalette } from "../../src/constants/colors";
import { useTranslation } from "../../src/hooks/useTranslation";
import { useAppDispatch } from "../../src/store";
import { clearRegistration } from "../../src/store/slices/registrationSlice";
import { useAppTheme } from "../../src/hooks/useAppTheme";
import { APP } from "../../src/constants/app";
import { Spacing } from "../../src/constants/spacing";
import { ExchangeRateCard } from "../../src/components/common/ExchangeRateCard";
import { AppScreen } from "../../src/components/common/AppScreen";
import { Palette } from "../../src/constants/palette";

export default function WelcomeScreen() {
  const { login, isLoading, error } = useAuth();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // Single entry point: try biometrics first when available,
  // otherwise (or on cancel / invalidated key) fall back to the OIDC flow.
  const handleLogin = async () => {
    const res = await login();

    if (res.status === "otp" && res.txId) {
      router.replace({ pathname: "/(auth)/otp", params: { txId: res.txId } });
      return;
    }

    // failure/cancel: login() already dispatched the error. Force a return to
    // welcome in case the OIDC deep-link race left us stranded on callback's
    // AuthLoadingOverlay with nothing else to navigate away from it.
    router.replace("/(auth)/welcome");
  };

  const handleCreateAccount = () => {
    dispatch(clearRegistration()); // wipe any abandoned data
    router.push("/(auth)/(register)/login-info");
  };

  return (
    <AppScreen gradient>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Top right menu */}
      <View style={[styles.topBar]}>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialCommunityIcons
            name="cog"
            size={28}
            color={OldPalette.white}
            onPress={() => {
              router.push("/(auth)/settings");
            }}
          />
        </TouchableOpacity>
      </View>

      {/* Center Logo */}
      <View style={styles.logoContainer}>
        <Text style={[styles.logoText, { color: colors.textBrandPrimary }]}>
          {APP.NAME}
        </Text>
        <Text style={styles.version}>Version {APP.VERSION}</Text>
      </View>

      <ExchangeRateCard />

      {/* Bottom Buttons */}
      <View style={[styles.bottomContainer]}>
        {/* Error message */}
        {!!error && (
          <View style={styles.errorBanner}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={16}
              color={OldPalette.red400}
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <AppButton
          label={t("common.login")}
          onPress={handleLogin}
          loading={isLoading}
          variant="gradient"
        />

        <AppButton
          label={t("common.signUp")}
          onPress={handleCreateAccount}
          variant="gradientOutline"
        />

        {/* TEMP dev-only shortcut to the preview route */}
        {__DEV__ && (
          <AppButton
            label="Preview (dev)"
            variant="ghost"
            onPress={() => router.push("/preview")}
          />
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  menuButton: {
    padding: 8,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.s3,
  },
  logoText: {
    fontSize: Typography.sizes.xxxxl,
    fontWeight: Typography.weights.bold,
  },
  version: {
    fontSize: Typography.sizes.xs,
    opacity: 0.8,
  },
  bottomContainer: {
    marginTop: Spacing.s9,
    paddingHorizontal: Spacing.s0,
    gap: Spacing.s3,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: `${OldPalette.red400}33`,
    borderWidth: 1,
    borderColor: OldPalette.red400,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  errorText: {
    color: Palette.sysRed500,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    flex: 1,
  },
});
