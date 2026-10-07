/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-02
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import registrationReducer from "./slices/registrationSlice";
import referenceDataReducer from "./slices/referenceDataSlice";
import nationalityReducer from "./slices/nationalitySlice";
import { apiService } from "../services/api/apiService";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    registration: registrationReducer,
    referenceData: referenceDataReducer,
    nationality: nationalityReducer,
    [apiService.reducerPath]: apiService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
