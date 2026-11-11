/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-10
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import z from "zod";
import { romajiText } from "../beneficiary/beneficiaryCommonSchema";
import { Translate } from "../../types";

/**
 * The rules of Send Money's "Additional Details": the remitter's company,
 * required from COMPANY_DETAILS_MIN_AMOUNT.
 *
 * @param t - The translate function, for the error messages
 * @returns The form's zod schema
 * @example const schema = useMemo(() => buildCompanyDetailsSchema(t), [t]);
 */
export const buildCompanyDetailsSchema = (t: Translate) =>
  z.object({
    // Half-width, like the other addresses the backend receives
    companyAddress: romajiText(t).trim().min(1, t("validation.required")),
    // The digits after the leading 0, from AppPhoneInput (Philippine number)
    companyTelNo: z.string().min(1, t("validation.required")),
  });

export type CompanyDetailsFormValues = z.infer<
  ReturnType<typeof buildCompanyDetailsSchema>
>;

// A new form: nothing entered yet
export const EMPTY_COMPANY_DETAILS_FORM: CompanyDetailsFormValues = {
  companyAddress: "",
  companyTelNo: "",
};
