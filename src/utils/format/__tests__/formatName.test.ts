/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-14
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { formatPersonName, getInitials } from "../formatName";

describe("formatPersonName", () => {
  it("title-cases each word", () => {
    expect(formatPersonName("JUAN DELA CRUZ")).toBe("Juan Dela Cruz");
  });

  it("works on a single word", () => {
    expect(formatPersonName("MICHAEL")).toBe("Michael");
  });

  it("capitalizes after hyphens and apostrophes", () => {
    expect(formatPersonName("MARY-ANN O'NEIL")).toBe("Mary-Ann O'Neil");
  });

  it("normalizes mixed case", () => {
    expect(formatPersonName("jUAN dELA cruz")).toBe("Juan Dela Cruz");
  });

  it("trims and collapses spaces", () => {
    expect(formatPersonName("  JUAN   CARLOS ")).toBe("Juan Carlos");
  });

  it("leaves Japanese names unchanged", () => {
    expect(formatPersonName("田中")).toBe("田中");
  });

  it("returns an empty string for an empty name", () => {
    expect(formatPersonName("")).toBe("");
    expect(formatPersonName("   ")).toBe("");
  });
});

describe("getInitials", () => {
  it("uses the first and last word", () => {
    expect(getInitials("Josh Cullen Santos")).toBe("JS");
  });

  it("uses one letter for a single word, in capitals", () => {
    expect(getInitials("acme")).toBe("A");
  });

  it("ignores extra spaces and is empty without a name", () => {
    expect(getInitials("  maria   banks ")).toBe("MB");
    expect(getInitials("")).toBe("");
  });
});
