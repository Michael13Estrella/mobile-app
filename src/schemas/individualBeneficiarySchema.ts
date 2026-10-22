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
import { BENEFICIARY_PHONE_COUNTRY } from "../constants/phone";
import { GENDER_VALUES } from "../constants/userFields";
import { HALF_WIDTH_ROMAJI_REGEX } from "../constants/validation";
import type { useTranslation } from "../hooks/useTranslation";
import { isFutureDate, isValidCalendarDate } from "../utils/dateValidation";
import { isValidPhoneNumber } from "../utils/phone";

type Translate = ReturnType<typeof useTranslation>["t"];

/**
 * The rules of the individual beneficiary form (add, edit and own account).
 *
 * @param t - The translate function, for the error messages
 * @returns The form's zod schema
 * @example const schema = useMemo(() => buildIndividualBeneficiarySchema(t), [t]);
 */
export const buildIndividualBeneficiarySchema = (t: Translate) => {
  const romaji = z
    .string()
    .regex(HALF_WIDTH_ROMAJI_REGEX, t("validation.halfWidthOnly"));
  const requiredRomaji = romaji.min(1, t("validation.required"));

  return z.object({
    beneAlias: romaji,
    lastName: requiredRomaji,
    firstName: requiredRomaji,
    middleName: romaji,
    gender: z.enum(GENDER_VALUES).or(z.literal("")),
    // YYYY-MM-DD. Optional, but a typed date must be a real, past date
    birthDate: z
      .string()
      .refine(
        (iso) => !iso || isValidCalendarDate(iso),
        t("validation.invalidDate"),
      )
      .refine((iso) => !iso || !isFutureDate(iso), t("validation.invalidDate")),
    addressLine1: requiredRomaji,
    addressLine2: romaji,
    cityProvCode: z.string().min(1, t("validation.required")),
    // The chosen city/municipality's code
    zipPosCode: z.string().min(1, t("validation.required")),
    relationToBeneCode: z.string().min(1, t("validation.required")),
    mobileNo: z
      .string()
      .refine(
        (digits) =>
          !digits || isValidPhoneNumber(BENEFICIARY_PHONE_COUNTRY, digits),
        t("beneficiaryFields.mobileNo.validation"),
      ),
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
  addressLine1: "",
  addressLine2: "",
  cityProvCode: "",
  zipPosCode: "",
  relationToBeneCode: "",
  mobileNo: "",
};
