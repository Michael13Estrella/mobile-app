import { CONFIG } from "../../constants/config";
import { SECURITY } from "../../constants/security";
import { store } from "../../store";
import { jcs } from "../../utils/canonicalize";
import { randomNonce, sha256Base64 } from "../../utils/crypto";
import { tokenService } from "../auth/tokenService";
import { deviceService } from "../security/deviceService";

export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  errors?: Record<string, string[]>;
}

export type FetchInit = NonNullable<Parameters<typeof fetch>[1]>;
export type Method = "GET" | "POST" | "PUT" | "DELETE";
export type SecurityMode = "plain" | "dbrs" | "critical" | "encrypt";

const resolveRawBody = async (
  body: unknown,
  nonce: string,
  encrypt: boolean,
): Promise<string> => {
  if (body === undefined) return "";
  if (encrypt) {
    const envelope = await deviceService.encryptBody(jcs(body), nonce);
    return jcs(envelope);
  }

  return jcs(body);
};

const buildUrl = (path: string): string => `${CONFIG.API_BASE_URL}${path}`;

const baseHeaders = async (): Promise<Record<string, string>> => {
  const accessToken = await tokenService.getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept-Language": store.getState().ui.locale,
    [SECURITY.HEADERS.API_KEY]: CONFIG.API_KEY,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
  return headers;
};

// Unsigned: plain JSON, auto-Bearer when logged in.
export const buildPlain = async (
  method: Method,
  path: string,
  body: unknown,
): Promise<{ url: string; init: FetchInit }> => {
  return {
    url: buildUrl(path),
    init: {
      method,
      headers: await baseHeaders(),
      body: body === undefined ? undefined : JSON.stringify(body),
    },
  };
};

// DBRS signature (+ optional HMAC / encrypted body)
export const buildSigned = async (
  method: Method,
  path: string,
  body: unknown,
  critical: boolean,
  encrypt: boolean,
): Promise<{ url: string; init: FetchInit }> => {
  const timestamp = Date.now().toString();
  const nonce = randomNonce();
  const rawBody = await resolveRawBody(body, nonce, encrypt);
  const bodyHash = sha256Base64(rawBody);

  // DBRS device identity - every request
  const descriptor = [method, path, timestamp, nonce, bodyHash].join("\n");
  const [signature, deviceId, headers] = await Promise.all([
    deviceService.signRequest(descriptor),
    deviceService.getDeviceId(),
    baseHeaders(),
  ]);

  headers[SECURITY.HEADERS.DEVICE_ID] = deviceId ?? "";
  headers[SECURITY.HEADERS.TIMESTAMP] = timestamp;
  headers[SECURITY.HEADERS.NONCE] = nonce;
  headers[SECURITY.HEADERS.DBRS_SIGNATURE] = signature;
  headers[SECURITY.HEADERS.API_KEY] = CONFIG.API_KEY;

  if (critical) {
    headers[SECURITY.HEADERS.HMAC_SIGNATURE] = await deviceService.signHmac(
      [rawBody, timestamp, nonce].join("\n"),
    );
  }

  return {
    url: buildUrl(path),
    init: { method, headers, body: body === undefined ? undefined : rawBody },
  };
};

// Core fetch executor. No token-refresh awareness - apiClient.ts decides
// whether the stored token needs refreshing before calling this.
export const request = async <T>(
  method: Method,
  path: string,
  body: unknown,
  mode: SecurityMode,
): Promise<ApiResult<T>> => {
  const { url, init } =
    mode === "plain"
      ? await buildPlain(method, path, body)
      : await buildSigned(
          method,
          path,
          body,
          mode === "critical" || mode === "encrypt", // HMAC
          mode === "encrypt", // encrypt body
        );
  try {
    if (__DEV__) console.log("[api] ->", url);
    const res = await fetch(url, init);
    const json = await res.json().catch(() => null);
    return res.ok
      ? { ok: true, status: res.status, data: json as T }
      : {
          ok: false,
          status: res.status,
          data: null,
          errors: (json as { errors?: Record<string, string[]> })?.errors,
        };
  } catch (e) {
    if (__DEV__) console.log("Request error: ", e);
    return { ok: false, status: 0, data: null };
  }
};
