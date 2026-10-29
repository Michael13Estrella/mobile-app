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
import { PayoutMethodPicker } from "../../../../src/components/features/beneficiary/payout/PayoutMethodPicker";
import { useAddPayoutFlow } from "../../../../src/hooks/useAddPayoutFlow";

export default function SelectPayoutMethodScreen() {
  const { title, hideCashPickup, getPayoutRoute } = useAddPayoutFlow();

  const handleNext = (payoutType: BeneficiaryPayoutType) => {
    router.push(getPayoutRoute(payoutType));
  };

  return (
    <PayoutMethodPicker
      title={title}
      hideCashPickup={hideCashPickup}
      onNext={handleNext}
    />
  );
}
