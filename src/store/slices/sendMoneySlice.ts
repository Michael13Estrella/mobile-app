/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-10
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CompanyDetailsFormValues } from "../../schemas/remittance/companyDetailsSchema";
import {
  SendMoneyFormValues,
  SendMoneySubmission,
} from "../../schemas/remittance/sendMoneySchema";
import {
  BeneficiaryPayout,
  BeneficiarySummary,
  ExchangeRate,
} from "../../types";
import {
  needsCompanyDetails,
  RemittanceQuote,
} from "../../utils/remittance/quote";
import { logout } from "./authSlice";
import { randomNonce } from "../../utils/security/crypto";

// What Review showed when the remitter confirmed: what gets sent
export type SendMoneyConfirmation = Readonly<{
  quote: RemittanceQuote;
  // The pair's rate; null for JPY -> JPY (no rate)
  rate: ExchangeRate | null;
  // send-money's correlationId: new for each Confirm, the same for a retry
  // (so a resent request can't send twice)
  correlationId: string;
}>;

// What Review hands over on Confirm (the correlationId is added after)
export type SendMoneyConfirmationInput = Omit<
  SendMoneyConfirmation,
  "correlationId"
>;

// The Send Money flow between its screens (form -> Additional Details ->
// Review). Memory only (never persisted): it holds personal data
interface SendMoneyState {
  // The form, kept from its "Next"; null before
  form: SendMoneyFormValues | null;
  // What Review shows for the picked ones (names, bank, account number,
  // which the form's ids don't have); null before
  beneficiary: BeneficiarySummary | null;
  payout: BeneficiaryPayout | null;
  // Additional Details, kept from its "Next"; null before, or when the
  // amount doesn't need them
  companyDetails: CompanyDetailsFormValues | null;
  // Review's Confirm; null before, or after anything above changed
  confirmation: SendMoneyConfirmation | null;
  // When the send succeeded (ISO); null before. Until send-money return its
  // own date, this is what the result page shows
  sentAt: string | null;
}

const initialState: SendMoneyState = {
  form: null,
  beneficiary: null,
  payout: null,
  companyDetails: null,
  confirmation: null,
  sentAt: null,
};

const sendMoneySlice = createSlice({
  name: "sendMoney",
  initialState,
  reducers: {
    setSendMoneyForm: (state, action: PayloadAction<SendMoneySubmission>) => {
      state.form = action.payload.form;
      state.beneficiary = action.payload.beneficiary;
      state.payout = action.payload.payout;
      // A changed form must be confirmed again in Review
      state.confirmation = null;
      // Kept for a remittance that still needs them (the user came back and
      // changed something else); dropped once the amount is under the limit,
      // so they're never sent without being asked for
      if (!needsCompanyDetails(action.payload.form.amount)) {
        state.companyDetails = null;
      }
    },

    setCompanyDetails: (
      state,
      action: PayloadAction<CompanyDetailsFormValues>,
    ) => {
      state.companyDetails = action.payload;
      state.confirmation = null;
    },

    // The correlationId is made here (prepare), so every Confirm gets a new one
    setSendMoneyConfirmation: {
      reducer: (state, action: PayloadAction<SendMoneyConfirmation>) => {
        state.confirmation = action.payload;
      },
      prepare: (confirmation: SendMoneyConfirmationInput) => ({
        payload: { ...confirmation, correlationId: randomNonce() },
      }),
    },

    // The time is taken here (prepare): reducers must stay pure
    markSendMoneySent: {
      reducer: (state, action: PayloadAction<string>) => {
        state.sentAt = action.payload;
      },
      prepare: () => ({ payload: new Date().toISOString() }),
    },

    // After sending, or when the user leaves the flow
    clearSendMoney: () => initialState,
  },
  // A signed-out user's data must not carry over the next login
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const {
  setSendMoneyForm,
  setCompanyDetails,
  setSendMoneyConfirmation,
  markSendMoneySent,
  clearSendMoney,
} = sendMoneySlice.actions;
export default sendMoneySlice.reducer;
