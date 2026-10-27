/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-23
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { router } from "expo-router";
import { AppHeader } from "../../../../src/components/common/AppHeader";
import { AppScreen } from "../../../../src/components/common/AppScreen";
import { Spacing } from "../../../../src/constants/spacing";
import { useAppTheme } from "../../../../src/hooks/useAppTheme";
import { useTranslation } from "../../../../src/hooks/useTranslation";
import { useAppSelector } from "../../../../src/store";
import {
  getBeneficiaryCategory,
  getNewBeneficiaryName,
} from "../../../../src/utils/beneficiary/beneficiary";
import { AppText } from "../../../../src/components/common/AppText";
import { AppButton } from "../../../../src/components/common/AppButton";
import { BeneficiaryProfile } from "../../../../src/components/features/beneficiary/BeneficiaryProfile";
import { getInitials } from "../../../../src/utils/format/formatName";
import { ConfirmBeneficiaryCard } from "../../../../src/components/features/beneficiary/confirm/ConfirmBeneficiaryCard";
import {
  ADD_BENEFICIARY_PAYOUT_ROUTES,
  ROUTES,
} from "../../../../src/constants/routes";
import { StyleSheet, View } from "react-native";
import { ConfirmPayoutCard } from "../../../../src/components/features/beneficiary/confirm/ConfirmPayoutCard";
import { useState } from "react";
import { beneficiaryService } from "../../../../src/services/beneficiary/beneficiaryService";
import { AppToast } from "../../../../src/components/common/AppToast";

export default function ConfirmBeneficiaryScreen() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const details = useAppSelector((s) => s.addBeneficiary.details);
  const payout = useAppSelector((s) => s.addBeneficiary.payout);
  const payoutSummary = useAppSelector((s) => s.addBeneficiary.payoutSummary);

  const [isSubmitting, setIsSubmitting] = useState(false);
  // The failed save's message (the server's, or a generic one)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Only reachable through the form's Next, which sets the draft
  if (!details || !payout || !payoutSummary) return null;

  const name = getNewBeneficiaryName(details);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    const result = await beneficiaryService.createBeneficiary({
      beneficiary: details,
      payout,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setErrorMessage(result.message ?? t("errors.generic"));
      return;
    }

    // Replace (not push): this screen can't be returned to after saving
    router.replace(ROUTES.ADD_BENEFICIARY_SUBMITTED);
  };

  return (
    <AppScreen
      gradient
      contentGap={Spacing.s7}
      header={
        <AppHeader
          title={t("addBeneficiary.confirm.title")}
          onBack={() => router.back()}
        />
      }
      footer={
        <View style={styles.footer}>
          <AppText typographyType="body3" color={colors.textSecondary}>
            {t("addBeneficiary.confirm.reviewNote")}
          </AppText>
          <AppButton
            label={t("common.submit")}
            variant="gradient"
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={handleSubmit}
          />
        </View>
      }
    >
      <BeneficiaryProfile initials={getInitials(name)} name={name} />

      <ConfirmBeneficiaryCard
        details={details}
        onEdit={() =>
          router.dismissTo(
            ROUTES.ADD_BENEFICIARY(getBeneficiaryCategory(details)),
          )
        }
      />

      <ConfirmPayoutCard
        payout={payoutSummary}
        onEdit={() =>
          router.dismissTo(
            ADD_BENEFICIARY_PAYOUT_ROUTES[payout.payoutType] ??
              ROUTES.ADD_BENEFICIARY_SELECT_PAYOUT_METHOD,
          )
        }
      />

      <AppToast
        message={errorMessage ?? ""}
        variant="error"
        visible={!!errorMessage}
        onDismiss={() => setErrorMessage(null)}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: Spacing.s5,
  },
});
