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

import { useTranslation } from "./useTranslation";
import { useAppDispatch } from "../store";
import { BeneficiaryPayout } from "../types";
import { useState } from "react";
import { payoutService } from "../services/payout/payoutService";
import { showToast } from "../store/slices/uiSlice";

/**
 * Deleting a saved beneficiary's payout method, after a confirmation:
 * askToDelete opens it, confirmDelete deletes, then a toast tells how it
 * went.
 *
 * @param beneficiaryGuid - The beneficiary the payouts belong to
 * @param onDeleted - Reloads the payouts after a delete
 * @returns The payout being asked about, whether the confirmation is open
 * or deleting, and the actions
 * @example const deletePayout = useDeletePayout(beneficiaryGuid, refresh);
 */

export function useDeletePayout(
  beneficiaryGuid: string,
  onDeleted: () => Promise<unknown>,
) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // Kept after closing, so the sheet's texts stay while it slides out
  const [payout, setPayout] = useState<BeneficiaryPayout | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const askToDelete = (target: BeneficiaryPayout) => {
    setPayout(target);
    setIsOpen(true);
  };

  const cancelDelete = () => setIsOpen(false);

  const confirmDelete = async () => {
    if (!payout) return;

    setIsDeleting(true);
    const result = await payoutService.deletePayout(
      beneficiaryGuid,
      payout.payoutId,
    );
    setIsDeleting(false);
    // Closed either way: the toast (under the header) tells how it went
    setIsOpen(false);

    if (!result.ok) {
      dispatch(
        showToast({
          message: result.message ?? t("errors.generic"),
          variant: "error",
        }),
      );
      return;
    }

    dispatch(
      showToast({
        message: t("beneficiaryDetails.deletePayout.deleted"),
        variant: "success",
      }),
    );
    await onDeleted();
  };

  return {
    payout,
    isOpen,
    isDeleting,
    askToDelete,
    cancelDelete,
    confirmDelete,
  };
}
