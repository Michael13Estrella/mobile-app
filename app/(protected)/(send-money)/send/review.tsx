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

import { router } from "expo-router";
import { SendMoneyReview } from "../../../../src/components/features/remittance/SendMoneyReview";
import { useAppDispatch, useAppSelector } from "../../../../src/store";
import {
  SendMoneyConfirmationInput,
  setSendMoneyConfirmation,
} from "../../../../src/store/slices/sendMoneySlice";
import { ROUTES } from "../../../../src/constants/routes";

// Send Money's "All Good?": after the form (or Additional Details), before
// the remittance is sent
export default function SendMoneyReviewScreen() {
  const dispatch = useAppDispatch();
  const { form, beneficiary, payout, quotedRate, companyDetails } =
    useAppSelector((s) => s.sendMoney);
  const wallet = useAppSelector((s) => s.dashboard.wallet);

  // Only reachable through the Send Money form's Next, which sets the draft
  if (!form || !beneficiary || !payout) return null;

  // Kept what was shown, then the email OTP before sending
  const handleConfirm = (confirmation: SendMoneyConfirmationInput) => {
    dispatch(setSendMoneyConfirmation(confirmation));
    router.push(ROUTES.SEND_MONEY_VERIFY);
  };

  return (
    <SendMoneyReview
      form={form}
      beneficiary={beneficiary}
      payout={payout}
      quotedRate={quotedRate}
      companyDetails={companyDetails}
      walletBalance={wallet?.currentBalance ?? null}
      onConfirm={handleConfirm}
    />
  );
}
