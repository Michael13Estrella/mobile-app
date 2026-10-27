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
// - before the first submit: validation on every change and on blur, so
//   isValid (which enables the submit buttons) is always current,
// - after a submit (e.g. back to the form from Confirm to edit it):
//   re-validation when a field loses focus.
export const FORM_VALIDATION_MODE = {
  mode: "all",
  reValidateMode: "onBlur",
} as const satisfies Pick<UseFormProps, "mode" | "reValidateMode">;
