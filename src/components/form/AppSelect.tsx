/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-08-28
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Control, FieldValues, Path } from "react-hook-form";
import { useFormField } from "../../hooks/useFormField";
import { useState } from "react";
import { Keyboard } from "react-native";
import { FieldShell } from "./FieldShell";
import { SelectHeaderAction, SelectSheet } from "./select/SelectSheet";
import { SelectTrigger } from "./select/SelectTrigger";

export interface SelectOption {
  label: string;
  value: string;
}

type AppSelectProps<T extends FieldValues> = Readonly<{
  control: Control<T>;
  name: Path<T>;
  label: string;
  labelHelper?: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;

  // Drawer options (see SelectSheet)
  headerAction?: SelectHeaderAction;
  pinnedValues?: readonly string[];
  groupByLetter?: boolean;
  sortAscending?: boolean;
  showFlags?: boolean;
  fitContent?: boolean;
}>;

export function AppSelect<T extends FieldValues>({
  control,
  name,
  label,
  labelHelper,
  options,
  placeholder,
  required = false,
  disabled = false,
  headerAction,
  pinnedValues,
  groupByLetter,
  sortAscending,
  showFlags,
  fitContent = false,
}: AppSelectProps<T>) {
  const [visible, setVisible] = useState(false);

  const { value, onChange, onFocus, onBlur, errorMessage, fieldColors } =
    useFormField({ control, name, disabled });

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  // For a dropdown, the drawer being open is its "focused" state.
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

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    closePicker();
  };

  const handleClear = () => {
    onChange("");
    closePicker();
  };

  return (
    <FieldShell
      label={label}
      labelHelper={labelHelper}
      required={required}
      errorMessage={errorMessage}
    >
      {/* Select field */}
      <SelectTrigger
        value={selectedLabel}
        placeholder={placeholder}
        disabled={disabled}
        fieldColors={fieldColors}
        onPress={openPicker}
      />

      <SelectSheet
        visible={visible}
        title={label}
        options={options}
        selectedValue={value}
        onSelect={handleSelect}
        onClear={handleClear}
        onClose={closePicker}
        headerAction={headerAction}
        pinnedValues={pinnedValues}
        groupByLetter={groupByLetter}
        sortAscending={sortAscending}
        showFlags={showFlags}
        fitContent={fitContent}
      />
    </FieldShell>
  );
}
