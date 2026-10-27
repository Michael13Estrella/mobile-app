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

  it("reads the server's list of error objects", () => {
    expect(
      firstErrorMessage([
        {
          propertyName: "Payout.CABankNameCode",
          message: "Bank Code is required field.",
          metaData: "",
        },
      ]),
    ).toBe("Bank Code is required field.");
  });

  it("reads error objects grouped by field", () => {
    expect(
      firstErrorMessage({
        CaBankNameCode: [
          { propertyName: "CaBankNameCode", message: "Required" },
        ],
      }),
    ).toBe("Required");
  });

  it("never returns anything but a message", () => {
    expect(
      firstErrorMessage([{ propertyName: "X", metaData: "" }]),
    ).toBeUndefined();
    expect(firstErrorMessage([{ message: 42 }])).toBeUndefined();
    expect(firstErrorMessage("oops")).toBeUndefined();
    expect(firstErrorMessage(null)).toBeUndefined();
  });
});
