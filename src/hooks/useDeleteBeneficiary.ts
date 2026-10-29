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

import { useState } from "react";
import { useAppDispatch } from "../store";
import { useTranslation } from "./useTranslation";
import { beneficiaryService } from "../services/beneficiary/beneficiaryService";
import { showToast, showToastOnNextScreen } from "../store/slices/uiSlice";
import { router } from "expo-router";
import { ROUTES } from "../constants/routes";

/**
 * Deleting a saved beneficiary, after a confirmation: askToDelete opens
 * it, confirmDelete deletes, then the app goes back to where the user came
 * from (the list or Home), which shows "Beneficiary deleted".
 *
 * @param beneficiaryGuid - The beneficiary to delete
 * @param beneficiaryName - Their full name, for the "deleted" toast
 * @returns Whether the confirmation is open or deleting, and the actions
 * @example const deleteBeneficiary = useDeleteBeneficiary(beneficiaryGuid, name);
 */
export function useDeleteBeneficiary(
  beneficiaryGuid: string,
  beneficiaryName: string,
) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const askToDelete = () => setIsOpen(true);
  const cancelDelete = () => setIsOpen(false);

  const confirmDelete = async () => {
    setIsDeleting(true);
    const result = await beneficiaryService.deleteBeneficiary(beneficiaryGuid);
    setIsDeleting(false);
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

    // Shown by the screen it goes back to (which also reloads its list)
    dispatch(
      showToastOnNextScreen({
        title: t("beneficiaryDetails.deleteBeneficiary.deleted.title"),
        message: t("beneficiaryDetails.deleteBeneficiary.deleted.message", {
          name: beneficiaryName,
        }),
        variant: "success",
      }),
    );
    // Opened from a link, there may be nothing to go back to
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(ROUTES.MANAGE_BENEFICIARIES);
    }
  };

  return { isOpen, isDeleting, askToDelete, cancelDelete, confirmDelete };
}
