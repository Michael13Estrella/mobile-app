/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-23
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { optionalField } from "../requestFields";

describe("optionalField", () => {
  it("trims a filled-in value", () => {
    expect(optionalField("  Makati ")).toBe("Makati");
  });

  it("is undefined for an empty or blank value", () => {
    expect(optionalField("")).toBeUndefined();
    expect(optionalField("   ")).toBeUndefined();
  });
});
