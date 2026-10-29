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

import { OtherBankAccountFormValues } from "../../../../src/schemas/payout/otherBankAccountSchema";
import {
  toCreateOtherBankPayout,
  toOtherBankPayoutSummary,
} from "../../../../src/utils/beneficiary/payout";
import { OtherBankAccountForm } from "../../../../src/components/features/beneficiary/payout/OtherBankAccountForm";
import { useAddPayoutFlow } from "../../../../src/hooks/useAddPayoutFlow";

// Add Beneficiary, after "Other bank account / e-wallet" was picked: the account details
export default function AddOtherBankAccountScreen() {
  const { title, submitLabel, isSubmitting, submit } = useAddPayoutFlow();

  const handleSubmit = (
    values: OtherBankAccountFormValues,
    bankName: string,
  ) => {
    const payout = toCreateOtherBankPayout(values);
    const summary = toOtherBankPayoutSummary(payout, bankName);
    void submit(payout, summary);
  };

  return (
    <OtherBankAccountForm
      title={title}
      submitLabel={submitLabel}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
}
