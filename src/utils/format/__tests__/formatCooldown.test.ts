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

import { formatCooldown } from "../formatCooldown";

describe("formatCooldown", () => {
  it("formats minutes and seconds with two digits each", () => {
    expect(formatCooldown(299)).toBe("04:59");
    expect(formatCooldown(30)).toBe("00:30");
    expect(formatCooldown(5)).toBe("00:05");
  });

  it("handles whole minutes", () => {
    expect(formatCooldown(60)).toBe("01:00");
    expect(formatCooldown(600)).toBe("10:00");
  });

  it("shows 00:00 at zero and below", () => {
    expect(formatCooldown(0)).toBe("00:00");
    expect(formatCooldown(-1)).toBe("00:00");
  });
});
