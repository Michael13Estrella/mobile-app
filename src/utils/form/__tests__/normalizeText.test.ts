/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-29
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { normalizeSmartPunctuation } from "../normalizeText";

describe("normalizeSmartPunctuation", () => {
  it("turns curly apostrophes and primes into straight ones", () => {
    expect(normalizeSmartPunctuation("Lawson’")).toBe("Lawson'");
    expect(normalizeSmartPunctuation("O‘Brian")).toBe("O'Brian");
    expect(normalizeSmartPunctuation("5′")).toBe("5'");
  });

  it("turns smart double quotes into straight ones", () => {
    expect(normalizeSmartPunctuation("“A” „B“")).toBe('"A" "B"');
  });

  it("turns every kind of dash and the minus sign into a hyphen", () => {
    expect(normalizeSmartPunctuation("A – B — C ‐ D − E")).toBe(
      "A - B - C - D - E",
    );
  });

  it("expands the ellipsis and replaces non-breaking spaces", () => {
    expect(normalizeSmartPunctuation("Wait…")).toBe("Wait...");
    expect(normalizeSmartPunctuation("Juan\u00A0Cruz")).toBe("Juan Cruz");
  });

  it("replaces every occurrence, not only the first", () => {
    expect(normalizeSmartPunctuation("’’’")).toBe("'''");
  });

  it("leaves plain text and Japanese untouched", () => {
    expect(normalizeSmartPunctuation("Juan Dela Cruz")).toBe("Juan Dela Cruz");
    expect(normalizeSmartPunctuation("山田")).toBe("山田");
  });
});
