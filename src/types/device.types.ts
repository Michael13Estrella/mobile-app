/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-26
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Language } from "./language.types";

export enum DeviceOs {
  iOS = 0,
  Android = 1,
}

export interface DeviceEnrollRequest {
  dbrsPublicKey: string;
  deviceOs: DeviceOs;
  lang?: Language;
}

export interface DeviceEnrollResponse {
  deviceId: string;
  hmacKey: string;
}
