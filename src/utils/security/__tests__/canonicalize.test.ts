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

import { jcs } from "../canonicalize";

describe("jcs (RFC 8785 JSON canonicalization)", () => {
  it("sorts object keys lexicographically", () => {
    expect(jcs({ b: 1, a: 2 })).toBe('{"a":2,"b":1}');
  });

  // The property DBRS relies on: insertion order must not change the bytes,
  // so the client and server sign the exact same string.
  it("produces identical output regardless of key insertion order", () => {
    const a = jcs({ method: "POST", path: "/x", nonce: "n" });
    const b = jcs({ nonce: "n", path: "/x", method: "POST" });
    expect(a).toBe(b);
  });

  it("sorts nested object keys recursively", () => {
    expect(jcs({ z: { b: 1, a: 2 }, a: 1 })).toBe('{"a":1,"z":{"a":2,"b":1}}');
  });

  it("preserves array order (arrays are NOT sorted)", () => {
    expect(jcs([3, 1, 2])).toBe("[3,1,2]");
  });

  it("emits no insignificant whitespace", () => {
    expect(jcs({ a: 1, b: [1, 2] })).not.toMatch(/\s/);
  });

  it("normalizes numbers to canonical form (1.0 -> 1)", () => {
    expect(jcs({ n: 1.0 })).toBe('{"n":1}');
  });

  it("omits properties whose value is undefined", () => {
    expect(jcs({ a: undefined, b: 1 })).toBe('{"b":1}');
  });

  it("serializes top-level primitives", () => {
    expect(jcs("hi")).toBe('"hi"');
    expect(jcs(42)).toBe("42");
    expect(jcs(true)).toBe("true");
    expect(jcs(null)).toBe("null");
  });

  it("returns an empty string for undefined input", () => {
    // canonicalize(undefined) -> undefined, and jcs coalesces to ""
    expect(jcs(undefined)).toBe("");
  });
});
