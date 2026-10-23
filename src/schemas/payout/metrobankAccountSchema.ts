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

import z from "zod";
import { Translate } from "../../hooks/useTranslation";
import {
  METROBANK_ACCOUNT_CURRENCIES,
  METROBANK_ACCOUNT_NO_LENGTH,
} from "../../constants/payout";
import { romajiText } from "../beneficiary/beneficiaryCommonSchema";

export const buildMetrobankAccountSchema = (t: Translate) =>
  z.object({
    // Digits only (the fields adds the spaces)
    accountNo: z
      .string()
      .min(1, t("validation.required"))
      .length(
        METROBANK_ACCOUNT_NO_LENGTH,
        t("payoutFields.accountNo.metrobankAccountValidation"),
      ),
    currency: z.enum(METROBANK_ACCOUNT_CURRENCIES),
    branchName: romajiText(t),
  });

export type MetrobankAccountFormValues = z.infer<
  ReturnType<typeof buildMetrobankAccountSchema>
>;

// A new form: PHP preselected, as in the design
export const EMPTY_METROBANK_ACCOUNT_FORM: MetrobankAccountFormValues = {
  accountNo: "",
  currency: METROBANK_ACCOUNT_CURRENCIES[0],
  branchName: "",
};
