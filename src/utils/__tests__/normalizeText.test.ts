import { normalizeSmartPunctuation } from "../normalizeText";

describe("normalizeSmartPunctuation", () => {
  it("turns curly apostrophes into straight ones", () => {
    expect(normalizeSmartPunctuation("Lawson’")).toBe("Lawson'");
    expect(normalizeSmartPunctuation("O‘Brian")).toBe("O'Brian");
  });

  it("turns smart double quotes and dashes into ASCII", () => {
    expect(normalizeSmartPunctuation("“A” – B — C")).toBe('"A" - B - C');
  });

  it("leaves plain text and Japanese untouched", () => {
    expect(normalizeSmartPunctuation("Juan Dela Cruz")).toBe("Juan Dela Cruz");
    expect(normalizeSmartPunctuation("山田")).toBe("山田");
  });
});
