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
