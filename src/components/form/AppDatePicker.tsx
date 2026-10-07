/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-08-27
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useTranslation } from "../../hooks/useTranslation";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerChangeEvent,
} from "@react-native-community/datetimepicker";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Modal, Portal, TextInput } from "react-native-paper";
import { AppButton } from "../common/AppButton";
import { FieldLabel } from "./FieldLabel";
import { FieldHelperText } from "./FieldHelperText";
import { Spacing } from "../../constants/spacing";
import { BrandIconName } from "../icons";
import { Typography } from "../../constants/typography";
import {
  FieldLeadingIcon,
  LEADING_ICON_CONTENT_PADDING,
} from "./FieldLeadingIcon";

type AppDatePickerProps<T extends FieldValues> = Readonly<{
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  leadingIcon?: BrandIconName;
  maximumDate?: Date;
  minimumDate?: Date;
}>;

// Field value is stored as an ISO "YYYY-MM-DD" string.
const formatDate = (date: Date): string => date.toISOString().split("T")[0];

// Displayed to the user as "YYYY / MM / DD".
const formatDisplayDate = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year} / ${month} / ${day}`;
};

export function AppDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required = false,
  leadingIcon,
  maximumDate,
  minimumDate,
}: AppDatePickerProps<T>) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const [iosModalVisible, setIosModalVisible] = useState(false);
  const [draftDate, setDraftDate] = useState<Date>(new Date());

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ control, name });

  const selectedDate: Date | undefined = value ? new Date(value) : undefined;

  const openPicker = () => {
    const initial = selectedDate ?? new Date();
    setDraftDate(initial);

    if (Platform.OS === "android") {
      // Android always renders its own native dialog (like Alert.alert) -
      // the imperative API is what the library itself recommends for it.
      DateTimePickerAndroid.open({
        value: initial,
        mode: "date",
        display: "spinner",
        maximumDate,
        minimumDate,
        onValueChange: (_event, date) => onChange(formatDate(date)),
      });
    } else {
      setIosModalVisible(true);
    }
  };

  const handleIosChange = (_event: DateTimePickerChangeEvent, date: Date) => {
    setDraftDate(date);
  };

  const handleConfirm = () => {
    onChange(formatDate(draftDate));
    setIosModalVisible(false);
  };

  const handleCancel = () => {
    setIosModalVisible(false);
  };

  return (
    <View>
      {/* Label */}
      <FieldLabel label={label} required={required} />

      {/* Date input field */}
      <View style={styles.inputWrapper}>
        <Pressable onPress={openPicker}>
          <View>
            <TextInput
              value={selectedDate ? formatDisplayDate(selectedDate) : ""}
              placeholder={placeholder}
              editable={false}
              error={!!error}
              mode="outlined"
              placeholderTextColor={colors.textDisabled}
              outlineStyle={[styles.outline]}
              style={[styles.input]}
              contentStyle={[
                styles.content,
                !!leadingIcon && { paddingLeft: LEADING_ICON_CONTENT_PADDING },
              ]}
            />

            {Platform.OS === "ios" && (
              <Portal>
                <Modal
                  visible={iosModalVisible}
                  onDismiss={handleCancel}
                  contentContainerStyle={[
                    styles.modal,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <DateTimePicker
                    value={draftDate}
                    mode="date"
                    display="spinner"
                    maximumDate={maximumDate}
                    minimumDate={minimumDate}
                    onValueChange={handleIosChange}
                  />
                  <View style={styles.actions}>
                    <AppButton
                      label={t("common.cancel")}
                      variant="ghost"
                      onPress={handleCancel}
                    />

                    <AppButton
                      label={t("common.ok")}
                      variant="ghost"
                      onPress={handleConfirm}
                    />
                  </View>
                </Modal>
              </Portal>
            )}
          </View>
        </Pressable>

        <FieldLeadingIcon name={leadingIcon} />
      </View>

      {/* Helper text */}
      <FieldHelperText errorMessage={error?.message} />
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    justifyContent: "center",
  },
  outline: {
    borderRadius: 8,
    borderWidth: 1,
  },
  input: {
    height: 48,
  },
  content: {
    fontSize: Typography.sizes.md,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s4,
  },
  modal: {
    marginHorizontal: Spacing.s7,
    borderRadius: 12,
    padding: Spacing.s5,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.s4,
    marginTop: Spacing.s4,
  },
});
