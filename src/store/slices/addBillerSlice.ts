/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AddBillerFormValues } from "../../schemas/biller/addBillerSchema";
import { Biller } from "../../types";
import { logout } from "./authSlice";

// What "Biller under review" shows: the saved biller, as it was typed
export interface SubmittedBiller {
  biller: Biller;
  values: AddBillerFormValues;
  // When the save succeeded (ISO)
  submittedAt: string;
}

// Memory only (never persisted): subscriber and card number are personal data
interface AddBillerState {
  submitted: SubmittedBiller | null;
}

const initialState: AddBillerState = {
  submitted: null,
};

const addBillerSlice = createSlice({
  name: "addBiller",
  initialState,
  reducers: {
    // The time is taken here (prepare): reducers must stay pure
    billerSubmitted: {
      reducer: (state, action: PayloadAction<SubmittedBiller>) => {
        state.submitted = action.payload;
      },
      prepare: (biller: Biller, values: AddBillerFormValues) => ({
        payload: { biller, values, submittedAt: new Date().toISOString() },
      }),
    },
    // When the remitter leaves "Biller under review"
    clearAddBiller: () => initialState,
  },
  // A signed-out user's data must not carry over the next login
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { billerSubmitted, clearAddBiller } = addBillerSlice.actions;
export default addBillerSlice.reducer;
