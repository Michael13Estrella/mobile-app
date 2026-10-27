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

import { useEffect, useState } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { router, Stack } from "expo-router";
import { AppButton } from "../../../../src/components/common/AppButton";
import { AppHeader } from "../../../../src/components/common/AppHeader";
import { AppScreen } from "../../../../src/components/common/AppScreen";
import { AppText } from "../../../../src/components/common/AppText";
import { StatusIcon } from "../../../../src/components/common/StatusIcon";
import { AddBeneficiarySheet } from "../../../../src/components/features/beneficiary/AddBeneficiarySheet";
import { SubmittedBeneficiaryCard } from "../../../../src/components/features/beneficiary/confirm/SubmittedBeneficiaryCard";
import { ROUTES } from "../../../../src/constants/routes";
import { Spacing } from "../../../../src/constants/spacing";
import { useAppTheme } from "../../../../src/hooks/useAppTheme";
import { useTranslation } from "../../../../src/hooks/useTranslation";
import { useAppSelector } from "../../../../src/store";
import { getNewBeneficiaryName } from "../../../../src/utils/beneficiary/beneficiary";

// Leaves the finished flow: its screens close, which also clears the draft
const goToDashboard = () => router.dismissTo(ROUTES.HOME);

// Add Beneficiary, after a successful Submit: the beneficiary is now being
// reviewed; there's no going back to the forms
export default function BeneficiarySubmittedScreen() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const details = useAppSelector((s) => s.addBeneficiary.details);
  const payout = useAppSelector((s) => s.addBeneficiary.payout);
  const payoutSummary = useAppSelector((s) => s.addBeneficiary.payoutSummary);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  // Android back: the beneficiary is already saved, so it leaves the flow
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        goToDashboard();
        return true;
      },
    );
    return () => subscription.remove();
  }, []);

  if (!details || !payout || !payoutSummary) return null;

  return (
    <>
      {/* No swipe back to the forms (the header has no back arrow either) */}
      <Stack.Screen options={{ gestureEnabled: false }} />

      <AppScreen
        gradient
        contentGap={Spacing.s7}
        header={<AppHeader title={t("addBeneficiary.submitted.headerTitle")} />}
        footer={
          <AppButton
            label={t("common.goToDashboard")}
            variant="gradient"
            onPress={goToDashboard}
          />
        }
      >
        <View style={styles.status}>
          <StatusIcon status="pending" />
          <AppText
            typographyType="h4"
            color={colors.textPrimary}
            style={styles.centered}
          >
            {t("addBeneficiary.submitted.title")}
          </AppText>
          <AppText
            typographyType="body2"
            color={colors.textPrimary}
            style={styles.centered}
          >
            {t("addBeneficiary.submitted.message", {
              name: getNewBeneficiaryName(details),
            })}
          </AppText>
        </View>

        <SubmittedBeneficiaryCard
          details={details}
          payout={payout}
          payoutSummary={payoutSummary}
        />

        {/* <AppCard variant="elevated">
          <AppTextButton
            label={t("addBeneficiary.submitted.addAnother")}
            icon="plusLine"
            align="center"
            onPress={() => setIsAddSheetOpen(true)}
          />
        </AppCard> */}
        <AppButton
          label={t("addBeneficiary.submitted.addAnother")}
          variant="elevated"
          icon="plusLine"
          onPress={() => setIsAddSheetOpen(true)}
        />
      </AppScreen>

      <AddBeneficiarySheet
        visible={isAddSheetOpen}
        onSelect={(category) => {
          setIsAddSheetOpen(false);
          // A fresh start: Home with the new form on top
          router.dismissTo(ROUTES.HOME);
          router.push(ROUTES.ADD_BENEFICIARY(category));
        }}
        onClose={() => setIsAddSheetOpen(false)}
      />
    </>
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
});
