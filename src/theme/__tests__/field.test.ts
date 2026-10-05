import { resolveFieldStatus } from "../field";

const base = {
  disabled: false,
  hasError: false,
  showSuccess: false,
  isFocused: false,
};

describe("resolveFieldStatus", () => {
  it("returns default when nothing applies", () => {
    expect(resolveFieldStatus(base)).toBe("default");
  });

  it("keeps error while focused", () => {
    expect(
      resolveFieldStatus({ ...base, hasError: true, isFocused: true }),
    ).toBe("error");
  });

  it("prefers error over success", () => {
    expect(
      resolveFieldStatus({ ...base, hasError: true, showSuccess: true }),
    ).toBe("error");
  });

  it("prefers disabled over everything", () => {
    expect(
      resolveFieldStatus({
        disabled: true,
        hasError: true,
        showSuccess: true,
        isFocused: true,
      }),
    ).toBe("disabled");
  });
});
