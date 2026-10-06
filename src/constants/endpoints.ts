export const ENDPOINTS = {
  // Auth
  AUTH_EXCHANGE: "/api/auth/exchange",
  AUTH_OTP_VERIFY: "/api/auth/otp/verify",
  AUTH_OTP_RESEND: "/api/auth/otp/resend",
  AUTH_REFRESH: "/api/auth/refresh",
  AUTH_REGISTER: "/api/auth/register",
  REMITTER_GUID: (kcId: string) => `/api/auth/remitter-guid/${kcId}`,

  // User Registration
  REGISTER_CHECK_EMAIL: "/api/auth/check-email",
  REGISTER_CHECK_EMAIL_RESEND: "/api/auth/check-email/resend",
  REGISTER_VERIFY_EMAIL: "/api/auth/verify-email",
  REGISTER_SUBMIT: "/api/auth/register",

  // Device
  DEVICE_ENROLL: (remitterGuid: string) => `/api/device/${remitterGuid}/enroll`,
  DEVICE_LANGUAGE: "/api/device/language",

  // Biometric
  BIOMETRIC_CHALLENGE: "/api/biometric/challenge",
  BIOMETRIC_REFRESH: "/api/biometric/refresh",
  BIOMETRIC_REVOKE: "/api/biometric/revoke",
  BIOMETRIC_ENROLL: (remitterGuid: string) =>
    `/api/biometric/${remitterGuid}/enroll`,

  // Notification
  NOTIFICATION_REGISTER: (remitterGuid: string) =>
    `/api/notifications/${remitterGuid}/register-push-notification`,
  NOTIFICATION_UNREGISTER: (remitterGuid: string) =>
    `/api/notifications/${remitterGuid}/unregister-push-notification`,

  // Reference data
  REFERENCE_MASTER: {
    profession: "/api/reference-master/profession",
    visaStatus: "/api/reference-master/visa-status",
    primaryId: "/api/reference-master/primary-id",
    advertising: "/api/reference-master/advertising",
    relationWithBene: "/api/reference-master/relation-with-bene",
  },
  REFERENCE_NATIONALITY: "/api/reference-master/nationality",
  REFERENCE_POSTAL: (postalCode: string) =>
    `/api/reference-master/postal/${postalCode}`,
  REFERENCE_PHILIPPINE_AREAS: (keyword: string) =>
    `/api/reference-master/philippine-areas/${keyword}`,
  EXCHANGE_RATES_CACHED: "/api/reference-master/exrates-cache",
  EXCHANGE_RATES_LIVE: "/api/reference-master/exrates-non-cache",

  // Debug
  DEBUG_RESET: "/api/debug/reset",
} as const;

export type ReferenceDataKey = keyof typeof ENDPOINTS.REFERENCE_MASTER;
