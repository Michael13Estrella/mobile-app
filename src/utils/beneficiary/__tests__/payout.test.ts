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

import {
  formatMetrobankAccountNo,
  isEWalletBankCode,
  isEWalletPayout,
  maskAccountNumber,
  toCreateMetrobankPayout,
  toCreateOtherBankPayout,
  toMetrobankPayoutSummary,
  toOtherBankPayoutSummary,
} from "../payout";

describe("isEWalletBankCode", () => {
  it("is true for GCash and Maya", () => {
    expect(isEWalletBankCode("0273")).toBe(true);
    expect(isEWalletBankCode("0270")).toBe(true);
  });

  it("is false for a bank, or no bank yet", () => {
    expect(isEWalletBankCode("0010")).toBe(false);
    expect(isEWalletBankCode("")).toBe(false);
  });
});

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

describe("toMetrobankPayoutSummary", () => {
  it("shows Metrobank with the account number and currency", () => {
    expect(
      toMetrobankPayoutSummary(
        toCreateMetrobankPayout({
          accountNo: "3456789121537",
          currency: "USD",
          branchName: "",
        }),
      ),
    ).toEqual({
      payoutType: "CA",
      bankCode: expect.any(String),
      bankName: "Metrobank",
      accountNo: "3456789121537",
      currency: "USD",
    });
  });
});

describe("formatMetrobankAccountNo", () => {
  it("groups the 13 digits as on the card", () => {
    expect(formatMetrobankAccountNo("3456789121537")).toBe("345 678 912 1537");
  });
});

describe("maskAccountNumber", () => {
  it("shows only the last 4 digits", () => {
    expect(maskAccountNumber("3456789121537")).toBe("•••• 1537");
  });

  it("leaves a number of 4 digits or less as it is", () => {
    expect(maskAccountNumber("1537")).toBe("1537");
  });
});

describe("toOtherBankPayoutSummary", () => {
  it("shows the picked bank with the account number and currency", () => {
    expect(
      toOtherBankPayoutSummary(
        {
          payoutType: "OB",
          currency: "PHP",
          obBankNameCode: "0273",
          obAccountNo: "09171234567",
        },
        "GCash",
      ),
    ).toEqual({
      payoutType: "OB",
      bankCode: "0273",
      bankName: "GCash",
      accountNo: "09171234567",
      currency: "PHP",
    });
  });
});
