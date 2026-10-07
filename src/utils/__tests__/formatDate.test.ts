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

import { formatDate, formatDateTime } from "../formatDate";

// --- formatDate ---
describe("formatDate", () => {
  it("formats an ISO date string as 'Mon D, YYYY'", () => {
    expect(formatDate("2026-06-29")).toBe("Jun 29, 2026");
  });

  it("does not zero-pad the day", () => {
    expect(formatDate("2026-01-05")).toBe("Jan 5, 2026");
  });

  it("handles a full ISO datetime (UTC)", () => {
    expect(formatDate("2026-12-25T00:00:00Z")).toBe("Dec 25, 2026");
  });

  it("returns 'Invalid Date' for an un-parseable string", () => {
    expect(formatDate("not-a-date")).toBe("Invalid Date");
  });
});

// --- formatDateTime ---
describe("formatDateTime (Japan / JST )", () => {
  it("falls back to the default locale (en-US) when none is given", () => {
    // Pass undefined for locale -> default DEFAULT_LOCALE
    const result = formatDateTime("2026-06-29T14:30:00Z", undefined, "UTC");
    expect(result).toContain("02:30");
    expect(result).toMatch(/PM/);
  });

  it("formats UTC to JST (YYYY年MM月DD日 HH:mm)", () => {
    // 14:30 UTC -> 23:30 JST (Asia/Tokyo is UTC+9, no DST)
    const result = formatDateTime(
      "2026-06-29T14:30:00Z",
      "ja-JP",
      "Asia/Tokyo",
    );
    expect(result).toContain("23:30");
    expect(result).toContain("2026");
  });

  it("formats UTC to JST (Mon D, YYYY, HH:mm AM/PM)", () => {
    const result = formatDateTime(
      "2026-06-29T14:30:00Z",
      "en-US",
      "Asia/Tokyo",
    );
    expect(result).toContain("");
    expect(result).toContain("11:30");
    expect(result).toContain("2026");
    expect(result).toMatch(/PM/);
  });
});
