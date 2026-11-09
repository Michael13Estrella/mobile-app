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

import { Control, FieldValues, Path } from "react-hook-form";
import { BeneficiarySummary, RecentBeneficiary } from "../../../types";
import { useState } from "react";
import { useFormField } from "../../../hooks/useFormField";
import { getBeneficiaryTitle } from "../../../utils/beneficiary/beneficiary";
import { Keyboard } from "react-native";
import { FieldShell } from "../../form/FieldShell";
import { SelectTrigger } from "../../form/select/SelectTrigger";
import { BeneficiaryPickerSheet } from "./BeneficiaryPickerSheet";

type BeneficiarySelectProps<T extends FieldValues> = Readonly<{
  control: Control<T>;
  // The field holding the picked beneficiary's guid
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  // Every saved beneficiary, and the dashboard's most recent ones
  beneficiaries: readonly BeneficiarySummary[];
  recentBeneficiaries: readonly RecentBeneficiary[];
}>;

/**
 * A dropdown field for picking a saved beneficiary: shows the picked one's
 * name, and opens the "Select a beneficiary" drawer.
 *
 * @example <BeneficiarySelect control={control} name="beneficiaryGuid" label={t("sendMoney.beneficiary.label")} beneficiaries={all} recentBeneficiaries={recent} />
 */
export function BeneficiarySelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  beneficiaries,
  recentBeneficiaries,
}: BeneficiarySelectProps<T>) {
  const [visible, setVisible] = useState(false);

  const { value, onChange, onFocus, onBlur, errorMessage, fieldColors } =
    useFormField({ control, name, disabled });

  const selected = beneficiaries.find(
    (beneficiary) => beneficiary.beneficiaryGuid === value,
  );
  const selectedLabel = selected ? getBeneficiaryTitle(selected) : "";

  // For a dropdown, the drawer being open is ots "focused" state.
  const openPicker = () => {
    Keyboard.dismiss();
    setVisible(true);
    onFocus();
  };

  // Closing the drawer is this field's "blur": it marks the field as touched
  // and validates it, so a dismissed required dropdown shows its error.
  const closePicker = () => {
    setVisible(false);
    onBlur();
  };

  const handleSelect = (beneficiary: BeneficiarySummary) => {
    onChange(beneficiary.beneficiaryGuid);
    closePicker();
  };

  return (
    <FieldShell label={label} required={required} errorMessage={errorMessage}>
      <SelectTrigger
        value={selectedLabel}
        placeholder={placeholder}
        disabled={disabled}
        fieldColors={fieldColors}
        onPress={openPicker}
      />

      <BeneficiaryPickerSheet
        visible={visible}
        beneficiaries={beneficiaries}
        recentBeneficiaries={recentBeneficiaries}
        onSelect={handleSelect}
        onClose={closePicker}
      />
    </FieldShell>
  );
}
