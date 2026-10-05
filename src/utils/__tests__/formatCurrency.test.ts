import { formatCurrency } from "../formatCurrency";

// --- formatCurrency ---
describe("formatCurrency", () => {
  it("defaults to JPY/ja-JP with no decimal and thousands grouping", () => {
    const result = formatCurrency(1000);
    expect(result).toContain("1,000");
    expect(result).not.toContain("."); // JPY has no minor units
  });

  it("formats PHP with two decimal and thousands grouping", () => {
    const result = formatCurrency(1234.5, "PHP", "en-US");
    expect(result).toContain("1,234.50");
  });

  it("formats zero", () => {
    const result = formatCurrency(0, "PHP", "en-US");
    expect(result).toContain("0.00");
  });

  it("formats negatives", () => {
    const result = formatCurrency(-50, "PHP", "en-US");
    expect(result).toContain("50.00");
    expect(result).toContain("-");
  });

  it("rounds to the currency's precision", () => {
    const result = formatCurrency(1.005, "PHP", "en-US");
    expect(result).toContain("1.01");
  });
});
