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
import { BeneficiaryPayout } from "../../../types";
import { useTranslation } from "../../../hooks/useTranslation";
import { useState } from "react";
import { useFormField } from "../../../hooks/useFormField";
import { PAYOUT_TYPE } from "../../../constants/payout";
import { getPayoutDetails } from "../../../utils/beneficiary/payout";
import { Keyboard } from "react-native";
import { FieldShell } from "../../form/FieldShell";
import { SelectTrigger } from "../../form/select/SelectTrigger";
import { PayoutPickerSheet } from "./PayoutPickerSheet";

type PayoutSelectProps<T extends FieldValues> = Readonly<{
  control: Control<T>;
  // The field holding the picked payout's id
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  // For the drawer's "Saved for {{name}}"
  beneficiaryName: string;
  // The picked beneficiary's saved payout methods
  payouts: readonly BeneficiaryPayout[];
}>;

/**
 * A dropdown field for picking one of a beneficiary's payout methods: shows
 * the picked one's bank and details, and opens the "Payout method" drawer.
 *
 * @example <PayoutSelect control={control} name="payoutId" label={t("sendMoney.payout.label")} beneficiaryName={name} payouts={payouts} />
 */
export function PayoutSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  beneficiaryName,
  payouts,
}: PayoutSelectProps<T>) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const { value, onChange, onFocus, onBlur, errorMessage, fieldColors } =
    useFormField({ control, name, disabled });

  const selected = payouts.find((payout) => payout.payoutId === value);
  // A cash pick-up has no account number or currency
  const selectedDetails =
    selected &&
    (selected.payoutType === PAYOUT_TYPE.CASH_PICKUP
      ? t("sendMoney.payoutPicker.cashPickupDetails")
      : getPayoutDetails(selected));

  // For a dropdown, the drawer being open is its "focused" state.
  const openPicker = () => {
    Keyboard.dismiss();
    setVisible(true);
    onFocus();
  };

  // Closing the drawer is this field's "blur": it marks the field as touched
  // and validated it, so a dismissed required dropdown shows its error
  const closePicker = () => {
    setVisible(false);
    onBlur();
  };

  const handleSelect = (payout: BeneficiaryPayout) => {
    onChange(payout.payoutId);
    closePicker();
  };

  return (
    <FieldShell label={label} required={required} errorMessage={errorMessage}>
      <SelectTrigger
        value={selected?.bankName ?? ""}
        description={selectedDetails}
        placeholder={placeholder}
        disabled={disabled}
        fieldColors={fieldColors}
        onPress={openPicker}
      />

      <PayoutPickerSheet
        visible={visible}
        beneficiaryName={beneficiaryName}
        payouts={payouts}
        selectedPayoutId={selected?.payoutId}
        onSelect={handleSelect}
        onClose={closePicker}
      />
    </FieldShell>
  );
}
