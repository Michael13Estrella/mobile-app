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

import {
  getBeneficiaryAddress,
  getBeneficiaryFullName,
  getBeneficiaryTitle,
  isEWalletPayout,
  matchesBeneficiarySearch,
} from "../beneficiary";
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

describe("getBeneficiaryFullName", () => {
  const names = {
    firstName: "JOSH",
    middleName: "CULLEN",
    lastName: "SANTOS",
    companyName: "",
  };

  it("joins and formats first, middle and last name", () => {
    expect(getBeneficiaryFullName(names)).toBe("Josh Cullen Santos");
  });

  it("skips an empty middle name", () => {
    expect(getBeneficiaryFullName({ ...names, middleName: "" })).toBe(
      "Josh Santos",
    );
  });

  it("uses the company name for companies", () => {
    expect(getBeneficiaryFullName({ ...names, companyName: "ABC INC." })).toBe(
      "ABC INC.",
    );
  });
});

describe("getBeneficiaryAddress", () => {
  it("joins the parts on separate lines", () => {
    expect(
      getBeneficiaryAddress({
        address1: "1999 Anastacio Street",
        address2: "Guadalupe Nuevo",
        zipPosCode: "1212",
      }),
    ).toBe("1999 Anastacio Street,\nGuadalupe Nuevo,\n1212");
  });

  it("leaves out empty parts", () => {
    expect(
      getBeneficiaryAddress({
        address1: "1999 Anastacio Street",
        address2: " ",
        zipPosCode: "",
      }),
    ).toBe("1999 Anastacio Street");
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
