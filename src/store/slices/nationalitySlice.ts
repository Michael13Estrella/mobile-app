/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-01
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Nationality } from "../../types/referenceData.types";

interface NationalityState {
  items?: Nationality[];
  isLoading: boolean;
}

const initialState: NationalityState = {
  isLoading: false,
};

const nationalitySlice = createSlice({
  name: "nationality",
  initialState,
  reducers: {
    startLoadingNationalities: (state) => {
      state.isLoading = true;
    },
    setNationalities: (state, action: PayloadAction<Nationality[]>) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    failNationalities: (state) => {
      state.isLoading = false;
    },
  },
});

export const {
  startLoadingNationalities,
  setNationalities,
  failNationalities,
} = nationalitySlice.actions;

export default nationalitySlice.reducer;
