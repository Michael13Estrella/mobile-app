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

import { UseFormProps } from "react-hook-form";

// Shared validation timing for all forms:
// - a field shows its error only after it first loses focus (no errors
//   while the user is still typing); from then on it's re-checked on every
//   change, so the error clears as soon as it's fixed,
// - after a submit (e.g. back to the form from Confirm to edit it):
//   re-validation when a field loses focus.
// isValid (which enables the submit buttons) stays current on every change
// in any mode: react-hook-form re-runs the schema for it.
export const FORM_VALIDATION_MODE = {
  mode: "onTouched",
  reValidateMode: "onBlur",
} as const satisfies Pick<UseFormProps, "mode" | "reValidateMode">;
