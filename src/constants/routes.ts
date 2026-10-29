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
import { BeneficiaryPayoutType, PAYOUT_TYPE } from "./payout";

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
  ADD_BENEFICIARY_CONFIRM:
    "/(protected)/(beneficiaries)/add-beneficiary/confirm",
  ADD_BENEFICIARY_SUBMITTED:
    "/(protected)/(beneficiaries)/add-beneficiary/submitted",

  // Payout method (shared: Add Beneficiary and a saved beneficiary's
  // "Add payout method")
  ADD_PAYOUT_SELECT_METHOD: "/(protected)/(beneficiaries)/add-payout",
  // A saved beneficiary's "Add payout method": the same screens, saving to them
  ADD_PAYOUT_FOR_BENEFICIARY: (beneficiaryGuid: string) => ({
    pathname: "/(protected)/(beneficiaries)/add-payout",
    params: { beneficiaryGuid },
  }),
  ADD_PAYOUT_METROBANK_ACCOUNT:
    "/(protected)/(beneficiaries)/add-payout/metrobank-account",
  ADD_PAYOUT_OTHER_BANK: "/(protected)/(beneficiaries)/add-payout/other-bank",
  ADD_PAYOUT_CASH_PICKUP: "/(protected)/(beneficiaries)/add-payout/cash-pickup",

  // Development
  PREVIEW: "/preview",
} as const satisfies Record<string, Href | ((...params: never[]) => Href)>;

// The screen of each payout type, opened from the payout method picker and
// from Confirm's "Edit"
export const ADD_PAYOUT_ROUTES = {
  [PAYOUT_TYPE.METROBANK_ACCOUNT]: ROUTES.ADD_PAYOUT_METROBANK_ACCOUNT,
  [PAYOUT_TYPE.OTHER_BANKS]: ROUTES.ADD_PAYOUT_OTHER_BANK,
  [PAYOUT_TYPE.CASH_PICKUP]: ROUTES.ADD_PAYOUT_CASH_PICKUP,
} as const satisfies Record<BeneficiaryPayoutType, Href>;
