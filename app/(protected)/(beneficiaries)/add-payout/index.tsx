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

import { router } from "expo-router";
import { BeneficiaryPayoutType } from "../../../../src/constants/payout";
import { useTranslation } from "../../../../src/hooks/useTranslation";
import { PayoutMethodPicker } from "../../../../src/components/features/beneficiary/payout/PayoutMethodPicker";
import { ADD_PAYOUT_ROUTES } from "../../../../src/constants/routes";

export default function SelectPayoutMethodScreen() {
  const { t } = useTranslation();

  const handleNext = (payoutType: BeneficiaryPayoutType) => {
    const route = ADD_PAYOUT_ROUTES[payoutType];
    if (route) router.push(route);
  };

  return (
    <PayoutMethodPicker title={t("addBeneficiary.title")} onNext={handleNext} />
  );
}
