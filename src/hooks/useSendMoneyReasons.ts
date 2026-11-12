/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-12
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import {
  PURPOSE_OTHERS_CODE,
  SOURCE_FUND_OTHERS_CODE,
} from "../constants/remittance";
import { SendMoneyFormValues } from "../schemas/remittance/sendMoneySchema";
import { getReferenceLabel } from "../utils/referenceData/referenceData";
import { useReferenceData } from "./useReferenceData";
import { useTranslation } from "./useTranslation";

type SendMoneyReasonFields = Pick<
  SendMoneyFormValues,
  "sourceFundCode" | "sourceFundOthers" | "purposeCode" | "purposeOthers"
>;

/**
 * The source of funds and purpose of a remittance as shown: with "Others",
 * the typed text; otherwise the list's name for the code, in the app's
 * language.
 *
 * @param form - The Send Money form's values
 * @returns The two texts
 * @example const { sourceFund, purpose } = useSendMoneyReasons(form);
 */
export function useSendMoneyReasons(form: SendMoneyReasonFields) {
  const { locale } = useTranslation();
  const { items: sourceFunds } = useReferenceData("sourceFund");
  const { items: purposes } = useReferenceData("purpose");

  return {
    sourceFund:
      form.sourceFundCode === SOURCE_FUND_OTHERS_CODE
        ? form.sourceFundOthers
        : getReferenceLabel(sourceFunds, form.sourceFundCode, locale),
    purpose:
      form.purposeCode === PURPOSE_OTHERS_CODE
        ? form.purposeOthers
        : getReferenceLabel(purposes, form.purposeCode, locale),
  };
}
