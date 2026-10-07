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

// Labels of the fields that currently have a error, in the order of
// 'labels' (pass them in screen order). Fields not in 'labels' are ignored
export const getErrorFieldLabels = <T extends FieldValues>(
  errors: FieldErrors<T>,
  labels: Partial<Record<keyof T & string, string>>,
): string[] =>
  (Object.keys(labels) as (keyof T & string)[])
    .filter((name) => !!errors[name])
    .map((name) => labels[name] ?? name);
