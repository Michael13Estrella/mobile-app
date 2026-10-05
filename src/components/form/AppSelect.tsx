import { Control, FieldValues, Path } from "react-hook-form";
import { useFormField } from "../../hooks/useFormField";
import { FIELD_SIZE } from "../../theme/field";
import { useState } from "react";
import { Keyboard, Pressable, StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import { FieldShell } from "./FieldShell";
import { LEADING_ICON_SIZE } from "./FieldLeadingIcon";
import { BrandIcon } from "../icons";
import { SelectHeaderAction, SelectSheet } from "./select/SelectSheet";

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

  // Drawer options (see SelectSheet)
  headerAction?: SelectHeaderAction;
  pinnedValues?: readonly string[];
  groupByLetter?: boolean;
  sortAscending?: boolean;
  showFlags?: boolean;
}>;

function SelectChevronIcon({ color }: Readonly<{ color: string }>) {
  return (
    <BrandIcon
      name="chevronSingleDownLine"
      size={LEADING_ICON_SIZE}
      color={color}
    />
  );
}

export function AppSelect<T extends FieldValues>({
  control,
  name,
  label,
  labelHelper,
  options,
  placeholder,
  required = false,
  headerAction,
  pinnedValues,
  groupByLetter,
  sortAscending,
  showFlags,
}: AppSelectProps<T>) {
  const [visible, setVisible] = useState(false);

  const { value, onChange, onFocus, onBlur, errorMessage, fieldColors } =
    useFormField({ control, name });

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
      <Pressable onPress={openPicker}>
        <View style={styles.fieldTouchArea}>
          <TextInput
            value={selectedLabel}
            editable={false}
            mode="outlined"
            placeholder={placeholder}
            outlineColor={fieldColors.border}
            activeOutlineColor={fieldColors.border}
            textColor={fieldColors.text}
            placeholderTextColor={fieldColors.placeholder}
            outlineStyle={styles.outline}
            style={[styles.input, { backgroundColor: fieldColors.background }]}
            selection={{ start: 0, end: 0 }}
            right={
              <TextInput.Icon
                icon={SelectChevronIcon}
                color={fieldColors.icon}
              />
            }
          />
        </View>
      </Pressable>

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
      />
    </FieldShell>
  );
}

const styles = StyleSheet.create({
  // The whole field acts as one button; the inner input must not take taps.
  fieldTouchArea: {
    pointerEvents: "none",
  },
  input: {
    textAlign: "left",
    height: FIELD_SIZE.height,
  },
  outline: {
    borderRadius: FIELD_SIZE.borderRadius,
    borderWidth: FIELD_SIZE.borderWidth,
  },
});
