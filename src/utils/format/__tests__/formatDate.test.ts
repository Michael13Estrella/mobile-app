/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-29
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import {
  formatDate,
  formatDateTime,
  formatDateTimeWithSeconds,
  formatIsoDate,
  formatShortDateTime,
} from "../formatDate";

// Every test pins the time zone, so results are the same on any machine.
const TOKYO = "Asia/Tokyo";
const UTC = "UTC";

describe("formatDate", () => {
  it("formats as 'Mon D, YYYY' without zero-padding the day", () => {
    expect(formatDate("2026-06-29T00:00:00Z", "en-US", UTC)).toBe(
      "Jun 29, 2026",
    );
    expect(formatDate("2026-01-05T00:00:00Z", "en-US", UTC)).toBe(
      "Jan 5, 2026",
    );
  });

  it("shows the date in the given time zone", () => {
    // 20:00 UTC on Dec 24 is already Dec 25 in Tokyo (UTC+9).
    expect(formatDate("2026-12-24T20:00:00Z", "en-US", TOKYO)).toBe(
      "Dec 25, 2026",
    );
  });

  it("returns 'Invalid Date' for an un-parseable string", () => {
    expect(formatDate("not-a-date")).toBe("Invalid Date");
  });
});

describe("formatShortDateTime", () => {
  it("formats day-month-year with a 24-hour clock (en-GB)", () => {
    // 22:32 UTC -> 07:32 the next day in Tokyo.
    expect(formatShortDateTime("2026-02-22T22:32:00Z", "en-GB", TOKYO)).toBe(
      "23 Feb 2026, 07:32",
    );
  });

  it("formats in Japanese", () => {
    const result = formatShortDateTime("2026-02-22T22:32:00Z", "ja-JP", TOKYO);
    expect(result).toContain("2026年");
    expect(result).toContain("23日");
    expect(result).toContain("07:32");
  });
});

describe("formatDateTime", () => {
  it("uses en-US by default, 12-hour", () => {
    const result = formatDateTime("2026-06-29T14:30:00Z", undefined, UTC);
    expect(result).toContain("02:30");
    expect(result).toMatch(/PM/);
  });

  it("converts UTC to Japan time", () => {
    // 14:30 UTC -> 23:30 JST (UTC+9, no daylight saving).
    const result = formatDateTime("2026-06-29T14:30:00Z", "ja-JP", TOKYO);
    expect(result).toContain("2026");
    expect(result).toContain("23:30");
  });
});

describe("formatDateTimeWithSeconds", () => {
  it("includes the seconds", () => {
    // 05:31:50 UTC -> 14:31:50 JST = 2:31:50 PM.
    const result = formatDateTimeWithSeconds(
      "2023-11-25T05:31:50Z",
      "en-US",
      TOKYO,
    );
    expect(result).toContain("Nov 25, 2023");
    // \s also matches the narrow space newer Intl versions put before PM.
    expect(result).toMatch(/2:31:50\sPM/);
  });
});

describe("formatIsoDate", () => {
  it("formats as MM/DD/YYYY in English", () => {
    expect(formatIsoDate("2026-06-29", "en")).toBe("06/29/2026");
  });

  it("formats as YYYY年MM月DD日 in Japanese", () => {
    expect(formatIsoDate("2026-06-29", "ja")).toBe("2026年06月29日");
  });

  it("returns other formats unchanged", () => {
    expect(formatIsoDate("2026/06/29", "en")).toBe("2026/06/29");
    expect(formatIsoDate("", "ja")).toBe("");
  });
});
