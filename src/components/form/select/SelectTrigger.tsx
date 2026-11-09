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

import { Pressable, StyleSheet, View } from "react-native";
import { FIELD_SIZE, FieldColors } from "../../../theme/field";
import { BrandIcon } from "../../icons";
import { LEADING_ICON_SIZE } from "../FieldLeadingIcon";
import { TextInput } from "react-native-paper";

function SelectChevronIcon({ color }: Readonly<{ color: string }>) {
  return (
    <BrandIcon
      name="chevronSingleDownLine"
      size={LEADING_ICON_SIZE}
      color={color}
    />
  );
}

type SelectTriggerProps = Readonly<{
  // The selected item's text ("" shows the placeholder)
  value: string;
  placeholder?: string;
  disabled?: boolean;
  // From useFormField: border, text and background for the field's state
  fieldColors: FieldColors;
  // Opens the picker
  onPress: () => void;
}>;

/**
 * The closed look of a dropdown: a field showing the selected item (or the
 * placeholder) with a chevron. The whole field is one button that opens
 * the picker; the picker itself is up to the caller.
 *
 * @example <SelectTrigger value={selectedLabel} placeholder={placeholder} fieldColors={fieldColors} onPress={openPicker} />
 */
export function SelectTrigger({
  value,
  placeholder,
  disabled = false,
  fieldColors,
  onPress,
}: SelectTriggerProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <View style={styles.fieldTouchArea}>
        <TextInput
          value={value}
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
              color={fieldColors.iconButton}
            />
          }
        />
      </View>
    </Pressable>
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
