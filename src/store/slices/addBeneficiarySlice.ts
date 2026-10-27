/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-22
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CreateBeneficiaryDetails,
  CreateBeneficiaryPayout,
  PayoutSummary,
} from "../../types";
import { logout } from "./authSlice";

// Memory only (never persisted): the details hold personal data
interface AddBeneficiaryState {
  // The beneficiary form, kept from its "Next"; null before
  details: CreateBeneficiaryDetails | null;
  // The payout method's details, kept from its "Next"; null before
  payout: CreateBeneficiaryPayout | null;
  // What Confirm shows for it (e.g. the bank's name, which the request
  // doesn't have); null before
  payoutSummary: PayoutSummary | null;
}

const initialState: AddBeneficiaryState = {
  details: null,
  payout: null,
  payoutSummary: null,
};

const addBeneficiarySlice = createSlice({
  name: "addBeneficiary",
  initialState,
  reducers: {
    setBeneficiaryDetails: (
      state,
      action: PayloadAction<CreateBeneficiaryDetails>,
    ) => {
      state.details = action.payload;
    },

    setBeneficiaryPayout: (
      state,
      action: PayloadAction<{
        payout: CreateBeneficiaryPayout;
        summary: PayoutSummary;
      }>,
    ) => {
      state.payout = action.payload.payout;
      state.payoutSummary = action.payload.summary;
    },

    // After saving, or when the user leaves the flow
    clearAddBeneficiary: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const {
  setBeneficiaryDetails,
  setBeneficiaryPayout,
  clearAddBeneficiary,
} = addBeneficiarySlice.actions;
export default addBeneficiarySlice.reducer;
