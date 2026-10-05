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

  searchPhilippineAreas: async (
    keyword: string,
  ): Promise<PhilippineAreaResult[]> => {
    const { ok, data } = await apiClient.plain.get<PhilippineAreaResult[]>(
      ENDPOINTS.REFERENCE_PHILIPPINE_AREAS(keyword),
    );

    return ok && data ? data : [];
  },
};
