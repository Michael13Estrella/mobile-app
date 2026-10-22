/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-08-27
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ENDPOINTS, ReferenceDataKey } from "../../constants/endpoints";
import {
  Nationality,
  PhilippineAreaResult,
  PostalLookupResult,
  ReferenceDataItem,
} from "../../types/referenceData.types";
import { apiClient } from "../api/apiClient";

export const referenceDataService = {
  fetch: async (key: ReferenceDataKey): Promise<ReferenceDataItem[]> => {
    const { ok, data } = await apiClient.plain.get<ReferenceDataItem[]>(
      ENDPOINTS.REFERENCE_MASTER[key],
    );
    return ok && data ? data : [];
  },

  fetchNationalities: async (): Promise<Nationality[]> => {
    const { ok, data } = await apiClient.plain.get<Nationality[]>(
      ENDPOINTS.REFERENCE_NATIONALITY,
    );
    return ok && data ? data : [];
  },

  lookupPostal: async (
    postalCode: string,
  ): Promise<PostalLookupResult | null> => {
    const { ok, data } = await apiClient.plain.get<PostalLookupResult>(
      ENDPOINTS.REFERENCE_POSTAL(postalCode),
    );
    return ok && data ? data : null;
  },

  // Philippine provinces; [] when they couldn't be loaded
  fetchPhilippineCityProvinces: async (): Promise<PhilippineAreaResult[]> => {
    const { ok, data } = await apiClient.plain.get<PhilippineAreaResult[]>(
      ENDPOINTS.REFERENCE_PHILIPPINE_CITY_PROV,
    );
    return ok && data ? data : [];
  },

  // The cities/municipalities of a province; [] when they couldn't be loaded
  fetchPhilippineTownAreas: async (
    cityProvCode: string,
  ): Promise<PhilippineAreaResult[]> => {
    const { ok, data } = await apiClient.plain.get<PhilippineAreaResult[]>(
      ENDPOINTS.REFERENCE_PHILIPPINE_TOWN_AREA(cityProvCode),
    );
    return ok && data ? data : [];
  },
};
