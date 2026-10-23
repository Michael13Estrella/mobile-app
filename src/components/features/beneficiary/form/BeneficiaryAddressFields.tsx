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

import { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FieldLimits } from "../../../../constants/fieldLimits";
import { usePhilippineAreas } from "../../../../hooks/usePhilippineArea";
import { useTranslation } from "../../../../hooks/useTranslation";
import { toAreaOptions } from "../../../../utils/referenceData";
import { AppInput } from "../../../form/AppInput";
import { AppSelect } from "../../../form/AppSelect";
import { BeneficiaryCommonValues } from "../../../../schemas/beneficiary/beneficiaryCommonSchema";

type BeneficiaryAddressFieldsProps = Readonly<{
  // "Beneficiary's …" (individual) or "Company's …" (corporate)
  placeholders: Readonly<{
    addressLine1: string;
    addressLine2: string;
    province: string;
    city: string;
  }>;
}>;

/**
 * The address part of both beneficiary forms: address lines, province, and
 * the chosen province's city/municipality. Must be inside the form's
 * FormProvider.
 *
 * @example <BeneficiaryAddressFields placeholders={{ addressLine1: t("…"), … }} />
 */
export function BeneficiaryAddressFields({
  placeholders,
}: BeneficiaryAddressFieldsProps) {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext<BeneficiaryCommonValues>();

  // City/Municipality depends on the province
  const cityProvCode = useWatch({ control, name: "cityProvCode" });
  const { provinces, towns } = usePhilippineAreas(cityProvCode);

  // A new province: the city picked for the old one no longer fits. (Not on
  // the first render, so an edit form keeps its saved city)
  const previousCityProvCode = useRef(cityProvCode);
  useEffect(() => {
    if (previousCityProvCode.current === cityProvCode) return;
    previousCityProvCode.current = cityProvCode;
    setValue("zipPosCode", "");
  }, [cityProvCode, setValue]);

  return (
    <>
      {/* Address line 1 */}
      <AppInput
        control={control}
        name="addressLine1"
        required
        label={t("beneficiaryFields.addressLine1.label")}
        placeholder={placeholders.addressLine1}
        maxLength={FieldLimits.addressLine1}
        autoCapitalize="words"
      />

      {/* Address line 2 */}
      <AppInput
        control={control}
        name="addressLine2"
        optional
        label={t("beneficiaryFields.addressLine2.label")}
        placeholder={placeholders.addressLine2}
        maxLength={FieldLimits.addressLine2}
        autoCapitalize="words"
      />

      {/* Province */}
      <AppSelect
        control={control}
        name="cityProvCode"
        required
        label={t("beneficiaryFields.province.label")}
        placeholder={placeholders.province}
        options={toAreaOptions(provinces)}
        groupByLetter
        sortAscending
      />

      {/* City/Municipality: the chosen province's */}
      <AppSelect
        control={control}
        name="zipPosCode"
        required
        disabled={!cityProvCode}
        label={t("beneficiaryFields.city.label")}
        placeholder={placeholders.city}
        options={toAreaOptions(towns)}
        sortAscending
      />
    </>
  );
}
