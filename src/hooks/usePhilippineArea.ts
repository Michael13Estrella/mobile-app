/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-22
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useEffect, useRef, useState } from "react";
import { PhilippineAreaResult } from "../types";
import { referenceDataService } from "../services/reference/referenceDataService";

/**
 * The Philippine provinces, and the cities/municipalities of the chosen one.
 *
 * @param cityProvCode - The chosen province ("" while none is chosen)
 * @returns The provinces (loaded once) and the chosen province's towns
 *    ([] while none is chosen or they're loading)
 * @example const { provinces, towns } = usePhilippineAreas(cityProvCode);
 */
export function usePhilippineAreas(cityProvCode: string) {
  const [provinces, setProvinces] = useState<PhilippineAreaResult[]>([]);
  const [towns, setTowns] = useState<PhilippineAreaResult[]>([]);
  const latestRequest = useRef(0);

  useEffect(() => {
    let isCancelled = false;
    void referenceDataService.fetchPhilippineCityProvinces().then((result) => {
      if (!isCancelled) setProvinces(result);
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const requestId = ++latestRequest.current;
    setTowns([]);
    if (!cityProvCode) return;

    void referenceDataService
      .fetchPhilippineTownAreas(cityProvCode)
      .then((result) => {
        if (requestId === latestRequest.current) setTowns(result);
      });
  }, [cityProvCode]);

  return { provinces, towns };
}
