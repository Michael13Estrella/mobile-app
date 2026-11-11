/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { router, useLocalSearchParams } from "expo-router";
import { SendMoneyForm } from "../../../../src/components/features/remittance/SendMoneyForm";
import { useAppDispatch } from "../../../../src/store";
import { SendMoneySubmission } from "../../../../src/schemas/remittance/sendMoneySchema";
import { setSendMoneyForm } from "../../../../src/store/slices/sendMoneySlice";
import { needsCompanyDetails } from "../../../../src/utils/remittance/quote";
import { ROUTES } from "../../../../src/constants/routes";

// Send Money: who to send to, how, and how much. Opened from the tab (nothing
// picked) or from a beneficiary's screen (that beneficiary picked).
export default function SendMoneyScreen() {
  const { beneficiaryGuid } = useLocalSearchParams<{
    beneficiaryGuid?: string;
  }>();

  const dispatch = useAppDispatch();

  // Saves the draft, then Additional Details (from COMPANY_DETAILS_MIN_AMOUNT)
  // or straight to Review
  const handleSubmit = (submission: SendMoneySubmission) => {
    dispatch(setSendMoneyForm(submission));
    router.push(
      needsCompanyDetails(submission.form.amount)
        ? ROUTES.SEND_MONEY_COMPANY_DETAILS
        : ROUTES.SEND_MONEY_REVIEW,
    );
  };

  return (
    <SendMoneyForm
      initialBeneficiaryGuid={beneficiaryGuid}
      onSubmit={handleSubmit}
    />
  );
}
