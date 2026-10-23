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

import { maskEmail } from "../maskEmail";

describe("maskEmail", () => {
  it("keeps the first 2 characters and the domain", () => {
    expect(maskEmail("lorem@gmail.com")).toBe("lo****@gmail.com");
  });

  it("uses the same mask length for any address length", () => {
    expect(maskEmail("ab@x.jp")).toBe("ab****@x.jp");
    expect(maskEmail("averyverylongname@x.jp")).toBe("av****@x.jp");
  });

  it("keeps what there is of a 1-character local part", () => {
    expect(maskEmail("a@x.jp")).toBe("a****@x.jp");
  });

  it("returns anything that isn't an email unchanged", () => {
    expect(maskEmail("not-an-email")).toBe("not-an-email");
    expect(maskEmail("@x.jp")).toBe("@x.jp");
    expect(maskEmail("name@")).toBe("name@");
    expect(maskEmail("")).toBe("");
  });
});
