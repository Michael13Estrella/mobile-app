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

import { resolveIconGrid } from "../iconGrid";

describe("resolveIconGrid", () => {
  it("uses the requested grid when the icon has it", () => {
    expect(resolveIconGrid(["S", "M"], "M")).toBe("M");
  });

  it("uses the S drawing when no grid is requested", () => {
    expect(resolveIconGrid(["S", "M"])).toBe("S");
  });

  it("uses the only drawing of an icon without an S one", () => {
    expect(resolveIconGrid(["M"])).toBe("M");
  });

  it("ignores a requested grid the icon doesn't have", () => {
    expect(resolveIconGrid(["S"], "L")).toBe("S");
  });
});
