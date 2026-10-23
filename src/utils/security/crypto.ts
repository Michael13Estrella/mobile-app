/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import QuickCrypto, { Buffer } from "react-native-quick-crypto";
import { SECURITY } from "../../constants/security";

const CRYPTO = SECURITY.CRYPTO;

/**
 * SHA-256 hash of a string, for request body hashes in signed requests.
 *
 * @param data - The text to hash.
 * @returns The hash, Base64-encoded.
 * @example sha256Base64("abc"); // "ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0="
 */
export const sha256Base64 = (data: string): string => {
  const hash = QuickCrypto.createHash("sha256");
  hash.update(data);

  return hash.digest("base64");
};

/**
 * HMAC-SHA256 of a string with a shared key ("critical" requests): proves
 * the request came from this device and wasn't changed.
 *
 * @param keyBase64 - The device's HMAC key, Base64-encoded.
 * @param data - The text to authenticate (the canonical request).
 * @returns The HMAC, Base64-encoded.
 * @example hmacSha256Base64(hmacKey, jcs(descriptor));
 */
export const hmacSha256Base64 = (keyBase64: string, data: string): string => {
  const key = Buffer.from(keyBase64, "base64");
  const hmac = QuickCrypto.createHmac("sha256", key);
  hmac.update(data);

  return hmac.digest("base64");
};

/**
 * ECDSA (P-256) signature with the device's private key (DBRS): the server
 * verifies it with the public key registered at device enrollment.
 *
 * @param privateKeyPem - The device's private key, PKCS#8 PEM.
 * @param data - The text to sign (the canonical request).
 * @returns The signature, Base64-encoded.
 * @example signEcdsaBase64(devicePrivateKey, jcs(descriptor));
 */
export const signEcdsaBase64 = (
  privateKeyPem: string,
  data: string,
): string => {
  const signer = QuickCrypto.createSign("SHA256");
  signer.update(data);

  const signature = signer.sign({
    key: privateKeyPem,
    format: "pem",
    type: "pkcs8",
  });

  return signature.toString("base64");
};

/**
 * A random, unique value per request (prevents replaying a signed request).
 *
 * @returns A random UUID (v4).
 * @example randomNonce(); // "3b241101-e2bb-4255-8caf-4136c566a962"
 */
export const randomNonce = (): string => QuickCrypto.randomUUID();

/**
 * Encrypts a request body with AES-256-GCM ("encrypt" requests). The key
 * and IV are derived (HKDF) from the shared key and the request's nonce,
 * so every request is encrypted differently.
 *
 * @param keyBase64 - The shared encryption key, Base64-encoded.
 * @param plaintext - The body to encrypt (JSON text).
 * @param nonce - The request's nonce (unique per request -> unique IV).
 * @returns The ciphertext and its authentication tag, Base64-encoded.
 * @example encryptBodyGcm(key, JSON.stringify(body), nonce);
 */
export const encryptBodyGcm = (
  keyBase64: string,
  plaintext: string,
  nonce: string, // unique per request -> unique IV
): { tag: string; ciphertext: string } => {
  const out = Buffer.from(
    QuickCrypto.hkdfSync(
      CRYPTO.HKDF_HASH,
      Buffer.from(keyBase64, CRYPTO.ENCODING),
      Buffer.from(nonce),
      Buffer.from(CRYPTO.HKDF_INFO),
      CRYPTO.KEY_BYTES + CRYPTO.IV_BYTES,
    ),
  );
  const key = out.subarray(0, CRYPTO.KEY_BYTES);
  const iv = out.subarray(CRYPTO.KEY_BYTES);

  const cipher = QuickCrypto.createCipheriv(CRYPTO.AEAD_ALGORITHM, key, iv, {
    authTagLength: CRYPTO.AUTH_TAG_BYTES,
  });
  const ciphertext = Buffer.concat([
    cipher.update(Buffer.from(plaintext, "utf8")),
    cipher.final(),
  ]);

  return {
    tag: cipher.getAuthTag().toString(CRYPTO.ENCODING),
    ciphertext: ciphertext.toString(CRYPTO.ENCODING),
  };
};
