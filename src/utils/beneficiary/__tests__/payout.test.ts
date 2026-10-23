/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-23
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { isEWalletPayout, toCreateMetrobankPayout } from "../payout";

describe("isEWalletPayout", () => {
  it("is true for GCash and Maya sent as Other banks", () => {
    expect(isEWalletPayout({ payoutType: "OB", bankCode: "0273" })).toBe(true);
    expect(isEWalletPayout({ payoutType: "OB", bankCode: "0270" })).toBe(true);
  });

  it("is false for other banks", () => {
    expect(isEWalletPayout({ payoutType: "OB", bankCode: "0010" })).toBe(false);
  });

  it("is false when the payout type isn't Other banks", () => {
    expect(isEWalletPayout({ payoutType: "CA", bankCode: "0273" })).toBe(false);
  });
});

describe("toCreateMetrobankPayout", () => {
  const values = {
    accountNo: "3456789121537",
    currency: "PHP",
    branchName: "",
  } as const;

  it("is a Metrobank account payout with the typed account and currency", () => {
    const result = toCreateMetrobankPayout(values);
    expect(result.payoutType).toBe("CA");
    expect(result.caAccountNo).toBe("3456789121537");
    expect(result.currency).toBe("PHP");
  });

  it("sends the branch trimmed, and leaves it out when empty", () => {
    expect(
      toCreateMetrobankPayout({ ...values, branchName: " Makati " })
        .caBranchName,
    ).toBe("Makati");
    expect(
      JSON.parse(JSON.stringify(toCreateMetrobankPayout(values))),
    ).not.toHaveProperty("caBranchName");
  });
});
