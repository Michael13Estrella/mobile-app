/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-29
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Href, router, useLocalSearchParams } from "expo-router";
import { useAppDispatch } from "../store";
import { useTranslation } from "./useTranslation";
import { useState } from "react";
import { BeneficiaryPayoutType } from "../constants/payout";
import { ADD_PAYOUT_ROUTES, ROUTES } from "../constants/routes";
import { CreatePayoutRequest, PayoutSummary } from "../types";
import { setBeneficiaryPayout } from "../store/slices/addBeneficiarySlice";
import { payoutService } from "../services/payout/payoutService";
import { showToast, showToastOnNextScreen } from "../store/slices/uiSlice";

// Set when adding a payout to a saved beneficiary; absent in Add Beneficiary
type AddPayoutParams = Readonly<{
  beneficiaryGuid?: string;
  // "true" when they already have a cash pick-up
  hasCashPickup?: string;
}>;

/**
 * The payout screens (picker and each method) are shared by two flows:
 * - Add Beneficiary: the payout is kept as a draft, then Confirm opens,
 * - Add Payout (`beneficiaryGuid` param): the payout is saved to that
 *   beneficiary right away, then their page opens again with a toast (an
 *   error shows as a toast on the form).
 *
 * @returns The header title, button label, saving state, the route of a
 * payout method (keeping the flow), and the submit action
 * @example const { title, submitLabel, submit } = useAddPayoutFlow();
 */
export function useAddPayoutFlow() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { beneficiaryGuid, hasCashPickup } =
    useLocalSearchParams<AddPayoutParams>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAddingToSaved = !!beneficiaryGuid;

  // The method's screen, in the same flow as this one
  const getPayoutRoute = (payoutType: BeneficiaryPayoutType): Href =>
    beneficiaryGuid
      ? { pathname: ADD_PAYOUT_ROUTES[payoutType], params: { beneficiaryGuid } }
      : ADD_PAYOUT_ROUTES[payoutType];

  const submit = async (
    payout: CreatePayoutRequest,
    summary: PayoutSummary,
  ) => {
    if (!beneficiaryGuid) {
      dispatch(setBeneficiaryPayout({ payout, summary }));
      router.push(ROUTES.ADD_BENEFICIARY_CONFIRM);
      return;
    }

    setIsSubmitting(true);
    const result = await payoutService.addPayout(beneficiaryGuid, payout);
    setIsSubmitting(false);

    if (!result.ok) {
      // Stays on the form, so the user can fix it and save again
      dispatch(
        showToast({
          message: result.message ?? t("errors.generic"),
          variant: "error",
        }),
      );
      return;
    }

    // Shown by their page once it's back on screen (it also reloads its
    // payouts then)
    dispatch(
      showToastOnNextScreen({
        message: t("beneficiaryDetails.payoutAdded"),
        variant: "success",
      }),
    );
    router.dismissTo(ROUTES.BENEFICIARY_DETAILS(beneficiaryGuid));
  };

  return {
    title: t(
      isAddingToSaved ? "addPayoutMethod.headerTitle" : "addBeneficiary.title",
    ),
    submitLabel: t(isAddingToSaved ? "common.save" : "common.next"),
    isSubmitting,
    // Only one cash pick-up per beneficiary
    hideCashPickup: hasCashPickup === String(true),
    getPayoutRoute,
    submit,
  };
}
