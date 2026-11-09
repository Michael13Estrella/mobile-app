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
  });

export type SendMoneyFormValues = z.infer<
  ReturnType<typeof buildSendMoneySchema>
>;

// A new form: nothing picked yet
export const EMPTY_SEND_MONEY_FORM: SendMoneyFormValues = {
  beneficiaryGuid: "",
};
