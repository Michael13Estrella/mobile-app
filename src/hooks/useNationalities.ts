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

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  failNationalities,
  setNationalities,
  startLoadingNationalities,
} from "../store/slices/nationalitySlice";
import { referenceDataService } from "../services/registration/referenceDataService";

export function useNationalities() {
  const dispatch = useAppDispatch();
  const nationalities = useAppSelector((s) => s.nationality.items);
  const isLoading = useAppSelector((s) => s.nationality.isLoading);

  useEffect(() => {
    if (nationalities !== undefined || isLoading) return;

    dispatch(startLoadingNationalities());
    referenceDataService
      .fetchNationalities()
      .then((result) => dispatch(setNationalities(result)))
      .catch(() => dispatch(failNationalities()));
  }, []);

  return { nationalities: nationalities ?? [], isLoading };
}
