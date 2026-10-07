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

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { CONFIG } from "../../constants/config";
import { tokenService } from "../auth/tokenService";

export const apiService = createApi({
  reducerPath: "apiService",
  baseQuery: fetchBaseQuery({
    baseUrl: CONFIG.API_BASE_URL,
    prepareHeaders: async (headers, { getState }) => {
      const token =
        (getState() as RootState).auth.accessToken ??
        (await tokenService.getAccessToken());

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Transaction", "Beneficiary", "User"],
  endpoints: () => ({}),
});
