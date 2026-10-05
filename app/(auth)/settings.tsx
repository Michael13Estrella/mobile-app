import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Text,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../src/store";
import { useAppTheme } from "../../src/hooks/useAppTheme";
import { useTranslation } from "../../src/hooks/useTranslation";
import { MenuRow } from "../../src/components/common/MenuRow";
import { Typography } from "../../src/constants/typography";
import { AppHeader } from "../../src/components/common/AppHeader";
import CountryFlag from "react-native-country-flag";
import { devReset } from "../../src/services/security/devReset";
import { useAuth } from "../../src/hooks/useAuth";
import { biometricService } from "../../src/services/security/biometricService";
import { IconName } from "../../src/types";

const LANG_OPTIONS = [
  { value: "en" as const, label: "English", isoCode: "US" },
  { value: "ja" as const, label: "日本語", isoCode: "JP" },
];

const THEME_CYCLE: Array<"light" | "dark" | "system"> = [
  "light",
  "dark",
  "system",
];

const THEME_ICONS: Record<string, IconName> = {
  light: "white-balance-sunny",
  dark: "weather-night",
  system: "theme-light-dark",
};

export default function SettingsScreen() {
  const { colors, isDark, setThemeMode } = useAppTheme();
  const themeMode = useAppSelector((state) => state.ui.themeMode);
  const { t, locale, setLocale } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user, enableBiometric, disableBiometric } = useAuth();

  const [langExpanded, setLangExpanded] = useState(false);
  const [themeExpanded, setThemeExpanded] = useState(false);

  const [bioSupported, setBioSupported] = useState(false);
  const [bioEnabled, setBioEnabled] = useState(false);
  const [bioBusy, setBioBusy] = useState(false);

  const THEME_LABEL: Record<string, string> = {
    light: t("settings.preferences.themeLabel.light"),
    dark: t("settings.preferences.themeLabel.dark"),
    system: t("settings.preferences.themeLabel.system"),
  };

  useEffect(() => {
    let active = true;
    (async () => {
      if (!user) {
        if (active) setBioSupported(false);
        return;
      }
      const { available } = await biometricService.isAvailable();
      const enabled =
        available && (await biometricService.canUseBiometricLogin(user.id));
      if (active) {
        setBioSupported(available);
        setBioEnabled(enabled);
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  const handleToggleBiometric = async (next: boolean) => {
    if (!user || bioBusy) return;
    setBioBusy(true);
    try {
      if (next) {
        const ok = await enableBiometric();
        setBioEnabled(ok);
      } else {
        await disableBiometric();
        setBioEnabled(false);
      }
    } finally {
      setBioBusy(false);
    }
  };

  const handleDevReset = async () => {
    await devReset(user ? [user.id] : []);
    router.replace("/(auth)/welcome");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.surface}
      />

      {/* Header */}
      <AppHeader title={t("settings.title")} onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Preferences */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t("settings.preferences.label")}
        </Text>
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <MenuRow
            icon="web"
            label={t("settings.preferences.language")}
            value={LANG_OPTIONS.find((l) => l.value === locale)?.label}
            onPress={() => setLangExpanded((v) => !v)}
            expanded={langExpanded}
          />

          {langExpanded && (
            <View
              style={[
                styles.langOptions,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderTopColor: colors.dividerVariant,
                },
              ]}
            >
              {LANG_OPTIONS.map((lang, i) => (
                <TouchableOpacity
                  key={lang.value}
                  style={[
                    styles.langRow,
                    i < LANG_OPTIONS.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.dividerVariant,
                    },
                  ]}
                  onPress={() => {
                    setLocale(lang.value);
                    setLangExpanded(false);
                  }}
                >
                  <CountryFlag
                    isoCode={lang.isoCode}
                    size={18}
                    style={styles.langFlag}
                  />
                  <Text
                    style={[styles.langLabel, { color: colors.textPrimary }]}
                  >
                    {lang.label}
                  </Text>
                  {locale === lang.value && (
                    <MaterialCommunityIcons
                      name="check"
                      size={18}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <MenuRow
            icon="palette-outline"
            label={t("settings.preferences.theme")}
            value={THEME_LABEL[themeMode]}
            onPress={() => setThemeExpanded((v) => !v)}
            expanded={themeExpanded}
            isLast={!themeExpanded}
          />

          {themeExpanded && (
            <View
              style={[
                styles.langOptions,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderTopColor: colors.dividerVariant,
                },
              ]}
            >
              {THEME_CYCLE.map((opt, i) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.langRow,
                    i < THEME_CYCLE.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.dividerVariant,
                    },
                  ]}
                  onPress={() => {
                    setThemeMode(opt);
                    setThemeExpanded(false);
                  }}
                >
                  <MaterialCommunityIcons
                    name={THEME_ICONS[opt]}
                    size={20}
                    color={
                      themeMode === opt ? colors.primary : colors.textSecondary
                    }
                  />
                  <Text
                    style={[styles.langLabel, { color: colors.textPrimary }]}
                  >
                    {THEME_LABEL[opt]}
                  </Text>
                  {themeMode === opt && (
                    <MaterialCommunityIcons
                      name="check"
                      size={18}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Support */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t("settings.support.label")}
        </Text>
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <MenuRow
            icon="help-circle-outline"
            label={t("settings.support.helpCenter")}
            onPress={() => {}}
          />
          <MenuRow
            icon="file-document-outline"
            label={t("settings.support.termsAndPolicies")}
            onPress={() => {}}
          />
          <MenuRow
            icon="information-outline"
            label={t("settings.support.aboutUs")}
            onPress={() => {}}
            isLast
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, alignItems: "flex-start" },
  headerTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
  },
  sectionLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 6,
    paddingHorizontal: 20,
  },
  section: {
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: "hidden",
  },
  langOptions: { borderTopWidth: 1 },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  langFlag: { fontSize: Typography.sizes.xl },
  langLabel: { flex: 1, fontSize: Typography.sizes.md },
});
