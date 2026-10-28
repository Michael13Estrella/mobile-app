/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-27
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useAppTheme } from "../../../../hooks/useAppTheme";
import { useTranslation } from "../../../../hooks/useTranslation";
import { Spacing } from "../../../../constants/spacing";
import { TranslationKey } from "../../../../types/translation.types";
import { AppScreen } from "../../../common/AppScreen";
import { AppHeader } from "../../../common/AppHeader";
import { AppButton } from "../../../common/AppButton";
import { AppCard } from "../../../common/AppCard";
import { AppText } from "../../../common/AppText";
import { PayoutPartnerGrid } from "./PayoutPartnerGrid";
import { AppAlert } from "../../../common/AppAlert";

const STEP_NUMBER_SIZE = 24;

// "How it works", in order
const HOW_IT_WORKS_STEPS = [
  "cashPickupGuide.steps.notify",
  "cashPickupGuide.steps.visit",
  "cashPickupGuide.steps.claim",
] as const satisfies readonly TranslationKey[];

type CashPickupGuideProps = Readonly<{
  // "Add Beneficiary" | "Add Payout Method"
  title: string;
  submitLabel: string;
  isSubmitting?: boolean;
  onNext: () => void;
}>;

type GuideStepProps = Readonly<{
  number: number;
  text: string;
}>;

// One "How it works" step: its number in a circle, then the text
function GuideStep({ number, text }: GuideStepProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.step}>
      <View
        style={[
          styles.stepNumber,
          { backgroundColor: colors.stepNumberBackground },
        ]}
      >
        <AppText
          typographyType="body2"
          weight="bold"
          color={colors.textBrandPrimary}
        >
          {number}
        </AppText>
      </View>
      <AppText
        typographyType="body3"
        color={colors.textPrimary}
        style={styles.stepText}
      >
        {text}
      </AppText>
    </View>
  );
}

/**
 * The cash pick-up guide: how the beneficiary claims the money, and where.
 * Cash pick-up has no details to fill in, so Next only confirms the choice.
 *
 * @example <CashPickupGuide title={t("addBeneficiary.title")} submitLabel={t("common.next")} onNext={handleNext} />
 */
export function CashPickupGuide({
  title,
  submitLabel,
  isSubmitting = false,
  onNext,
}: CashPickupGuideProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  return (
    <AppScreen
      gradient
      contentGap={Spacing.s7}
      header={<AppHeader title={title} onBack={() => router.back()} />}
      footer={
        <View style={styles.footer}>
          <AppAlert variant="info" message={t("cashPickupGuide.idNote")} />
          <AppButton
            label={submitLabel}
            variant="gradient"
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={onNext}
          />
        </View>
      }
    >
      {/* Intro */}
      <View style={styles.intro}>
        <AppText typographyType="h4" weight="bold" color={colors.textPrimary}>
          {t("cashPickupGuide.title")}
        </AppText>
        <AppText typographyType="body2" color={colors.textSecondary}>
          {t("cashPickupGuide.description")}
        </AppText>
      </View>

      {/* How it works */}
      <AppCard>
        <AppText
          typographyType="title1"
          weight="bold"
          color={colors.textPrimary}
        >
          {t("cashPickupGuide.howItWorks")}
        </AppText>
        {HOW_IT_WORKS_STEPS.map((key, index) => (
          <GuideStep key={key} number={index + 1} text={t(key)} />
        ))}
      </AppCard>

      {/* Payout partners */}
      <View style={styles.partners}>
        <AppText
          typographyType="overline2"
          weight="bold"
          color={colors.textSecondary}
          style={styles.uppercase}
        >
          {t("cashPickupGuide.partnersTitle")}
        </AppText>
        <PayoutPartnerGrid />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: Spacing.s3,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.s4,
  },
  stepNumber: {
    width: STEP_NUMBER_SIZE,
    height: STEP_NUMBER_SIZE,
    borderRadius: STEP_NUMBER_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  // Wraps next to the number instead of pushing it off screen
  stepText: {
    flex: 1,
  },
  partners: {
    gap: Spacing.s4,
  },
  footer: {
    gap: Spacing.s5,
  },
  // Uppercase by style, so the translations stay normal text
  uppercase: {
    textTransform: "uppercase",
  },
});
