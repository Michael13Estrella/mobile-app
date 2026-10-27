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
import { useTranslation } from "../../../../../src/hooks/useTranslation";
import { OtherBankAccountFormValues } from "../../../../../src/schemas/payout/otherBankAccountSchema";
import { useAppDispatch } from "../../../../../src/store";
import { setBeneficiaryPayout } from "../../../../../src/store/slices/addBeneficiarySlice";
import {
  toCreateOtherBankPayout,
  toOtherBankPayoutSummary,
} from "../../../../../src/utils/beneficiary/payout";
import { ROUTES } from "../../../../../src/constants/routes";
import { OtherBankAccountForm } from "../../../../../src/components/features/beneficiary/payout/OtherBankAccountForm";

// Add Beneficiary, after "Other bank account / e-wallet" was picked: the account details
export default function AddOtherBankAccountScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleSubmit = (
    values: OtherBankAccountFormValues,
    bankName: string,
  ) => {
    const payout = toCreateOtherBankPayout(values);
    const summary = toOtherBankPayoutSummary(payout, bankName);
    dispatch(setBeneficiaryPayout({ payout, summary }));

    router.push(ROUTES.ADD_BENEFICIARY_CONFIRM);
  };

  return (
    <OtherBankAccountForm
      title={t("addBeneficiary.title")}
      submitLabel={t("common.next")}
      onSubmit={handleSubmit}
    />
  );
}
