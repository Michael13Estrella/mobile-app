/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-01
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

// Single source of truth for how every form field looks.
// Components read from here; they never pick field sizes or colors themselves.
import { AppColors } from "../constants/colors";
import { Spacing } from "../constants/spacing";

export const FIELD_SIZE = {
  height: 48,
  borderRadius: 8,
  borderWidth: 1,
  paddingHorizontal: Spacing.s4,
  paddingVertical: Spacing.s4,
  // Vertical spacing between label, input and helper text.
  gap: Spacing.s3,
} as const;

export type FieldStatus =
  | "default"
  | "focused"
  | "error"
  | "success"
  | "disabled";

export type FieldColors = Readonly<{
  border: string;
  background: string;
  text: string;
  placeholder: string;
  icon: string;
}>;

type FieldStatusInput = Readonly<{
  disabled: boolean;
  hasError: boolean;
  showSuccess: boolean;
  isFocused: boolean;
}>;

// Precedence: disabled > error > success > focused > default.
// An invalid field stays red even while focused.
export const resolveFieldStatus = ({
  disabled,
  hasError,
  showSuccess,
  isFocused,
}: FieldStatusInput): FieldStatus => {
  if (disabled) return "disabled";
  if (hasError) return "error";
  if (showSuccess) return "success";
  if (isFocused) return "focused";
  return "default";
};

export const resolveFieldColors = (
  status: FieldStatus,
  colors: AppColors,
): FieldColors => {
  const base: FieldColors = {
    border: colors.borderDefault,
    background: colors.inputBackground,
    text: colors.textPrimary,
    placeholder: colors.textTertiary,
    icon: colors.iconTertiary,
  };

  switch (status) {
    case "focused":
      return { ...base, border: colors.inputBorderFocused };
    case "error":
      return {
        ...base,
        border: colors.inputBorderError,
        background: colors.inputBackgroundError,
        placeholder: colors.inputPlaceholderError,
        icon: colors.iconError,
      };

    case "success":
      return {
        ...base,
        border: colors.borderSuccess,
      };
    case "disabled":
      return {
        ...base,
        background: colors.inputBackgroundDisabled,
        text: colors.textDisabled,
        placeholder: colors.textDisabled,
        icon: colors.textDisabled,
      };
    default:
      return base;
  }
};
