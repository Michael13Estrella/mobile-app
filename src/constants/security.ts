export const SECURITY = {
  HEADERS: {
    API_KEY: "X-Api-Key",
    DEVICE_ID: "X-Device-Id",
    TIMESTAMP: "X-Timestamp",
    NONCE: "X-Nonce",
    DBRS_SIGNATURE: "X-DBRS-Signature",
    HMAC_SIGNATURE: "X-HMAC-Signature",
  },
  PIN: {
    LENGTH: 6,
    MAX_ATTEMPTS: 5,
    BCRYPT_ROUNDS: 10,
  },
  OTP: {
    LENGTH: 6,
    RESEND_COOLDOWN_SECONDS: 30,
  },
  STORE_KEYS: {
    DEVICE_PRIVATE: "device_private_key",
    DEVICE_PUBLIC: "device_public_key",
    DEVICE_ID: "device_id",
    HMAC_KEY: "hmac_payload_key",

    ENROLLED_PREFIX: "enrolled_", // + kcId (per-user association flag)
    BIOMETRIC_ENABLED_PREFIX: "biometric_enabled_", // + kcId (per-user preference)
    BIOMETRIC_ACTIVE_USER: "biometric_active_user", // single hardware key owner
    BIOMETRIC_REPROMPT_PREFIX: "biometric_reprompt_", // + kcId - set on invalidation, cleared after re-offer
    PIN_HASH_PREFIX: "pin_hash_", // + kcId
    PIN_ATTEMPTS_PREFIX: "pin_attempts_", // + kcId
    REMITTER_GUID_PREFIX: "remitter_guid_", // + kcId
  },
  CRYPTO: {
    AEAD_ALGORITHM: "aes-256-gcm",
    KEY_BYTES: 32,
    IV_BYTES: 12,
    AUTH_TAG_BYTES: 16,
    HKDF_HASH: "sha256",
    HKDF_INFO: "mobile-app/body-encryption/v1",
    ENCODING: "base64",
  },
} as const;
