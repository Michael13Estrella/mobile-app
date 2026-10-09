/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Remitter, RemitterState } from "../../types";
import { logout } from "./authSlice";

// Memory only (never persisted): the profile holds personal data
const initialState: RemitterState = {
  profile: null,
};

const remitterSlice = createSlice({
  name: "remitter",
  initialState,
  reducers: {
    setRemitter: (state, action: PayloadAction<Remitter>) => {
      state.profile = action.payload;
    },
  },
  // A signed-out user's data must not carry over the next login
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { setRemitter } = remitterSlice.actions;
export default remitterSlice.reducer;
