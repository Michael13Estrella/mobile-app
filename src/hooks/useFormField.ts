/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-30
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
  useController,
} from "react-hook-form";
import {
  FieldColors,
  FieldStatus,
  resolveFieldColors,
  resolveFieldStatus,
} from "../theme/field";
import { useAppTheme } from "./useAppTheme";
import { useState } from "react";

type UseFormFieldOptions<T extends FieldValues> = Readonly<{
  control: Control<T>;
  name: Path<T>;
  disabled?: boolean;
  successText?: string;
}>;

export type FormField<T extends FieldValues> = Readonly<{
  value: ControllerRenderProps<T, Path<T>>["value"];
  onChange: ControllerRenderProps<T, Path<T>>["onChange"];
  onFocus: () => void;
  onBlur: () => void;
  errorMessage?: string;
  showSuccess: boolean;
  isFocused: boolean;
  status: FieldStatus;
  fieldColors: FieldColors;
}>;

// Shared state for every form field: connects react-hook-form to the
// centralized field styling in theme/field.ts. Input components use this
// instead of calling useController directly.
export function useFormField<T extends FieldValues>({
  control,
  name,
  disabled = false,
  successText,
}: UseFormFieldOptions<T>): FormField<T> {
  const { colors } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  const {
    field,
    fieldState: { error, isTouched, isDirty },
  } = useController({ control, name });

  const hasError = !!error;
  const showSuccess =
    !hasError && (isTouched || isDirty) && !!field.value && !!successText;

  const status = resolveFieldStatus({
    disabled,
    hasError,
    showSuccess,
    isFocused,
  });

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => {
    setIsFocused(false);
    field.onBlur();
  };

  return {
    value: field.value,
    onChange: field.onChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    errorMessage: error?.message,
    showSuccess,
    isFocused,
    status,
    fieldColors: resolveFieldColors(status, colors),
  };
}
