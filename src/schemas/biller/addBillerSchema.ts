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

import z from "zod";
import { Biller, Translate } from "../../types";
import { romajiText } from "../beneficiary/beneficiaryCommonSchema";
import { DIGITS_ONLY_REGEX } from "../../constants/validation";
import { getBillerFields } from "../../utils/biller/billerFields";
import { CREDIT_CARD_NUMBER_LENGTH } from "../../constants/biller";
import {
  BILLER_PHONE_COUNTRY_CODES,
  PHONE_COUNTRIES,
} from "../../constants/phone";
import { isValidPhoneNumber } from "../../utils/format/phone";

/**
 * The rules of the Add Biller form. Which fields are required depends on
 * the picked biller's flags (see getBillerFields); the others stay empty.
 *
 * @param t - The translate function, for the error messages
 * @param billers - The biller list, to look up the picked biller's flags
 * @returns The form's zod schema
 * @example const schema = useMemo(() => buildAddBillerSchema(t, billers), [t, billers]);
 */
export const buildAddBillerSchema = (
  t: Translate,
  billers: readonly Biller[],
) =>
  z
    .object({
      // Biller.utilityCode
      utilityCode: z.string().min(1, t("validation.required")),
      subscriberNo: romajiText(t),
      docRefNo: romajiText(t),
      // The buyer's phone country (AppPhoneInput's country picker)
      telCountry: z.enum(BILLER_PHONE_COUNTRY_CODES),
      // The digits after its dial code (AppPhoneInput drops a typed leading 0)
      telNo: z.string().regex(DIGITS_ONLY_REGEX, t("validation.digitsOnly")),
    })
    .superRefine((values, ctx) => {
      const fields = getBillerFields(
        billers.find((biller) => biller.utilityCode === values.utilityCode),
      );

      const addIssue = (path: keyof typeof values, message: string) =>
        ctx.addIssue({ code: "custom", path: [path], message });

      // The fields the biller ask for a required
      const requiredFields = [
        ["subscriberNo", fields.subscriberNo],
        ["docRefNo", fields.docRefNo],
        ["telNo", fields.telNo],
      ] as const;
      for (const [path, isAsked] of requiredFields) {
        if (isAsked && !values[path].trim()) {
          addIssue(path, t("validation.required"));
        }
      }

      // A credit card number: all its digits
      if (
        fields.isCreditCard &&
        values.subscriberNo &&
        (values.subscriberNo.length !== CREDIT_CARD_NUMBER_LENGTH ||
          !DIGITS_ONLY_REGEX.test(values.subscriberNo))
      ) {
        addIssue(
          "subscriberNo",
          t("billerFields.creditCardNo.validation", {
            count: CREDIT_CARD_NUMBER_LENGTH,
          }),
        );
      }

      if (
        fields.telNo &&
        values.telNo &&
        !isValidPhoneNumber(PHONE_COUNTRIES[values.telCountry], values.telNo)
      ) {
        addIssue("telNo", t("billerFields.telNo.validation"));
      }
    });

export type AddBillerFormValues = z.infer<
  ReturnType<typeof buildAddBillerSchema>
>;

// A new form: no biller yet, the first phone country preselected
export const EMPTY_ADD_BILLER_FORM: AddBillerFormValues = {
  utilityCode: "",
  subscriberNo: "",
  docRefNo: "",
  telCountry: BILLER_PHONE_COUNTRY_CODES[0],
  telNo: "",
};
