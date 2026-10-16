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
  calculateAge,
  isFutureDate,
  isValidCalendarDate,
} from "../dateValidation";

describe("isValidCalendarDate", () => {
  it("accepts real dates", () => {
    expect(isValidCalendarDate("2026-10-16")).toBe(true);
    expect(isValidCalendarDate("2026-12-31")).toBe(true);
  });

  it("handles leap years", () => {
    expect(isValidCalendarDate("2024-02-29")).toBe(true);
    expect(isValidCalendarDate("2025-02-29")).toBe(false);
    // Century rule: 1900 was not a leap year, 2000 was.
    expect(isValidCalendarDate("1900-02-29")).toBe(false);
    expect(isValidCalendarDate("2000-02-29")).toBe(true);
  });

  it("rejects days and months that don't exist", () => {
    expect(isValidCalendarDate("2026-02-30")).toBe(false);
    expect(isValidCalendarDate("2026-04-31")).toBe(false);
    expect(isValidCalendarDate("2026-13-01")).toBe(false);
    expect(isValidCalendarDate("2026-00-10")).toBe(false);
    expect(isValidCalendarDate("2026-01-00")).toBe(false);
  });

  it("rejects other formats", () => {
    expect(isValidCalendarDate("2026/10/16")).toBe(false);
    expect(isValidCalendarDate("16-10-2026")).toBe(false);
    expect(isValidCalendarDate("2026-1-6")).toBe(false);
    expect(isValidCalendarDate("")).toBe(false);
  });
});

describe("with a fixed today (2026-10-16)", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 9, 16, 12, 0, 0));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("isFutureDate", () => {
    it("is true from tomorrow on", () => {
      expect(isFutureDate("2026-10-17")).toBe(true);
      expect(isFutureDate("2030-01-01")).toBe(true);
    });

    it("is false for today and the past", () => {
      expect(isFutureDate("2026-10-16")).toBe(false);
      expect(isFutureDate("2026-10-15")).toBe(false);
    });
  });

  describe("calculateAge", () => {
    it("counts the birthday itself", () => {
      expect(calculateAge("2000-10-16")).toBe(26);
    });

    it("is one year less before the birthday", () => {
      expect(calculateAge("2000-10-17")).toBe(25);
      expect(calculateAge("2000-12-01")).toBe(25);
    });

    it("counts a birthday earlier in the year", () => {
      expect(calculateAge("2000-01-01")).toBe(26);
    });

    it("is 0 in the first year", () => {
      expect(calculateAge("2026-01-01")).toBe(0);
    });
  });
});
