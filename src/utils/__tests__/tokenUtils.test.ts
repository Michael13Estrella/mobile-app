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

import { decodeToken, isTokenExpired } from "../tokenUtils";

// A structurally valid JWT (header.payload.signature, base64url). jwt-decode
// only reads the payload, so the signature can be anything.
const makeJwt = (payload: Record<string, unknown>): string => {
  const b64url = (obj: unknown) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");
  return `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url(payload)}.sig`;
};

describe("decodeToken", () => {
  it("maps sub -> id and reads the email", () => {
    const token = makeJwt({ sub: "user-123", email: "a@b.com" });
    expect(decodeToken(token)).toEqual({ id: "user-123", email: "a@b.com" });
  });

  it("ignores other claims", () => {
    const token = makeJwt({
      sub: "user-123",
      email: "a@b.com",
      given_name: "Juan",
      exp: 123,
    });
    expect(decodeToken(token)).toEqual({ id: "user-123", email: "a@b.com" });
  });

  it("returns null for a malformed or empty token", () => {
    expect(decodeToken("not-a-jwt")).toBeNull();
    expect(decodeToken("")).toBeNull();
  });
});

describe("isTokenExpired", () => {
  const NOW = new Date("2026-06-29T00:00:00Z").getTime();
  const nowSeconds = Math.floor(NOW / 1000);

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(NOW);
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it("returns false when exp is in the future", () => {
    expect(isTokenExpired(makeJwt({ exp: nowSeconds + 60 }))).toBe(false);
  });

  it("returns true when exp is in the past", () => {
    expect(isTokenExpired(makeJwt({ exp: nowSeconds - 60 }))).toBe(true);
  });

  it("treats exp = 0 as expired (offline-token sentinel)", () => {
    expect(isTokenExpired(makeJwt({ exp: 0 }))).toBe(true);
  });

  it("treats a token without exp as expired (fail-safe)", () => {
    expect(isTokenExpired(makeJwt({ sub: "user-123" }))).toBe(true);
    expect(isTokenExpired(makeJwt({ exp: "soon" }))).toBe(true);
  });

  it("returns true for a malformed token (fail-safe)", () => {
    expect(isTokenExpired("garbage")).toBe(true);
  });
});
