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

import { CashPickupGuide } from "../../../../src/components/features/beneficiary/payout/CashPickupGuide";
import { useTranslation } from "../../../../src/hooks/useTranslation";
import {
  toCashPickupPayoutSummary,
  toCreateCashPickupPayout,
} from "../../../../src/utils/beneficiary/payout";
import { useAddPayoutFlow } from "../../../../src/hooks/useAddPayoutFlow";

// Add Beneficiary, after "Cash pick-up" was picked: how it works, then Next
export default function AddCashPickupScreen() {
  const { t } = useTranslation();
  const { title, submitLabel, isSubmitting, submit } = useAddPayoutFlow();

  const handleNext = () => {
    void submit(
      toCreateCashPickupPayout(),
      toCashPickupPayoutSummary(t("addPayoutMethod.options.cashPickup.title")),
    );
  };

  return (
    <CashPickupGuide
      title={title}
      submitLabel={submitLabel}
      isSubmitting={isSubmitting}
      onNext={handleNext}
    />
  );
}
