/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import z from "zod";
import { romajiText } from "../beneficiary/beneficiaryCommonSchema";
import {
  PURPOSE_OTHERS_CODE,
  SOURCE_FUND_OTHERS_CODE,
} from "../../constants/remittance";
import { parseAmountInput } from "../../utils/remittance/amountInput";
import { BeneficiaryPayout, BeneficiarySummary, Translate } from "../../types";

// What the amount is checked against. They depend on loaded data (the
// payout's currency, the wallet, the charges), so the form passes them in
export type SendMoneyAmountRules = Readonly<{
  // The smallest amount (JPY) for the payout's currency; null before a payout is picked
  minimum: number | null;
  // The available balance (JPY); null when it isn't known
  balance: number | null;
  // The amount + charge (getRemittancePayment); null when it can't be worked out
  totalPaymentOf: (amount: number) => number | null;
  // An amount as messages show it ("JPY 3,000")
  formatYen: (amount: number) => string;
}>;

/**
 * The rules of the Send Money form.
 *
 * @param t - The translate function, for the error messages
 * @param getRules - Returns the latest amount rules (they change as data
 *    loads and fields are picked, after the schema is built)
 * @returns The form's zod schema
 * @example const schema = useMemo(() => buildSendMoneySchema(t, () => rulesRef.current), [t]);
 */
export const buildSendMoneySchema = (
  t: Translate,
  getRules: () => SendMoneyAmountRules,
) =>
  z
    .object({
      beneficiaryGuid: z.string().min(1, t("validation.required")),
      // A saved payout's id; null until one is picked
      payoutId: z
        .number()
        .nullable()
        .refine((id) => id !== null, t("validation.required")),
      sourceFundCode: z.string().min(1, t("validation.required")),
      sourceFundOthers: romajiText(t),
      purposeCode: z.string().min(1, t("validation.required")),
      purposeOthers: romajiText(t),
      amount: z
        .string()
        .min(1, t("validation.required"))
        .superRefine((value, ctx) => {
          const rules = getRules();
          if (!value) return;
          const amount = parseAmountInput(value);
          const addIssue = (message: string) =>
            ctx.addIssue({ code: "custom", message });

          if (rules.minimum !== null && amount < rules.minimum) {
            addIssue(
              t("validation.minAmount", {
                min: rules.formatYen(rules.minimum),
              }),
            );
            return;
          }

          const totalPayment = rules.totalPaymentOf(amount);
          if (totalPayment === null) {
            addIssue(t("validation.invalidAmount"));
            return;
          }

          if (rules.balance !== null && totalPayment > rules.balance) {
            addIssue(
              t("sendMoneyFields.amount.insufficientBalance", {
                amount: rules.formatYen(rules.balance),
              }),
            );
          }
        }),
    })
    // With "Others" picked, its typed text is required
    .superRefine((values, ctx) => {
      if (
        values.sourceFundCode === SOURCE_FUND_OTHERS_CODE &&
        !values.sourceFundOthers.trim()
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["sourceFundOthers"],
          message: t("validation.required"),
        });
      }
      if (
        values.purposeCode === PURPOSE_OTHERS_CODE &&
        !values.purposeOthers.trim()
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["purposeOthers"],
          message: t("validation.required"),
        });
      }
    });

// What the fields hold while filling in: nothing picked yet is allowed
export type SendMoneyFormInput = z.input<
  ReturnType<typeof buildSendMoneySchema>
>;

// What a valid form submits: every field picked
export type SendMoneyFormValues = z.output<
  ReturnType<typeof buildSendMoneySchema>
>;

// What the form's Next hands over: the values, plus the picked beneficiary
// and payout (names, bank, account number for Review; the form has only ids)
export type SendMoneySubmission = Readonly<{
  form: SendMoneyFormValues;
  beneficiary: BeneficiarySummary;
  payout: BeneficiaryPayout;
}>;

// A new form: nothing picked yet
export const EMPTY_SEND_MONEY_FORM: SendMoneyFormInput = {
  beneficiaryGuid: "",
  payoutId: null,
  sourceFundCode: "",
  sourceFundOthers: "",
  purposeCode: "",
  purposeOthers: "",
  amount: "",
};
