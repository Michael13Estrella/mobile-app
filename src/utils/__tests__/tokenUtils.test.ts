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

// Build a structurally-valid JWT: header.payload.signature (base64url)
// jwt-decode only reads the payload, so the signature can be anything

import { decodeToken, isTokenExpired } from "../tokenUtils";

const makeJwt = (payload: Record<string, unknown>): string => {
  const b64url = (obj: unknown) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");
  return `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url(payload)}.sig`;
};

// --- decodeToken ---
describe("decodeToken", () => {
  it("maps sub -> id and reads email", () => {
    const token = makeJwt({ sub: "user-123", email: "a@b.com" });
    expect(decodeToken(token)).toEqual({ id: "user-123", email: "a@b.com" });
  });

  it("returns null for a malformed token", () => {
    expect(decodeToken("not-a-jwt")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(decodeToken("")).toBeNull();
  });
});

// --- isTokenExpired ---
describe("isTokenExpired", () => {
  const NOW = new Date("2026-06-29T00:00:00Z").getTime();

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(NOW);
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it("returns false when exp is in the future", () => {
    const token = makeJwt({ exp: Math.floor(NOW / 1000) + 60 }); // +60s
    expect(isTokenExpired(token)).toBe(false);
  });

  it("returns true when exp is in the past", () => {
    const token = makeJwt({ exp: Math.floor(NOW / 1000) - 60 }); // -60s
    expect(isTokenExpired(token)).toBe(true);
  });

  it("treats exp = 0 as expired (offline-token sentinel)", () => {
    const token = makeJwt({ exp: 0 });
    expect(isTokenExpired(token)).toBe(true);
  });

  it("returns true for a malformed token (fail-safe)", () => {
    expect(isTokenExpired("garbage")).toBe(true);
  });
});
