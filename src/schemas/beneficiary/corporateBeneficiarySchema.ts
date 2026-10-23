/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-22
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { z } from "zod";
import type { Translate } from "../../hooks/useTranslation";
import {
  buildBeneficiaryCommonShape,
  EMPTY_BENEFICIARY_COMMON,
  romajiText,
} from "./beneficiaryCommonSchema";

/**
 * The rules of the corporate beneficiary form (add and edit).
 *
 * @param t - The translate function, for the error messages
 * @returns The form's zod schema
 * @example const schema = useMemo(() => buildCorporateBeneficiarySchema(t), [t]);
 */
export const buildCorporateBeneficiarySchema = (t: Translate) => {
  const required = t("validation.required");

  return z.object({
    companyName: romajiText(t).min(1, required),
    officeTelNo: z.string().min(1, required),
    ...buildBeneficiaryCommonShape(t),
  });
};

export type CorporateFormValues = z.infer<
  ReturnType<typeof buildCorporateBeneficiarySchema>
>;

// A new, empty form
export const EMPTY_CORPORATE_FORM: CorporateFormValues = {
  companyName: "",
  officeTelNo: "",
  ...EMPTY_BENEFICIARY_COMMON,
};
