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

import {
  getReferenceLabel,
  toAreaOptions,
  toDropdownOptions,
} from "../referenceData";
import { ReferenceDataItem } from "../../../types/referenceData.types";

const ITEMS: ReferenceDataItem[] = [
  { code: "01", codeDescEng: "Employee", codeDescJap: "会社員" },
  { code: "02", codeDescEng: "Student", codeDescJap: "学生" },
];

describe("toDropdownOptions", () => {
  it("uses the code as value and the English description as label", () => {
    expect(toDropdownOptions(ITEMS, "en")).toEqual([
      { value: "01", label: "Employee" },
      { value: "02", label: "Student" },
    ]);
  });

  it("uses the Japanese description in Japanese", () => {
    expect(toDropdownOptions(ITEMS, "ja")).toEqual([
      { value: "01", label: "会社員" },
      { value: "02", label: "学生" },
    ]);
  });

  it("returns no options for an empty list", () => {
    expect(toDropdownOptions([], "en")).toEqual([]);
  });
});

describe("getReferenceLabel", () => {
  it("finds the description for a code", () => {
    expect(getReferenceLabel(ITEMS, "02", "en")).toBe("Student");
    expect(getReferenceLabel(ITEMS, "02", "ja")).toBe("学生");
  });

  it("falls back to the code when it isn't in the list", () => {
    expect(getReferenceLabel(ITEMS, "99", "en")).toBe("99");
    // The list not loaded yet.
    expect(getReferenceLabel([], "01", "ja")).toBe("01");
  });
});

describe("toAreaOptions", () => {
  it("uses the code as value and the name as label, in order", () => {
    expect(
      toAreaOptions([
        { code: "1376", name: "Metro Manila" },
        { code: "0128", name: "Cebu" },
      ]),
    ).toEqual([
      { value: "1376", label: "Metro Manila" },
      { value: "0128", label: "Cebu" },
    ]);
  });
});
