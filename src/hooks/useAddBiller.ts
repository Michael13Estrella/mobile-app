/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useState } from "react";
import { useAppDispatch } from "../store";
import { useTranslation } from "./useTranslation";
import { AddBillerFormValues } from "../schemas/biller/addBillerSchema";
import { Biller } from "../types";
import { billerService } from "../services/biller/billerService";
import { buildAddBillerRequest } from "../utils/biller/billerRequest";
import { showToast } from "../store/slices/uiSlice";
import { billerAdded } from "../store/slices/dashboardSlice";
import { billerSubmitted } from "../store/slices/addBillerSlice";
import { router } from "expo-router";
import { ROUTES } from "../constants/routes";

/**
 * Saving Add Biller's form: on success, "Biller under review" replaces the
 * form; on failure an error toast and the form keeps what was typed.
 *
 * @returns Whether it's saving, and the save action
 * @example const { isSubmitting, addBiller } = useAddBiller();
 */
export function useAddBiller() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addBiller = async (values: AddBillerFormValues, biller: Biller) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const result = await billerService.addBiller(
      buildAddBillerRequest(values, biller),
    );
    setIsSubmitting(false);

    if (!result.ok) {
      dispatch(
        showToast({
          message: result.message ?? t("errors.generic"),
          variant: "error",
        }),
      );
      return;
    }

    dispatch(billerAdded());
    dispatch(billerSubmitted(biller, values));
    // Replace (not push): the form can't be returned to after saving
    router.replace(ROUTES.ADD_BILLER_SUBMITTED);
  };

  return { isSubmitting, addBiller };
}
