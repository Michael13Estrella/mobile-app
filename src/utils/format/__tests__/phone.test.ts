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

import {
  formatPhoneNumber,
  getPhoneDigitCount,
  isValidPhoneNumber,
  toDomesticPhoneNumber,
  toPhoneDigits,
} from "../phone";
import { PHONE_COUNTRIES } from "../../../constants/phone";

const JP = PHONE_COUNTRIES.JP;
const PH = PHONE_COUNTRIES.PH;

describe("getPhoneDigitCount", () => {
  it("counts the template's placeholders", () => {
    expect(getPhoneDigitCount(JP)).toBe(10);
    expect(getPhoneDigitCount(PH)).toBe(10);
  });
});

describe("toPhoneDigits", () => {
  it("keeps digits only", () => {
    expect(toPhoneDigits(JP, "90-1234-5678")).toBe("9012345678");
    expect(toPhoneDigits(JP, "90 1234 5678")).toBe("9012345678");
  });

  it("drops the domestic leading 0", () => {
    expect(toPhoneDigits(JP, "090-1234-5678")).toBe("9012345678");
    expect(toPhoneDigits(PH, "0917 123 4567")).toBe("9171234567");
  });

  it("drops a pasted +country code", () => {
    expect(toPhoneDigits(JP, "+81 90-1234-5678")).toBe("9012345678");
    expect(toPhoneDigits(PH, "+63 917 123 4567")).toBe("9171234567");
    // "+81 0…" as some contacts store it.
    expect(toPhoneDigits(JP, "+81 090-1234-5678")).toBe("9012345678");
  });

  it("keeps the code's digits when there is no +", () => {
    // Without "+", 81… is part of the number, not a country code.
    expect(toPhoneDigits(JP, "8112345678")).toBe("8112345678");
  });

  it("caps the length at the country's digit count", () => {
    expect(toPhoneDigits(JP, "901234567899")).toBe("9012345678");
  });
});

describe("isValidPhoneNumber", () => {
  it("accepts exactly the digit count", () => {
    expect(isValidPhoneNumber(JP, "9012345678")).toBe(true);
  });

  it("rejects too few or too many digits, and non-digits", () => {
    expect(isValidPhoneNumber(JP, "901234567")).toBe(false);
    expect(isValidPhoneNumber(JP, "90123456789")).toBe(false);
    expect(isValidPhoneNumber(JP, "90123a5678")).toBe(false);
    expect(isValidPhoneNumber(JP, "")).toBe(false);
  });
});

describe("formatPhoneNumber", () => {
  it("formats with the country code and template", () => {
    expect(formatPhoneNumber(JP, "9012345678")).toBe("+81 90 1234 5678");
    expect(formatPhoneNumber(PH, "9171234567")).toBe("+63 917 123 4567");
  });

  it("leaves missing digits empty", () => {
    expect(formatPhoneNumber(JP, "90")).toBe("+81 90  ");
  });
});

describe("toDomesticPhoneNumber", () => {
  it("adds the leading 0", () => {
    expect(toDomesticPhoneNumber("9171234567")).toBe("09171234567");
  });
});
