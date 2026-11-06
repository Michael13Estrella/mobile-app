/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-06
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AppButton } from "../../../../src/components/common/AppButton";
import { AppHeader } from "../../../../src/components/common/AppHeader";
import { AppRichText } from "../../../../src/components/common/AppRichText";
import { AppScreen } from "../../../../src/components/common/AppScreen";
import { AppText } from "../../../../src/components/common/AppText";
import { AppTextButton } from "../../../../src/components/common/AppTextButton";
import {
  StatusIcon,
  StatusIconType,
} from "../../../../src/components/common/StatusIcon";
import {
  BENEFICIARY_REVIEW_RESULT,
  BeneficiaryReviewResult,
} from "../../../../src/constants/beneficiary";
import { ROUTES } from "../../../../src/constants/routes";
import { Spacing } from "../../../../src/constants/spacing";
import { useAppTheme } from "../../../../src/hooks/useAppTheme";
import { useBeneficiaryDetails } from "../../../../src/hooks/useBeneficiaryDetails";
import { useTranslation } from "../../../../src/hooks/useTranslation";
import { TranslationKey } from "../../../../src/types";
import { getBeneficiaryFullName } from "../../../../src/utils/beneficiary/beneficiary";
import { BeneficiaryReviewCard } from "../../../../src/components/features/beneficiary/review/BeneficiaryReviewCard";

// What each review result shows above the summary
const RESULT_CONTENT = {
  [BENEFICIARY_REVIEW_RESULT.APPROVED]: {
    status: "success",
    titleKey: "addBeneficiary.reviewResult.approved.title",
    messageKey: "addBeneficiary.reviewResult.approved.message",
  },
  [BENEFICIARY_REVIEW_RESULT.DENIED]: {
    status: "failed",
    titleKey: "addBeneficiary.reviewResult.denied.title",
    messageKey: "addBeneficiary.reviewResult.denied.message",
  },
} as const satisfies Record<
  BeneficiaryReviewResult,
  {
    status: StatusIconType;
    titleKey: TranslationKey;
    messageKey: TranslationKey;
  }
>;

// Opened by tapping a "Beneficiary approved" or "denied" push notification
export default function BeneficiaryReviewResultScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { beneficiaryGuid, result } = useLocalSearchParams<{
    beneficiaryGuid: string;
    result: BeneficiaryReviewResult;
  }>();
  const { data, isLoading, refresh } = useBeneficiaryDetails(beneficiaryGuid);
  const beneficiary = data?.beneficiary;

  // Only an explicit "approved" shows the success state
  const isApproved = result === BENEFICIARY_REVIEW_RESULT.APPROVED;
  const content =
    RESULT_CONTENT[
      isApproved
        ? BENEFICIARY_REVIEW_RESULT.APPROVED
        : BENEFICIARY_REVIEW_RESULT.DENIED
    ];

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator color={colors.primary} />;
    }

    // Failed to load, or the beneficiary was deleted after the push was sent
    if (!beneficiary) {
      return (
        <AppText
          typographyType="body2"
          color={colors.textSecondary}
          style={styles.centered}
        >
          {t("beneficiaryDetails.loadError")}
        </AppText>
      );
    }

    return (
      <>
        <View style={styles.status}>
          <StatusIcon status={content.status} />
          <AppText
            typographyType="h4"
            color={colors.textPrimary}
            style={styles.centered}
          >
            {t(content.titleKey)}
          </AppText>
          <AppRichText
            text={t(content.messageKey, {
              name: getBeneficiaryFullName(beneficiary),
            })}
            typographyType="body2"
            color={colors.textPrimary}
            style={styles.centered}
          />
        </View>

        <BeneficiaryReviewCard
          beneficiary={beneficiary}
          payout={data.payouts.at(0)}
        />
      </>
    );
  };

  return (
    <AppScreen
      gradient
      contentGap={Spacing.s7}
      onRefresh={refresh}
      header={<AppHeader title={t("addBeneficiary.submitted.headerTitle")} />}
      footer={
        <View style={styles.footer}>
          {beneficiary &&
            (isApproved ? (
              <AppButton
                label={t("beneficiaryDetails.sendMoney")}
                variant="gradient"
                icon="bankNote01Line"
                // TODO: open Send Money for this beneficiary
                onPress={() => {}}
              />
            ) : (
              <AppButton
                label={t("common.contactUs")}
                variant="gradient"
                // TODO: open the contact channel
                onPress={() => {}}
              />
            ))}
          {/* Always here: the header has no back arrow */}
          <AppTextButton
            label={t("common.goToDashboard")}
            size="button1"
            align="center"
            onPress={() => router.dismissTo(ROUTES.HOME)}
          />
        </View>
      }
    >
      {renderContent()}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  status: {
    alignItems: "center",
    gap: Spacing.s4,
  },
  centered: {
    textAlign: "center",
  },
  footer: {
    gap: Spacing.s3,
  },
});
