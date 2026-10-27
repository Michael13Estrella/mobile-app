/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-22
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { BeneficiaryPayoutType } from "../../../../../src/constants/payout";
import { useTranslation } from "../../../../../src/hooks/useTranslation";
import { Spacing } from "../../../../../src/constants/spacing";
import { PayoutMethodPicker } from "../../../../../src/components/features/beneficiary/payout/PayoutMethodPicker";
import { ADD_BENEFICIARY_PAYOUT_ROUTES } from "../../../../../src/constants/routes";

export default function SelectPayoutMethodScreen() {
  const { t } = useTranslation();

  const handleNext = (payoutType: BeneficiaryPayoutType) => {
    const route = ADD_BENEFICIARY_PAYOUT_ROUTES[payoutType];
    if (route) router.push(route);
  };

  return (
    <PayoutMethodPicker title={t("addBeneficiary.title")} onNext={handleNext} />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.s3,
  },
  options: {
    gap: Spacing.s5,
  },
});
