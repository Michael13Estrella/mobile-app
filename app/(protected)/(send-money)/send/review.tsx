/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-11
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { SendMoneyReview } from "../../../../src/components/features/remittance/SendMoneyReview";
import { useAppSelector } from "../../../../src/store";

// Send Money's "All Good?": after the form (or Additional Details), before
// the remittance is sent
export default function SendMoneyReviewScreen() {
  const { form, beneficiary, payout, companyDetails } = useAppSelector(
    (s) => s.sendMoney,
  );
  const wallet = useAppSelector((s) => s.dashboard.wallet);

  // Only reachable through the Send Money form's Next, which sets the draft
  if (!form || !beneficiary || !payout) return null;

  const handleConfirm = () => {};

  return (
    <SendMoneyReview
      form={form}
      beneficiary={beneficiary}
      payout={payout}
      companyDetails={companyDetails}
      walletBalance={wallet?.currentBalance ?? null}
      onConfirm={handleConfirm}
    />
  );
}
