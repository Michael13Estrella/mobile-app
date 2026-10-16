/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { FieldErrors } from "react-hook-form";
import { getErrorFieldLabels } from "../formErrors";

type Form = {
  lastName: string;
  firstName: string;
  birthDate: string;
  nickname: string;
};

const LABELS = {
  lastName: "Last name",
  firstName: "First name",
  birthDate: "Date of birth",
};

// A react-hook-form error for the given fields.
const errorsFor = (...fields: (keyof Form)[]): FieldErrors<Form> =>
  Object.fromEntries(
    fields.map((field) => [field, { type: "required", message: "Required" }]),
  ) as FieldErrors<Form>;

describe("getErrorFieldLabels", () => {
  it("returns the labels of the fields with an error", () => {
    expect(getErrorFieldLabels(errorsFor("birthDate"), LABELS)).toEqual([
      "Date of birth",
    ]);
  });

  it("keeps the order of the labels, not of the errors", () => {
    // Errors in a different order than the screen.
    expect(
      getErrorFieldLabels(errorsFor("birthDate", "lastName"), LABELS),
    ).toEqual(["Last name", "Date of birth"]);
  });

  it("ignores fields that aren't in the labels", () => {
    expect(getErrorFieldLabels(errorsFor("nickname"), LABELS)).toEqual([]);
  });

  it("returns an empty list when there are no errors", () => {
    expect(getErrorFieldLabels(errorsFor(), LABELS)).toEqual([]);
  });
});
