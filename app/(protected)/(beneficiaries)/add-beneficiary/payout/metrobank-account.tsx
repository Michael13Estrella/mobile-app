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

import { router } from "expo-router";
import { MetrobankAccountForm } from "../../../../../src/components/features/beneficiary/payout/MetrobankAccountForm";
import { useTranslation } from "../../../../../src/hooks/useTranslation";
import { MetrobankAccountFormValues } from "../../../../../src/schemas/payout/metrobankAccountSchema";
import { useAppDispatch } from "../../../../../src/store";
import { setBeneficiaryPayout } from "../../../../../src/store/slices/addBeneficiarySlice";
import {
  toCreateMetrobankPayout,
  toMetrobankPayoutSummary,
} from "../../../../../src/utils/beneficiary/payout";
import { ROUTES } from "../../../../../src/constants/routes";

// Add Beneficiary, after "Metrobank account" was picked: the account details
export default function AddMetrobankAccountScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleSubmit = (values: MetrobankAccountFormValues) => {
    const payout = toCreateMetrobankPayout(values);
    const summary = toMetrobankPayoutSummary(payout);
    dispatch(setBeneficiaryPayout({ payout, summary }));

    router.push(ROUTES.ADD_BENEFICIARY_CONFIRM);
  };

  return (
    <MetrobankAccountForm
      title={t("addBeneficiary.title")}
      submitLabel={t("common.next")}
      onSubmit={handleSubmit}
    />
  );
}
