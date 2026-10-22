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
import { CreateBeneficiaryDetails } from "../../types";
import { logout } from "./authSlice";

// Memory only (never persisted): the details hold personal data
interface AddBeneficiaryState {
  // The beneficiary form, kept from its "Next" until the payout step saves
  // both together; null before "Next"
  details: CreateBeneficiaryDetails | null;
}

const initialState: AddBeneficiaryState = {
  details: null,
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

    // After saving, or when the user leaves the flow
    clearAddBeneficiary: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { setBeneficiaryDetails, clearAddBeneficiary } =
  addBeneficiarySlice.actions;
export default addBeneficiarySlice.reducer;
