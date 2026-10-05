import QuickCrypto, { Buffer } from "react-native-quick-crypto";
import { SECURITY } from "../constants/security";

const CRYPTO = SECURITY.CRYPTO;

export const sha256Base64 = (data: string): string => {
  const hash = QuickCrypto.createHash("sha256");
  hash.update(data);

  return hash.digest("base64");
};

export const hmacSha256Base64 = (keyBase64: string, data: string): string => {
  const key = Buffer.from(keyBase64, "base64");
  const hmac = QuickCrypto.createHmac("sha256", key);
  hmac.update(data);

  return hmac.digest("base64");
};

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

export const randomNonce = (): string => QuickCrypto.randomUUID();

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
