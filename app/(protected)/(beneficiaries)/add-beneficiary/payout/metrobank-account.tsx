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

import { MetrobankAccountForm } from "../../../../../src/components/features/beneficiary/payout/MetrobankAccountForm";
import { useTranslation } from "../../../../../src/hooks/useTranslation";
import { MetrobankAccountFormValues } from "../../../../../src/schemas/payout/metrobankAccountSchema";
import { useAppDispatch } from "../../../../../src/store";
import { setBeneficiaryPayout } from "../../../../../src/store/slices/addBeneficiarySlice";
import { toCreateMetrobankPayout } from "../../../../../src/utils/beneficiary/payout";

// Add Beneficiary, after "Metrobank account" was picked: the account details
export default function AddMetrobankAccountScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleSubmit = (values: MetrobankAccountFormValues) => {
    dispatch(setBeneficiaryPayout(toCreateMetrobankPayout(values)));
  };

  return (
    <MetrobankAccountForm
      title={t("addBeneficiary.title")}
      submitLabel={t("common.next")}
      onSubmit={handleSubmit}
    />
  );
}
