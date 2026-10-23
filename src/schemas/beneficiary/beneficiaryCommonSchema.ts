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
import { Translate } from "../../hooks/useTranslation";
import { HALF_WIDTH_ROMAJI_REGEX } from "../../constants/validation";
import { isValidPhoneNumber } from "../../utils/format/phone";
import { BENEFICIARY_PHONE_COUNTRY } from "../../constants/phone";

/**
 * A text field in half-width romaji (names, addresses).
 *
 * @param t - The translate function, for the error message
 * @returns The zod string rule; add .min(1, …) for a required field
 * @example const requiredName = romajiText(t).min(1, t("validation.required"));
 */
export const romajiText = (t: Translate) =>
  z.string().regex(HALF_WIDTH_ROMAJI_REGEX, t("validation.halfWidthOnly"));

/**
 * The fields both beneficiary forms (individual and corporate) share:
 * address, relationship and mobile number. Spread into each form's
 * z.object, so they have the same names everywhere.
 *
 * @param t - The translate function, for the error messages
 * @returns The shared part of the schema's shape
 * @example z.object({ lastName: …, ...buildBeneficiaryCommonShape(t) });
 */
export const buildBeneficiaryCommonShape = (t: Translate) => {
  const required = t("validation.required");

  return {
    addressLine1: romajiText(t).min(1, required),
    addressLine2: romajiText(t),
    cityProvCode: z.string().min(1, required),
    // The chosen city/municipality's code
    zipPosCode: z.string().min(1, required),
    relationToBeneCode: z.string().min(1, required),
    mobileNo: z
      .string()
      .refine(
        (digits) =>
          !digits || isValidPhoneNumber(BENEFICIARY_PHONE_COUNTRY, digits),
        t("beneficiaryFields.mobileNo.validation"),
      ),
  };
};

export type BeneficiaryCommonValues = z.infer<
  z.ZodObject<ReturnType<typeof buildBeneficiaryCommonShape>>
>;

// The shared fields of a new, empty form
export const EMPTY_BENEFICIARY_COMMON: BeneficiaryCommonValues = {
  addressLine1: "",
  addressLine2: "",
  cityProvCode: "",
  zipPosCode: "",
  relationToBeneCode: "",
  mobileNo: "",
};

/**
 * The shared fields' names for the form's error summary.
 *
 * @param t - The translate function
 * @param mobileLabel - The mobile field's label (individual: "Mobile
 *    number"; corporate: "Company mobile number")
 * @returns Field name -> label
 * @example getErrorFieldLabels(errors, { ...getBeneficiaryCommonLabels(t, mobileLabel), lastName: … });
 */
export const getBeneficiaryCommonLabels = (
  t: Translate,
  mobileLabel: string,
): Record<keyof BeneficiaryCommonValues, string> => ({
  addressLine1: t("beneficiaryFields.addressLine1.label"),
  addressLine2: t("beneficiaryFields.addressLine2.label"),
  cityProvCode: t("beneficiaryFields.province.label"),
  zipPosCode: t("beneficiaryFields.city.label"),
  relationToBeneCode: t("beneficiaryFields.relationship.label"),
  mobileNo: mobileLabel,
});
