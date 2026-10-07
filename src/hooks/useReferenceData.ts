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

import { useEffect } from "react";
import { ReferenceDataKey } from "../constants/endpoints";
import { useAppDispatch, useAppSelector } from "../store";
import {
  failReferenceData,
  setReferenceDataForKey,
  startLoadingReferenceData,
} from "../store/slices/referenceDataSlice";
import { referenceDataService } from "../services/registration/referenceDataService";

export function useReferenceData(key: ReferenceDataKey) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.referenceData.data[key]);
  const isLoading = useAppSelector((s) =>
    s.referenceData.loadingKeys.includes(key),
  );

  useEffect(() => {
    if (items !== undefined || isLoading) return; // already cached or already in flight

    dispatch(startLoadingReferenceData(key));
    referenceDataService
      .fetch(key)
      .then((result) =>
        dispatch(setReferenceDataForKey({ key, items: result })),
      )
      .catch(() => dispatch(failReferenceData(key)));
  }, [key]);

  return { items: items ?? [], isLoading };
}
