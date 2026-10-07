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
  createHmac,
  createVerify,
  generateKeyPairSync,
  hkdfSync,
  createDecipheriv,
  randomBytes,
} from "node:crypto";
import {
  sha256Base64,
  hmacSha256Base64,
  signEcdsaBase64,
  randomNonce,
  encryptBodyGcm,
} from "../crypto";
import { SECURITY } from "../../constants/security";

describe("sha256Base64", () => {
  it("matches a known SHA-256 vector for 'abc'", () => {
    expect(sha256Base64("abc")).toBe(
      "ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0=",
    );
  });
});

describe("hmacSha256Base64", () => {
  it("matches an independent HMAC computation (correct key/digest wiring)", () => {
    const keyBase64 = randomBytes(32).toString("base64");
    const data = "message-to-authenticate";
    const expected = createHmac("sha256", Buffer.from(keyBase64, "base64"))
      .update(data)
      .digest("base64");
    expect(hmacSha256Base64(keyBase64, data)).toBe(expected);
  });

  it("is deterministic and key-dependent", () => {
    const k1 = randomBytes(32).toString("base64");
    const k2 = randomBytes(32).toString("base64");
    expect(hmacSha256Base64(k1, "x")).toBe(hmacSha256Base64(k1, "x"));
    expect(hmacSha256Base64(k1, "x")).not.toBe(hmacSha256Base64(k2, "x"));
  });
});

describe("signEcdsaBase64", () => {
  const newKeyPair = () => {
    const { privateKey, publicKey } = generateKeyPairSync("ec", {
      namedCurve: "prime256v1", // P-256, matches DBRS
    });
    return {
      pem: privateKey.export({ format: "pem", type: "pkcs8" }).toString(),
      publicKey,
    };
  };

  it("produces a signature verifiable with the public key", () => {
    const { pem, publicKey } = newKeyPair();
    const data = "descriptor-to-sign";

    const sig = signEcdsaBase64(pem, data);

    const verify = createVerify("SHA256");
    verify.update(data);
    expect(verify.verify(publicKey, Buffer.from(sig, "base64"))).toBe(true);
  });

  it("fails verification when the data is tampered", () => {
    const { pem, publicKey } = newKeyPair();
    const sig = signEcdsaBase64(pem, "original");

    const verify = createVerify("SHA256");
    verify.update("tampered");
    expect(verify.verify(publicKey, Buffer.from(sig, "base64"))).toBe(false);
  });
});

describe("randomNonce", () => {
  it("returns a unique UUID", () => {
    const a = randomNonce();
    const b = randomNonce();
    expect(a).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(a).not.toBe(b);
  });
});

describe("encryptBodyGcm", () => {
  const C = SECURITY.CRYPTO;

  it("round-trips: decrypting with the re-derived key recovers the plaintext", () => {
    const keyBase64 = randomBytes(32).toString("base64");
    const nonce = randomNonce();
    const plaintext = JSON.stringify({ amount: 1000, currency: "PHP" });

    const { tag, ciphertext } = encryptBodyGcm(keyBase64, plaintext, nonce);

    // Re-derive key+iv exactly as the implementation does (HKDF), then decrypt.
    const out = Buffer.from(
      hkdfSync(
        C.HKDF_HASH,
        Buffer.from(keyBase64, C.ENCODING),
        Buffer.from(nonce),
        Buffer.from(C.HKDF_INFO),
        C.KEY_BYTES + C.IV_BYTES,
      ),
    );
    const key = out.subarray(0, C.KEY_BYTES);
    const iv = out.subarray(C.KEY_BYTES);

    const decipher = createDecipheriv(C.AEAD_ALGORITHM, key, iv, {
      authTagLength: C.AUTH_TAG_BYTES,
    });
    decipher.setAuthTag(Buffer.from(tag, C.ENCODING));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(ciphertext, C.ENCODING)),
      decipher.final(),
    ]).toString("utf8");

    expect(decrypted).toBe(plaintext);
  });

  it("yields different ciphertext per nonce (unique IV)", () => {
    const keyBase64 = randomBytes(32).toString("base64");
    const a = encryptBodyGcm(keyBase64, "hello", randomNonce());
    const b = encryptBodyGcm(keyBase64, "hello", randomNonce());
    expect(a.ciphertext).not.toBe(b.ciphertext);
  });
});
