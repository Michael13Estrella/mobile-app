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
import { BeneficiaryPayout, BeneficiarySummary } from "../../types";
import { needsCompanyDetails } from "../../utils/remittance/quote";
import { logout } from "./authSlice";

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
}

const initialState: SendMoneyState = {
  form: null,
  beneficiary: null,
  payout: null,
  companyDetails: null,
};

const sendMoneySlice = createSlice({
  name: "sendMoney",
  initialState,
  reducers: {
    setSendMoneyForm: (state, action: PayloadAction<SendMoneySubmission>) => {
      state.form = action.payload.form;
      state.beneficiary = action.payload.beneficiary;
      state.payout = action.payload.payout;
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
    },

    // After sending, or when the user leaves the flow
    clearSendMoney: () => initialState,
  },
  // A signed-out user's data must not carry over the next login
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { setSendMoneyForm, setCompanyDetails, clearSendMoney } =
  sendMoneySlice.actions;
export default sendMoneySlice.reducer;
