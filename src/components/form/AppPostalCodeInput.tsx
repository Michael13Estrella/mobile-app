/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-17
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useRef, useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useFormField } from "../../hooks/useFormField";
import { FIELD_SIZE, resolveFieldColors } from "../../theme/field";
import { Spacing } from "../../constants/spacing";
import { BrandIcon } from "../icons";
import { FieldShell } from "./FieldShell";
import { MaskedDigitsInput } from "./MaskedDigitsInput";

// Japanese postal code: "123-4567", entered in two boxes.
const FIRST_SEGMENT_TEMPLATE = "xxx";
const SECOND_SEGMENT_TEMPLATE = "xxxx";
const FIRST_SEGMENT_LENGTH = FIRST_SEGMENT_TEMPLATE.length;
// The round search button matches the field height.
const SEARCH_BUTTON_SIZE = FIELD_SIZE.height;
const SEARCH_ICON_SIZE = 24;
const DASH_WIDTH = 10;
const DASH_HEIGHT = 2;

type Segment = "first" | "second";

type AppPostalCodeInputProps<T extends FieldValues> = Readonly<{
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  onSearch: () => void;
  searching?: boolean;
}>;

function SearchIcon({ color }: Readonly<{ color: string }>) {
  return <BrandIcon name="searchLine" size={SEARCH_ICON_SIZE} color={color} />;
}

export function AppPostalCodeInput<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  onSearch,
  searching = false,
}: AppPostalCodeInputProps<T>) {
  const { colors } = useAppTheme();
  const firstInputRef = useRef<TextInput>(null);
  const secondInputRef = useRef<TextInput>(null);
  const [focusedSegment, setFocusedSegment] = useState<Segment | null>(null);

  const {
    value,
    onChange,
    onFocus,
    onBlur,
    errorMessage,
    status,
    fieldColors,
  } = useFormField({ control, name });

  const postalCode: string = value ?? "";
  const firstDigits = postalCode.slice(0, FIRST_SEGMENT_LENGTH);
  const secondDigits = postalCode.slice(FIRST_SEGMENT_LENGTH);

  const handleFirstChange = (digits: string) => {
    onChange(digits + secondDigits);
    if (digits.length === FIRST_SEGMENT_LENGTH) {
      secondInputRef.current?.focus();
    }
  };

  const handleSecondChange = (digits: string) => {
    onChange(firstDigits + digits);
  };

  const handleSegmentFocus = (segment: Segment) => {
    setFocusedSegment(segment);
    onFocus();
  };

  // Both boxes are one field: moving between them is not "leaving" it.
  // Focus moves after the blur event, so check on the next tick whether the
  // other box took focus before validating.
  const handleSegmentBlur = () => {
    setFocusedSegment(null);
    setTimeout(() => {
      const stillInField =
        firstInputRef.current?.isFocused() ||
        secondInputRef.current?.isFocused();
      if (!stillInField) onBlur();
    }, 0);
  };

  // Focus is shown per box; error/success apply to both (one postal code).
  const restingBorder =
    status === "focused"
      ? resolveFieldColors("default", colors).border
      : fieldColors.border;

  const boxStyle = (segment: Segment) => [
    styles.box,
    {
      backgroundColor: fieldColors.background,
      borderColor:
        focusedSegment === segment ? fieldColors.border : restingBorder,
    },
  ];

  const maskColors = {
    textColor: fieldColors.text,
    placeholderColor: fieldColors.placeholder,
    cursorColor: colors.inputBorderFocused,
  };

  return (
    <FieldShell label={label} required={required} errorMessage={errorMessage}>
      <View style={styles.row}>
        <View style={[boxStyle("first"), styles.firstBox]}>
          <MaskedDigitsInput
            ref={firstInputRef}
            template={FIRST_SEGMENT_TEMPLATE}
            value={firstDigits}
            onChangeDigits={handleFirstChange}
            onFocus={() => handleSegmentFocus("first")}
            onBlur={handleSegmentBlur}
            {...maskColors}
          />
        </View>

        <View
          style={[styles.dash, { backgroundColor: colors.borderDefault }]}
        />

        <View style={[boxStyle("second"), styles.secondBox]}>
          <MaskedDigitsInput
            ref={secondInputRef}
            template={SECOND_SEGMENT_TEMPLATE}
            value={secondDigits}
            onChangeDigits={handleSecondChange}
            onFocus={() => handleSegmentFocus("second")}
            onBlur={handleSegmentBlur}
            {...maskColors}
          />
        </View>

        <Pressable
          style={[
            styles.searchButton,
            { borderColor: colors.iconBrandSecondary },
          ]}
          onPress={onSearch}
          disabled={searching}
          accessibilityRole="button"
        >
          <SearchIcon color={colors.iconBrandSecondary} />
        </Pressable>
      </View>
    </FieldShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s3,
  },
  box: {
    height: FIELD_SIZE.height,
    borderWidth: FIELD_SIZE.borderWidth,
    borderRadius: FIELD_SIZE.borderRadius,
    paddingHorizontal: FIELD_SIZE.paddingHorizontal,
  },
  // Box widths follow their digit counts (3 : 4).
  firstBox: {
    flex: FIRST_SEGMENT_TEMPLATE.length,
  },
  secondBox: {
    flex: SECOND_SEGMENT_TEMPLATE.length,
  },
  dash: {
    width: DASH_WIDTH,
    height: DASH_HEIGHT,
  },
  searchButton: {
    width: SEARCH_BUTTON_SIZE,
    height: SEARCH_BUTTON_SIZE,
    borderRadius: SEARCH_BUTTON_SIZE / 2,
    borderWidth: FIELD_SIZE.borderWidth,
    alignItems: "center",
    justifyContent: "center",
  },
});
