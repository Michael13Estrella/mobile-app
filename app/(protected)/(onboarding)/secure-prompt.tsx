import { useTranslation } from "../../../src/hooks/useTranslation";
import { StyleSheet, View, Image } from "react-native";
import { Typography } from "../../../src/constants/typography";
import { useAppTheme } from "../../../src/hooks/useAppTheme";
import { router } from "expo-router";
import { AppButton } from "../../../src/components/common/AppButton";
import { AppScreen } from "../../../src/components/common/AppScreen";
import { Spacing } from "../../../src/constants/spacing";
import { AppText } from "../../../src/components/common/AppText";

export default function SecurePromptScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  return (
    <AppScreen
      gradient
      footer={
        <AppButton
          label={t("onboarding.securePrompt.button")}
          variant="gradient"
          onPress={() => router.push("/(protected)/(onboarding)/set-pin")}
        />
      }
    >
      <View style={styles.container}>
        <AppText typographyType="h3" color={colors.textPrimary}>
          {t("onboarding.securePrompt.title")}
        </AppText>

        <Image
          source={require("../../../assets/images/illustrations/secure-your-transactions-with-app-key.png")}
        />

        <AppText
          typographyType="body2"
          weight="regular"
          color={colors.textPrimary}
        >
          {t("onboarding.securePrompt.subtitle")}
        </AppText>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.s8,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    textAlign: "center",
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    textAlign: "left",
    lineHeight: 18,
  },
  button: { width: "100%" },
});
