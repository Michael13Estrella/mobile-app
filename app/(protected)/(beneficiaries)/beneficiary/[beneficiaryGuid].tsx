/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-21
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { router, useLocalSearchParams } from "expo-router";
import { useAppTheme } from "../../../../src/hooks/useAppTheme";
import { useTranslation } from "../../../../src/hooks/useTranslation";
import { useBeneficiaryDetails } from "../../../../src/hooks/useBeneficiaryDetails";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { AppText } from "../../../../src/components/common/AppText";
import { Spacing } from "../../../../src/constants/spacing";
import { BeneficiaryDetailsCard } from "../../../../src/components/features/beneficiary/BeneficiaryDetailsCard";
import { AppScreen } from "../../../../src/components/common/AppScreen";
import { AppHeader } from "../../../../src/components/common/AppHeader";
import {
  getBeneficiaryFullName,
  getBeneficiaryShortName,
} from "../../../../src/utils/beneficiary/beneficiary";
import { BeneficiaryPayoutsCard } from "../../../../src/components/features/beneficiary/BeneficiaryPayoutsCard";
import { BrandIcon } from "../../../../src/components/icons";
import { AppButton } from "../../../../src/components/common/AppButton";
import { AppTextButton } from "../../../../src/components/common/AppTextButton";
import { BeneficiaryProfile } from "../../../../src/components/features/beneficiary/BeneficiaryProfile";
import { ROUTES } from "../../../../src/constants/routes";
import { AppConfirmSheet } from "../../../../src/components/common/AppConfirmSheet";
import { useDeletePayout } from "../../../../src/hooks/useDeletePayout";
import { getPayoutLabel } from "../../../../src/utils/beneficiary/payout";
import { PAYOUT_TYPE } from "../../../../src/constants/payout";
import { useDeleteBeneficiary } from "../../../../src/hooks/useDeleteBeneficiary";

// Extra touch area around the header's trash icon
const ACTION_HIT_SLOP = Spacing.s3;

export default function BeneficiaryDetailsScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { beneficiaryGuid } = useLocalSearchParams<{
    beneficiaryGuid: string;
  }>();
  const { data, isLoading, refresh } = useBeneficiaryDetails(beneficiaryGuid);
  const beneficiary = data?.beneficiary;

  const deleteBeneficiary = useDeleteBeneficiary(
    beneficiaryGuid,
    beneficiary ? getBeneficiaryFullName(beneficiary) : "",
  );
  const deletePayout = useDeletePayout(beneficiaryGuid, refresh);

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator color={colors.primary} />;
    }

    // Failed with nothing loaded yet (a failed refresh keeps the last details)
    if (!beneficiary) {
      return (
        <AppText
          typographyType="body2"
          color={colors.textSecondary}
          style={styles.state}
        >
          {t("beneficiaryDetails.loadError")}
        </AppText>
      );
    }

    return (
      <>
        <BeneficiaryProfile
          initials={beneficiary.nameInitial}
          name={getBeneficiaryFullName(beneficiary)}
        />

        <BeneficiaryDetailsCard beneficiary={beneficiary} />

        <BeneficiaryPayoutsCard
          payouts={data.payouts}
          onDeletePayout={deletePayout.askToDelete}
          onAddPayout={() =>
            router.push(
              ROUTES.ADD_PAYOUT_FOR_BENEFICIARY(
                beneficiaryGuid,
                data.payouts.some(
                  (payout) => payout.payoutType === PAYOUT_TYPE.CASH_PICKUP,
                ),
              ),
            )
          }
        />
      </>
    );
  };

  const deleteAction = beneficiary && (
    <Pressable
      onPress={deleteBeneficiary.askToDelete}
      hitSlop={ACTION_HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={t("common.delete")}
      style={styles.headerAction}
    >
      <BrandIcon name="trash03Line" color={colors.iconError} />
    </Pressable>
  );

  const footer = beneficiary && (
    <View style={styles.footer}>
      <AppButton
        label={t("beneficiaryDetails.sendMoney")}
        variant="gradient"
        icon="bankNote01Line"
        // TODO
        onPress={() => {}}
      />
      <AppTextButton
        label={t("beneficiaryDetails.editDetails")}
        size="button1"
        align="center"
        // TODO
        onPress={() => {}}
      />
    </View>
  );

  return (
    <AppScreen
      gradient
      contentGap={Spacing.s7}
      onRefresh={refresh}
      header={
        <AppHeader
          title={t("beneficiaryDetails.title")}
          onBack={() => router.back()}
          right={deleteAction}
        />
      }
      footer={footer}
    >
      {renderContent()}

      <AppConfirmSheet
        visible={deletePayout.isOpen}
        title={t("beneficiaryDetails.deletePayout.title")}
        message={t("beneficiaryDetails.deletePayout.message", {
          account: deletePayout.payout
            ? getPayoutLabel(deletePayout.payout)
            : "",
        })}
        confirmLabel={t("common.delete")}
        cancelLabel={t("beneficiaryDetails.deletePayout.keep")}
        isConfirming={deletePayout.isDeleting}
        onConfirm={() => void deletePayout.confirmDelete()}
        onCancel={deletePayout.cancelDelete}
      />

      {beneficiary && (
        <AppConfirmSheet
          visible={deleteBeneficiary.isOpen}
          title={t("beneficiaryDetails.deleteBeneficiary.title", {
            name: getBeneficiaryFullName(beneficiary),
          })}
          message={t("beneficiaryDetails.deleteBeneficiary.message", {
            nickname: getBeneficiaryShortName(beneficiary),
          })}
          confirmLabel={t("common.delete")}
          cancelLabel={t("beneficiaryDetails.deleteBeneficiary.keep")}
          isConfirming={deleteBeneficiary.isDeleting}
          onConfirm={() => void deleteBeneficiary.confirmDelete()}
          onCancel={deleteBeneficiary.cancelDelete}
        />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  profile: {
    alignItems: "center",
    gap: Spacing.s5,
  },
  name: {
    textAlign: "center",
  },
  state: {
    textAlign: "center",
    marginTop: Spacing.s9,
  },
  // Against the right edge, like the back arrow on the left
  headerAction: {
    alignSelf: "flex-end",
  },
  footer: {
    gap: Spacing.s3,
  },
});
