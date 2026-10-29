/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-23
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { MetrobankAccountForm } from "../../../../src/components/features/beneficiary/payout/MetrobankAccountForm";
import { MetrobankAccountFormValues } from "../../../../src/schemas/payout/metrobankAccountSchema";
import {
  toCreateMetrobankPayout,
  toMetrobankPayoutSummary,
} from "../../../../src/utils/beneficiary/payout";
import { useAddPayoutFlow } from "../../../../src/hooks/useAddPayoutFlow";

// Add Beneficiary, after "Metrobank account" was picked: the account details
export default function AddMetrobankAccountScreen() {
  const { title, submitLabel, isSubmitting, submit } = useAddPayoutFlow();

  const handleSubmit = (values: MetrobankAccountFormValues) => {
    const payout = toCreateMetrobankPayout(values);
    const summary = toMetrobankPayoutSummary(payout);
    void submit(payout, summary);
  };

  return (
    <MetrobankAccountForm
      title={title}
      submitLabel={submitLabel}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
}
