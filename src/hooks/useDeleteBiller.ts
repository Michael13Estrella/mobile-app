/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-17
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useState } from "react";
import { useAppDispatch } from "../store";
import { useTranslation } from "./useTranslation";
import { billerService } from "../services/biller/billerService";
import { showToast, showToastOnNextScreen } from "../store/slices/uiSlice";
import { billerRemoved } from "../store/slices/dashboardSlice";
import { router } from "expo-router";
import { ROUTES } from "../constants/routes";

/**
 * Deleting an enrolled biller, after a confirmation: askToDelete opens it,
 * confirmDelete deletes, then the app goes back to Enrolled Billers, which
 * shows "Biller deleted".
 *
 * @param beneficiaryGuid - The biller to delete
 * @param billerName - Its name, for the "deleted" toast
 * @returns Whether the confirmation is open or deleting, and the actions
 * @example const deleteBiller = useDeleteBiller(beneficiaryGuid, name);
 */
export function useDeleteBiller(beneficiaryGuid: string, billerName: string) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const askToDelete = () => setIsOpen(true);
  const cancelDelete = () => setIsOpen(false);

  const confirmDelete = async () => {
    setIsDeleting(true);
    const result = await billerService.deleteBiller(beneficiaryGuid);
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

    dispatch(billerRemoved());
    dispatch(
      showToastOnNextScreen({
        title: t("billerDetails.delete.deleted.title"),
        message: t("billerDetails.delete.deleted.message", {
          biller: billerName,
        }),
        variant: "success",
      }),
    );
    // Opened from a link, there may be nothing to go back to
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(ROUTES.ENROLLED_BILLERS);
    }
  };

  return { isOpen, isDeleting, askToDelete, cancelDelete, confirmDelete };
}
