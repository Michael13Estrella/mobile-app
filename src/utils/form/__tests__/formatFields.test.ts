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

import { formatPostalCode, trimFields, uppercaseFields } from "../formatFields";

describe("uppercaseFields", () => {
  it("uppercases only the given fields", () => {
    expect(
      uppercaseFields({ lastName: "dela cruz", email: "a@b.jp" }, ["lastName"]),
    ).toEqual({ lastName: "DELA CRUZ", email: "a@b.jp" });
  });

  it("leaves non-string fields as they are", () => {
    expect(uppercaseFields({ age: 30, name: "juan" }, ["age", "name"])).toEqual(
      { age: 30, name: "JUAN" },
    );
  });

  it("does not change the original object", () => {
    const original = { lastName: "cruz" };
    uppercaseFields(original, ["lastName"]);
    expect(original.lastName).toBe("cruz");
  });
});

describe("trimFields", () => {
  it("trims every string field", () => {
    expect(trimFields({ email: " a@b.jp ", name: "Juan  " })).toEqual({
      email: "a@b.jp",
      name: "Juan",
    });
  });

  it("leaves skipped fields as they are", () => {
    expect(
      trimFields({ email: " a@b.jp ", password: " secret " }, ["password"]),
    ).toEqual({ email: "a@b.jp", password: " secret " });
  });

  it("keeps spaces inside values and ignores non-strings", () => {
    expect(trimFields({ name: " Juan Carlos ", count: 2 })).toEqual({
      name: "Juan Carlos",
      count: 2,
    });
  });

  it("does not change the original object", () => {
    const original = { email: " a@b.jp " };
    trimFields(original);
    expect(original.email).toBe(" a@b.jp ");
  });
});

describe("formatPostalCode", () => {
  it("adds the hyphen to 7 digits", () => {
    expect(formatPostalCode("1234567")).toBe("123-4567");
  });

  it("returns anything else unchanged", () => {
    expect(formatPostalCode("123-4567")).toBe("123-4567");
    expect(formatPostalCode("123456")).toBe("123456");
    expect(formatPostalCode("")).toBe("");
  });
});
