/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-17
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { router, useLocalSearchParams } from "expo-router";
import { useAppTheme } from "../../../../src/hooks/useAppTheme";
import { useTranslation } from "../../../../src/hooks/useTranslation";
import { useEnrolledBillers } from "../../../../src/hooks/useEnrolledBillers";
import { AppText } from "../../../../src/components/common/AppText";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { Spacing } from "../../../../src/constants/spacing";
import { BeneficiaryProfile } from "../../../../src/components/features/beneficiary/BeneficiaryProfile";
import { BillerDetailsCard } from "../../../../src/components/features/biller/BillerDetailsCard";
import { AppButton } from "../../../../src/components/common/AppButton";
import { AppScreen } from "../../../../src/components/common/AppScreen";
import { AppHeader } from "../../../../src/components/common/AppHeader";
import { ROUTES } from "../../../../src/constants/routes";
import { useDeleteBiller } from "../../../../src/hooks/useDeleteBiller";
import { BrandIcon } from "../../../../src/components/icons";
import { AppConfirmSheet } from "../../../../src/components/common/AppConfirmSheet";

const ACTION_HIT_SLOP = Spacing.s3;

// Biller Information: from an Enrolled Billers row.
export default function BillerDetailsScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { beneficiaryGuid } = useLocalSearchParams<{
    beneficiaryGuid: string;
  }>();
  const { billers, isLoading, refresh } = useEnrolledBillers();
  const biller = billers?.find(
    (item) => item.beneficiaryGuid === beneficiaryGuid,
  );

  const deleteBiller = useDeleteBiller(
    beneficiaryGuid,
    biller?.bpSubscriberName ?? "",
  );

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator color={colors.primary} />;
    }

    // Couldn't load, or no longer enrolled
    if (!biller) {
      return (
        <AppText
          typographyType="body2"
          color={colors.textSecondary}
          style={styles.state}
        >
          {t("billerDetails.loadError")}
        </AppText>
      );
    }

    return (
      <>
        <BeneficiaryProfile
          initials={biller.nameInitial}
          name={biller.bpSubscriberName}
        />
        <BillerDetailsCard biller={biller} />
      </>
    );
  };

  const deleteAction = biller && (
    <Pressable
      onPress={deleteBiller.askToDelete}
      hitSlop={ACTION_HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={t("common.delete")}
      style={styles.headerAction}
    >
      <BrandIcon name="trash03Line" color={colors.iconError} />
    </Pressable>
  );

  const footer = biller && (
    <AppButton
      label={t("billerDetails.payBill")}
      variant="gradient"
      icon="receiptCheckLine"
      onPress={() => router.push(ROUTES.PAY_BILL(biller.beneficiaryGuid))}
    />
  );

  return (
    <AppScreen
      gradient
      contentGap={Spacing.s7}
      onRefresh={refresh}
      header={
        <AppHeader
          title={t("billerDetails.title")}
          onBack={() => router.back()}
          right={deleteAction}
        />
      }
      footer={footer}
    >
      {renderContent()}

      {biller && (
        <AppConfirmSheet
          visible={deleteBiller.isOpen}
          title={t("billerDetails.delete.title", {
            biller: biller.bpSubscriberName,
          })}
          message={t("billerDetails.delete.message")}
          confirmLabel={t("common.delete")}
          cancelLabel={t("billerDetails.delete.keep")}
          isConfirming={deleteBiller.isDeleting}
          onConfirm={deleteBiller.confirmDelete}
          onCancel={deleteBiller.cancelDelete}
        />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  state: {
    textAlign: "center",
    marginTop: Spacing.s9,
  },
  headerAction: {
    alignSelf: "flex-end",
  },
});
