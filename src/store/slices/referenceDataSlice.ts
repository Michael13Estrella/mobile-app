import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReferenceDataItem } from "../../types/referenceData.types";
import { ReferenceDataKey } from "../../constants/endpoints";

interface ReferenceDataState {
  data: Partial<Record<ReferenceDataKey, ReferenceDataItem[]>>;
  loadingKeys: ReferenceDataKey[];
}

const initialState: ReferenceDataState = {
  data: {},
  loadingKeys: [],
};

const referenceDataSlice = createSlice({
  name: "referenceData",
  initialState,
  reducers: {
    startLoadingReferenceData: (
      state,
      action: PayloadAction<ReferenceDataKey>,
    ) => {
      if (!state.loadingKeys.includes(action.payload)) {
        state.loadingKeys.push(action.payload);
      }
    },
    setReferenceDataForKey: (
      state,
      action: PayloadAction<{
        key: ReferenceDataKey;
        items: ReferenceDataItem[];
      }>,
    ) => {
      state.data[action.payload.key] = action.payload.items;
      state.loadingKeys = state.loadingKeys.filter(
        (k) => k !== action.payload.key,
      );
    },
    failReferenceData: (state, action: PayloadAction<ReferenceDataKey>) => {
      state.loadingKeys = state.loadingKeys.filter((k) => k !== action.payload);
    },
  },
});

export const {
  startLoadingReferenceData,
  setReferenceDataForKey,
  failReferenceData,
} = referenceDataSlice.actions;

export default referenceDataSlice.reducer;
