/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-05
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { FieldErrors, FieldValues } from "react-hook-form";

/**
 * The labels of the fields that currently have an error, for the form's
 * error summary. Listed in the order of `labels` (pass them in screen
 * order); fields not in `labels` are ignored.
 *
 * @param errors - react-hook-form's `formState.errors`.
 * @param labels - Field name -> its translated label, in screen order.
 * @returns The labels of the fields with an error.
 * @example
 * getErrorFieldLabels(errors, { lastName: "Last name", birthDate: "Date of birth" });
 * ["Date of birth"] when only birthDate has an error
 */
export const getErrorFieldLabels = <T extends FieldValues>(
  errors: FieldErrors<T>,
  labels: Partial<Record<keyof T & string, string>>,
): string[] =>
  (Object.keys(labels) as (keyof T & string)[])
    .filter((name) => !!errors[name])
    .map((name) => labels[name] ?? name);
