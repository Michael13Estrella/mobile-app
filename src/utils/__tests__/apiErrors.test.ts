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

import { firstErrorMessage } from "../apiErrors";

describe("firstErrorMessage", () => {
  it("returns the first message of the first field", () => {
    expect(
      firstErrorMessage({
        Email: ["Invalid email", "Email is required"],
        Password: ["Too short"],
      }),
    ).toBe("Invalid email");
  });

  it("skips fields without messages", () => {
    expect(firstErrorMessage({ Email: [], Password: ["Too short"] })).toBe(
      "Too short",
    );
  });

  it("returns undefined when there are no messages", () => {
    expect(firstErrorMessage(undefined)).toBeUndefined();
    expect(firstErrorMessage({})).toBeUndefined();
    expect(firstErrorMessage({ Email: [] })).toBeUndefined();
  });
});
