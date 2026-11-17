/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecentBeneficiary, Wallet } from "../../types";
import { logout } from "./authSlice";

// The parts of the dashboard other screens need (Home keeps the rest).
// Memory only (never persisted): names are personal data
interface DashboardState {
  // null until the dashboard has loaded once. Includes recently added
  // beneficiaries (confirmed with the backend), so an empty list means the
  // remitter has none saved
  recentBeneficiaries: RecentBeneficiary[] | null;
  // null until the dashboard has loaded once. Send Money's "Available
  // balance"; the server still checks the real balance when sending
  wallet: Wallet | null;
  // null until the dashboard has loaded once. 0 = no enrolled billers:
  // the Pay Bills tab asks to enroll one first
  billerCount: number | null;
}

const initialState: DashboardState = {
  recentBeneficiaries: null,
  wallet: null,
  billerCount: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setRecentBeneficiaries: (
      state,
      action: PayloadAction<RecentBeneficiary[]>,
    ) => {
      state.recentBeneficiaries = action.payload;
    },
    setWallet: (state, action: PayloadAction<Wallet>) => {
      state.wallet = action.payload;
    },
    setBillerCount: (state, action: PayloadAction<number>) => {
      state.billerCount = action.payload;
    },
    // A biller was enrolled: the Pay Bills tab no longer asks to add one,
    // even before Home reloads the dashboard. Not loaded yet: Home sets it
    billerAdded: (state) => {
      if (state.billerCount !== null) state.billerCount += 1;
    },
    // A biller was deleted: the last one brings back "No enrolled billers yet"
    billerRemoved: (state) => {
      if (state.billerCount) state.billerCount -= 1;
    },
  },
  // A signed-out user's data must not carry over the next login
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const {
  setRecentBeneficiaries,
  setWallet,
  setBillerCount,
  billerAdded,
  billerRemoved,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
