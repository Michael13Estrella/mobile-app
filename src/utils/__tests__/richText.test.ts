/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-22
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { splitBoldText } from "../richText";

describe("splitBoldText", () => {
  it("splits plain and bold parts in order", () => {
    expect(splitBoldText("Currency (**PHP, USD**) only")).toEqual([
      { text: "Currency (", bold: false },
      { text: "PHP, USD", bold: true },
      { text: ") only", bold: false },
    ]);
  });

  it("handles several bold parts", () => {
    expect(splitBoldText("**A** and **B**")).toEqual([
      { text: "A", bold: true },
      { text: " and ", bold: false },
      { text: "B", bold: true },
    ]);
  });

  it("returns plain text as one part", () => {
    expect(splitBoldText("No details needed.")).toEqual([
      { text: "No details needed.", bold: false },
    ]);
  });
});
