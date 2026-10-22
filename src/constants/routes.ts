/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-21
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Href } from "expo-router";
import { BeneficiaryCategory } from "../types";

// Every screen path in one place, with the full group path, matching the
// folders in app/. Keys are prefixed with their group.
// Dynamic routes are functions that take their params.
export const ROUTES = {
  // Auth
  AUTH_WELCOME: "/(auth)/welcome",
  AUTH_OTP: "/(auth)/otp",
  AUTH_SETTINGS: "/(auth)/settings",

  // Registration
  REGISTER_LOGIN_INFO: "/(auth)/(register)/login-info",
  REGISTER_VERIFY_EMAIL: "/(auth)/(register)/verify-email",
  REGISTER_BASIC_INFO: "/(auth)/(register)/basic-info",
  REGISTER_EMPLOYMENT_INFO: "/(auth)/(register)/employment-info",
  REGISTER_CONTACT_INFO: "/(auth)/(register)/contact-info",
  REGISTER_IDENTITY_INFO: "/(auth)/(register)/identity-info",
  REGISTER_CONFIRM: "/(auth)/(register)/confirm",

  // Onboarding
  ONBOARDING_SECURE_PROMPT: "/(protected)/(onboarding)/secure-prompt",
  ONBOARDING_SET_PASSCODE: "/(protected)/(onboarding)/set-passcode",
  ONBOARDING_BIOMETRIC: "/(protected)/(onboarding)/biometric",
  ONBOARDING_SUBMITTED: "/(protected)/(onboarding)/submitted",

  // Tabs
  HOME: "/(protected)/(tabs)/home",

  // Beneficiaries
  MANAGE_BENEFICIARIES: "/(protected)/(beneficiaries)/manage-beneficiaries",
  BENEFICIARY_DETAILS: (beneficiaryGuid: string) => ({
    pathname: "/(protected)/(beneficiaries)/beneficiary/[beneficiaryGuid]",
    params: { beneficiaryGuid },
  }),
  ADD_BENEFICIARY: (category: BeneficiaryCategory) => ({
    pathname: "/(protected)/(beneficiaries)/add-beneficiary/[category]",
    params: { category },
  }),

  // Development
  PREVIEW: "/preview",
} as const satisfies Record<string, Href | ((...params: never[]) => Href)>;
