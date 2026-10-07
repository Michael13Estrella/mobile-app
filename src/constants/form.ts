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
// - first validation when a field loses focus (no errors while typing
//   into a field for the first time),
// - after that, re-validation on every change so errors clear as soon
//   as the input is fixed.
export const FORM_VALIDATION_MODE = {
  mode: "all",
  reValidateMode: "onChange",
} as const satisfies Pick<UseFormProps, "mode" | "reValidateMode">;
