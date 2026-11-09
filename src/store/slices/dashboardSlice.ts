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
import { RecentBeneficiary } from "../../types";
import { logout } from "./authSlice";

// The parts of the dashboard other screens need (Home keeps the rest).
// Memory only (never persisted): names are personal data
interface DashboardState {
  // null until the dashboard has loaded once. Includes recently added
  // beneficiaries (confirmed with the backend), so an empty list means the
  // remitter has none saved
  recentBeneficiaries: RecentBeneficiary[] | null;
}

const initialState: DashboardState = {
  recentBeneficiaries: null,
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
  },
  // A signed-out user's data must not carry over the next login
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { setRecentBeneficiaries } = dashboardSlice.actions;
export default dashboardSlice.reducer;
