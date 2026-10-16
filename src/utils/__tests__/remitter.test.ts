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

import { getRemitterDisplayName } from "../remitter";
import { JAPANESE_NATIONALITY_CODE } from "../../constants/nationality";

// A non-Japanese remitter, as the server sends it (capitals).
const base = {
  firstName: "JUAN",
  lastName: "DELA CRUZ",
  nickName: "JUN",
  nationality: "PH",
};

describe("getRemitterDisplayName", () => {
  it("uses the nickname for non-Japanese nationals", () => {
    expect(getRemitterDisplayName(base)).toBe("Jun");
  });

  it("uses the last name for Japanese nationals", () => {
    expect(
      getRemitterDisplayName({
        ...base,
        nationality: JAPANESE_NATIONALITY_CODE,
        lastName: "TANAKA",
        nickName: "",
      }),
    ).toBe("Tanaka");
  });

  it("falls back to the first name when the chosen field is empty", () => {
    expect(getRemitterDisplayName({ ...base, nickName: "  " })).toBe("Juan");
  });

  it("formats the name for display", () => {
    expect(getRemitterDisplayName({ ...base, nickName: "MARY-ANN" })).toBe(
      "Mary-Ann",
    );
  });

  it("keeps Japanese names unchanged", () => {
    expect(
      getRemitterDisplayName({
        ...base,
        nationality: JAPANESE_NATIONALITY_CODE,
        lastName: "田中",
      }),
    ).toBe("田中");
  });
});
