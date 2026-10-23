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
  matchesBeneficiarySearch,
  toCreateCorporateBeneficiary,
  toCreateIndividualBeneficiary,
} from "../beneficiary";
import { BeneficiarySummary } from "../../../types";
import {
  EMPTY_INDIVIDUAL_FORM,
  IndividualFormValues,
} from "../../../schemas/beneficiary/individualBeneficiarySchema";
import {
  CorporateFormValues,
  EMPTY_CORPORATE_FORM,
} from "../../../schemas/beneficiary/corporateBeneficiarySchema";

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

describe("toCreateIndividualBeneficiary", () => {
  const values = (
    fields: Partial<IndividualFormValues> = {},
  ): IndividualFormValues => ({
    ...EMPTY_INDIVIDUAL_FORM,
    lastName: "Santos",
    firstName: "Josh",
    addressLine1: "1999 Anastacio Street",
    cityProvCode: "1376",
    zipPosCode: "1212",
    relationToBeneCode: "05",
    ...fields,
  });

  it("is an individual, not the own account, by default", () => {
    const result = toCreateIndividualBeneficiary(values(), false);
    expect(result.beneficiaryType).toBe("I");
    expect(result.myAccountFlg).toBe(0);
  });

  it("flags the remitter's own account", () => {
    expect(toCreateIndividualBeneficiary(values(), true).myAccountFlg).toBe(1);
  });

  it("maps the form names to the API names", () => {
    const result = toCreateIndividualBeneficiary(
      values({ birthDate: "1993-10-22", addressLine2: "Guadalupe Nuevo" }),
      false,
    );
    expect(result.birthOrEstablishDate).toBe("1993-10-22");
    expect(result.address1).toBe("1999 Anastacio Street");
    expect(result.address2).toBe("Guadalupe Nuevo");
  });

  it("trims the typed values", () => {
    const result = toCreateIndividualBeneficiary(
      values({ firstName: "  Josh ", beneAlias: " JS " }),
      false,
    );
    expect(result.firstName).toBe("Josh");
    expect(result.beneAlias).toBe("JS");
  });

  it("leaves empty optional fields out of the request", () => {
    const json = JSON.parse(
      JSON.stringify(toCreateIndividualBeneficiary(values(), false)),
    );
    for (const field of [
      "beneAlias",
      "middleName",
      "gender",
      "birthOrEstablishDate",
      "address2",
      "mobileNo",
    ]) {
      expect(json).not.toHaveProperty(field);
    }
  });
});

describe("toCreateCorporateBeneficiary", () => {
  const values = (
    fields: Partial<CorporateFormValues> = {},
  ): CorporateFormValues => ({
    ...EMPTY_CORPORATE_FORM,
    companyName: "Acme Trading Inc.",
    officeTelNo: "9171234567",
    addressLine1: "88 Ayala Avenue",
    cityProvCode: "1376",
    zipPosCode: "1226",
    relationToBeneCode: "09",
    ...fields,
  });

  it("is a corporate beneficiary, never the own account", () => {
    const result = toCreateCorporateBeneficiary(values());
    expect(result.beneficiaryType).toBe("C");
    expect(result.myAccountFlg).toBe(0);
  });

  it("sends the company fields and the shared ones, trimmed", () => {
    const result = toCreateCorporateBeneficiary(
      values({ companyName: "  Acme Trading Inc. " }),
    );
    expect(result.companyName).toBe("Acme Trading Inc.");
    expect(result.officeTelNo).toBe("9171234567");
    expect(result.address1).toBe("88 Ayala Avenue");
    expect(result.zipPosCode).toBe("1226");
  });

  it("sends no person fields and leaves empty optional fields out", () => {
    const json = JSON.parse(
      JSON.stringify(toCreateCorporateBeneficiary(values())),
    );
    for (const field of [
      "firstName",
      "lastName",
      "beneAlias",
      "gender",
      "birthOrEstablishDate",
      "address2",
      "mobileNo",
    ]) {
      expect(json).not.toHaveProperty(field);
    }
  });
});
