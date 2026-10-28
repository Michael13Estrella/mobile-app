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

import { router } from "expo-router";
import { CashPickupGuide } from "../../../../../src/components/features/beneficiary/payout/CashPickupGuide";
import { useTranslation } from "../../../../../src/hooks/useTranslation";
import { useAppDispatch } from "../../../../../src/store";
import { setBeneficiaryPayout } from "../../../../../src/store/slices/addBeneficiarySlice";
import {
  toCashPickupPayoutSummary,
  toCreateCashPickupPayout,
} from "../../../../../src/utils/beneficiary/payout";
import { ROUTES } from "../../../../../src/constants/routes";

// Add Beneficiary, after "Cash pick-up" was picked: how it works, then Next
export default function AddCashPickupScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleNext = () => {
    dispatch(
      setBeneficiaryPayout({
        payout: toCreateCashPickupPayout(),
        summary: toCashPickupPayoutSummary(
          t("addPayoutMethod.options.cashPickup.title"),
        ),
      }),
    );

    router.push(ROUTES.ADD_BENEFICIARY_CONFIRM);
  };

  return (
    <CashPickupGuide
      title={t("addBeneficiary.title")}
      submitLabel={t("common.next")}
      onNext={handleNext}
    />
  );
}
