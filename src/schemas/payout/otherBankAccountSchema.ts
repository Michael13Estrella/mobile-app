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

import z from "zod";
import { Translate } from "../../hooks/useTranslation";
import { DIGITS_ONLY_REGEX } from "../../constants/validation";
import { OTHER_BANK_CURRENCIES } from "../../constants/payout";
import { romajiText } from "../beneficiary/beneficiaryCommonSchema";
import { isEWalletBankCode } from "../../utils/beneficiary/payout";
import { isValidPhoneNumber } from "../../utils/format/phone";
import { BENEFICIARY_PHONE_COUNTRY } from "../../constants/phone";

/**
 * The rules of the other bank / e-wallet payout form. A bank needs a
 * branch; an e-wallet (GCash, Maya) has no branch, and its account number
 * is a Philippine mobile number.
 *
 * @param t - The translate function, for the error messages
 * @returns The form's zod schema
 * @example const schema = useMemo(() => buildOtherBankAccountSchema(t), [t]);
 */
export const buildOtherBankAccountSchema = (t: Translate) =>
  z
    .object({
      // OtherBank.code, sent as obBankNameCode
      bankCode: z.string().min(1, t("validation.required")),
      accountNo: z
        .string()
        .min(1, t("validation.required"))
        .regex(DIGITS_ONLY_REGEX, t("validation.digitsOnly")),
      currency: z.enum(OTHER_BANK_CURRENCIES),
      branchName: romajiText(t),
    })
    .superRefine((values, ctx) => {
      if (isEWalletBankCode(values.bankCode)) {
        // The mobile number's 10 digits after +63
        // (AppPhoneInput drops a typed leading 0)
        if (!isValidPhoneNumber(BENEFICIARY_PHONE_COUNTRY, values.accountNo)) {
          ctx.addIssue({
            code: "custom",
            path: ["accountNo"],
            message: t("payoutFields.accountNo.eWalletValidation"),
          });
        }
        return;
      }

      // Banks: the branch is required
      if (!values.branchName.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["branchName"],
          message: t("validation.required"),
        });
      }
    });

export type OtherBankAccountFormValues = z.infer<
  ReturnType<typeof buildOtherBankAccountSchema>
>;

// A new form: no bank yet, PHP preselected
export const EMPTY_OTHER_BANK_ACCOUNT_FORM: OtherBankAccountFormValues = {
  bankCode: "",
  accountNo: "",
  currency: OTHER_BANK_CURRENCIES[0],
  branchName: "",
};
