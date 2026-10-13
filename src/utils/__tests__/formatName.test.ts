import { formatPersonName } from "../formatName";

describe("formatPersonName", () => {
  it("title-cases each word", () => {
    expect(formatPersonName("JUAN DELA CRUZ")).toBe("Juan Dela Cruz");
  });

  it("capitalizes after hyphens and apostrophes", () => {
    expect(formatPersonName("MARY-ANN O'NEIL")).toBe("Mary-Ann O'Neil");
  });

  it("trims and collapses spaces", () => {
    expect(formatPersonName("  JUAN   CARLOS ")).toBe("Juan Carlos");
  });

  it("leaves Japanese names unchanged", () => {
    expect(formatPersonName("田中")).toBe("田中");
  });
});
