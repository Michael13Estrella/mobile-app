import { z } from "zod";
import {
  buildBeneficiaryCommonShape,
  EMPTY_BENEFICIARY_COMMON,
  romajiText,
} from "./beneficiaryCommonSchema";
import { Translate } from "../../hooks/useTranslation";
import { GENDER_VALUES } from "../../constants/userFields";
import { isFutureDate, isValidCalendarDate } from "../../utils/dateValidation";

/**
 * The rules of the individual beneficiary form (add, edit and own account).
 *
 * @param t - The translate function, for the error messages
 * @returns The form's zod schema
 * @example const schema = useMemo(() => buildIndividualBeneficiarySchema(t), [t]);
 */
export const buildIndividualBeneficiarySchema = (t: Translate) => {
  const requiredName = romajiText(t).min(1, t("validation.required"));

  return z.object({
    beneAlias: romajiText(t),
    lastName: requiredName,
    firstName: requiredName,
    middleName: romajiText(t),
    gender: z.enum(GENDER_VALUES).or(z.literal("")),
    // YYYY-MM-DD. Optional, but a typed date must be a real, past date
    birthDate: z
      .string()
      .refine(
        (iso) => !iso || isValidCalendarDate(iso),
        t("validation.invalidDate"),
      )
      .refine((iso) => !iso || !isFutureDate(iso), t("validation.invalidDate")),
    ...buildBeneficiaryCommonShape(t),
  });
};

export type IndividualFormValues = z.infer<
  ReturnType<typeof buildIndividualBeneficiarySchema>
>;

// A new, empty form; optional fields are "" (not missing) so every input
// is controlled from the start
export const EMPTY_INDIVIDUAL_FORM: IndividualFormValues = {
  beneAlias: "",
  lastName: "",
  firstName: "",
  middleName: "",
  gender: "",
  birthDate: "",
  ...EMPTY_BENEFICIARY_COMMON,
};
