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
import {
  BeneficiaryPayoutType,
  PAYOUT_TYPE,
} from "../../../../../src/constants/payout";
import { useTranslation } from "../../../../../src/hooks/useTranslation";
import { Spacing } from "../../../../../src/constants/spacing";
import { PayoutMethodPicker } from "../../../../../src/components/features/beneficiary/payout/PayoutMethodPicker";
import { ROUTES } from "../../../../../src/constants/routes";

export default function SelectPayoutMethodScreen() {
  const { t } = useTranslation();

  const handleNext = (payoutType: BeneficiaryPayoutType) => {
    if (payoutType === PAYOUT_TYPE.METROBANK_ACCOUNT) {
      router.push(ROUTES.ADD_BENEFICIARY_METROBANK_ACCOUNT);
    }
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
