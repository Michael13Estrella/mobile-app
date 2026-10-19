/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-19
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { getBeneficiaryTitle, matchesBeneficiarySearch } from "../beneficiary";
import { BeneficiarySummary } from "../../types";

const beneficiary = (
  fields: Partial<BeneficiarySummary> = {},
): BeneficiarySummary => ({
  remitterGuid: "r-1",
  beneficiaryGuid: "b-1",
  beneficiaryType: "I",
  firstName: "JUAN",
  middleName: "SANTOS",
  lastName: "DELA CRUZ",
  companyName: "",
  nameInitial: "JD",
  beneAlias: "",
  relationToBeneDesc: "Self",
  payoutCount: 1,
  myAccountFlag: 1,
  ...fields,
});

describe("getBeneficiaryTitle", () => {
  it("uses the alias first", () => {
    expect(
      getBeneficiaryTitle(beneficiary({ beneAlias: "Juan Savings" })),
    ).toBe("Juan Savings");
  });

  it("uses the company name without an alias", () => {
    expect(
      getBeneficiaryTitle(
        beneficiary({ firstName: "", lastName: "", companyName: "ABC INC." }),
      ),
    ).toBe("ABC INC.");
  });

  it("uses the formatted person name otherwise", () => {
    expect(getBeneficiaryTitle(beneficiary())).toBe("Dela Cruz Juan");
  });

  it("ignores an alias of only spaces", () => {
    expect(getBeneficiaryTitle(beneficiary({ beneAlias: "  " }))).toBe(
      "Dela Cruz Juan",
    );
  });
});

describe("matchesBeneficiarySearch", () => {
  const juan = beneficiary({ beneAlias: "Juan Savings" });

  it("matches everything for an empty search", () => {
    expect(matchesBeneficiarySearch(juan, "")).toBe(true);
    expect(matchesBeneficiarySearch(juan, "  ")).toBe(true);
  });

  it("matches the alias, ignoring case", () => {
    expect(matchesBeneficiarySearch(juan, "SAV")).toBe(true);
  });

  it("matches the person's names and the company name", () => {
    expect(matchesBeneficiarySearch(juan, "santos")).toBe(true);
    expect(matchesBeneficiarySearch(juan, "dela")).toBe(true);
    expect(
      matchesBeneficiarySearch(beneficiary({ companyName: "ABC INC." }), "abc"),
    ).toBe(true);
  });

  it("doesn't match other text", () => {
    expect(matchesBeneficiarySearch(juan, "travel")).toBe(false);
  });
});
