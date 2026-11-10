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
import { Translate } from "../../hooks/useTranslation";

/**
 * The rules of the Send Money form.
 *
 * @param t - The translate function, for the error messages
 * @returns The form's zod schema
 * @example const schema = useMemo(() => buildSendMoneySchema(t), [t]);
 */
export const buildSendMoneySchema = (t: Translate) =>
  z.object({
    beneficiaryGuid: z.string().min(1, t("validation.required")),
    // A saved payout's id; null until one is picked
    payoutId: z
      .number()
      .nullable()
      .refine((id) => id !== null, t("validation.required")),
  });

// What the fields hold while filling in: nothing picked yet is allowed
export type SendMoneyFormInput = z.input<
  ReturnType<typeof buildSendMoneySchema>
>;

// What a valid form submits: every field picked
export type SendMoneyFormValues = z.output<
  ReturnType<typeof buildSendMoneySchema>
>;

// A new form: nothing picked yet
export const EMPTY_SEND_MONEY_FORM: SendMoneyFormInput = {
  beneficiaryGuid: "",
  payoutId: null,
};
