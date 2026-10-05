import { CONFIG } from "../../../constants/config";
import { SECURITY } from "../../../constants/security";
import { tokenService } from "../../auth/tokenService";
import { deviceService } from "../../security/deviceService";
import { request } from "../apiTransport";

jest.mock("../../auth/tokenService", () => ({
  tokenService: { getAccessToken: jest.fn() },
}));

jest.mock("../../security/deviceService", () => ({
  deviceService: {
    signRequest: jest.fn(),
    getDeviceId: jest.fn(),
    signHmac: jest.fn(),
    encryptBody: jest.fn(),
  },
}));

// Fix the non-deterministic crypto so we can assert exact headers.
jest.mock("../../../utils/crypto", () => ({
  randomNonce: jest.fn(() => "test-nonce"),
  sha256Base64: jest.fn(() => "test-hash"),
}));

const H = SECURITY.HEADERS;
const TS = "1700000000000";

const mockFetch = (status: number, jsonBody: unknown) =>
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(jsonBody),
  });

const lastCall = () => (globalThis.fetch as jest.Mock).mock.calls[0];

beforeEach(() => {
  jest.clearAllMocks();
  globalThis.fetch = jest.fn();
  (tokenService.getAccessToken as jest.Mock).mockResolvedValue(null);
  (deviceService.signRequest as jest.Mock).mockResolvedValue("dbrs-sig");
  (deviceService.getDeviceId as jest.Mock).mockResolvedValue("device-1");
  (deviceService.signHmac as jest.Mock).mockResolvedValue("hmac-sig");
  (deviceService.encryptBody as jest.Mock).mockResolvedValue({
    cipherText: "ct",
    tag: "tg",
  });
  jest.spyOn(Date, "now").mockReturnValue(Number(TS));
});

afterAll(() => jest.restoreAllMocks());

describe("request - plain mode", () => {
  it("GETs API_BASE_URL + path with JSON content-type and no auth when logged out", async () => {
    mockFetch(200, { id: 1 });
    const res = await request<{ id: number }>(
      "GET",
      "/items",
      undefined,
      "plain",
    );

    const [url, init] = lastCall();
    expect(url).toBe(`${CONFIG.API_BASE_URL}/items`);
    expect(init.method).toBe("GET");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.headers.Authorization).toBeUndefined();
    expect(init.body).toBeUndefined();
    expect(res).toEqual({ ok: true, status: 200, data: { id: 1 } });
  });

  it("adds a Bearer header and JSON-stringifies the body when logged in", async () => {
    (tokenService.getAccessToken as jest.Mock).mockResolvedValue("token");
    mockFetch(201, {});
    const body = { a: 1 };

    await request("POST", "/create", body, "plain");

    const [, init] = lastCall();
    expect(init.headers.Authorization).toBe("Bearer token");
    expect(init.body).toBe(JSON.stringify(body));
  });

  it("maps a non-2xx response to ok:false with the errors field", async () => {
    mockFetch(401, { errors: { code: ["invalid"] } });
    const res = await request("GET", "/x", undefined, "plain");
    expect(res).toEqual({
      ok: false,
      status: 401,
      data: null,
      errors: { code: ["invalid"] },
    });
  });

  it("returns status 0 on a network error", async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValue(new Error("offline"));
    const res = await request("GET", "/x", undefined, "plain");
    expect(res).toEqual({ ok: false, status: 0, data: null });
  });

  it("tolerates a non-JSON body (data is null, still ok)", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockRejectedValue(new Error("not json")),
    });
    const res = await request("GET", "/x", undefined, "plain");
    expect(res).toEqual({ ok: true, status: 200, data: null });
  });

  it("put sends a PUT with a JSON body", async () => {
    mockFetch(200, {});
    await request("PUT", "/u", { a: 1 }, "plain");
    const [, init] = lastCall();
    expect(init.method).toBe("PUT");
    expect(init.body).toBe(JSON.stringify({ a: 1 }));
  });

  it("delete sends a DELETE with no body", async () => {
    mockFetch(204, {});
    await request("DELETE", "/u", undefined, "plain");
    const [, init] = lastCall();
    expect(init.method).toBe("DELETE");
    expect(init.body).toBeUndefined();
  });
});

describe("request - dbrs mode", () => {
  it("adds the DBRS headers, signs the descriptor, and sends canonical JSON", async () => {
    mockFetch(200, {});
    await request("POST", "/pay", { amount: 100 }, "dbrs");

    const [, init] = lastCall();
    expect(init.headers[H.DEVICE_ID]).toBe("device-1");
    expect(init.headers[H.NONCE]).toBe("test-nonce");
    expect(init.headers[H.TIMESTAMP]).toBe(TS);
    expect(init.headers[H.DBRS_SIGNATURE]).toBe("dbrs-sig");
    expect(init.headers[H.HMAC_SIGNATURE]).toBeUndefined();

    expect(deviceService.signRequest).toHaveBeenCalledWith(
      ["POST", "/pay", TS, "test-nonce", "test-hash"].join("\n"),
    );
    expect(init.body).toBe('{"amount":100}');
  });

  it("hashes an empty body for a GET (no request body)", async () => {
    mockFetch(200, {});
    await request("GET", "/me", undefined, "dbrs");
    const [, init] = lastCall();
    expect(init.body).toBeUndefined();
    expect(deviceService.signRequest).toHaveBeenCalledWith(
      ["GET", "/me", TS, "test-nonce", "test-hash"].join("\n"),
    );
  });

  it("includes a Bearer header on a signed request when logged in", async () => {
    (tokenService.getAccessToken as jest.Mock).mockResolvedValue("token");
    mockFetch(200, {});

    await request("GET", "/me", undefined, "dbrs");

    const [, init] = lastCall();
    expect(init.headers.Authorization).toBe("Bearer token");
  });

  it("sends an empty X-Device-Id header when the device id is missing", async () => {
    (deviceService.getDeviceId as jest.Mock).mockResolvedValue(null);
    mockFetch(200, {});

    await request("GET", "/me", undefined, "dbrs");

    const [, init] = lastCall();
    expect(init.headers[SECURITY.HEADERS.DEVICE_ID]).toBe("");
  });
});

describe("request - critical mode", () => {
  it("adds the HMAC header signed over rawBody/timestamp/nonce", async () => {
    mockFetch(200, {});
    await request("POST", "/pay", { amount: 100 }, "critical");

    const [, init] = lastCall();
    expect(init.headers[H.HMAC_SIGNATURE]).toBe("hmac-sig");
    expect(deviceService.signHmac).toHaveBeenCalledWith(
      ['{"amount":100}', TS, "test-nonce"].join("\n"),
    );
  });
});

describe("request - encrypt mode", () => {
  it("encrypts the canonical body and sends the envelope (with HMAC)", async () => {
    mockFetch(200, {});
    await request("POST", "/pay", { amount: 100 }, "encrypt");

    expect(deviceService.encryptBody).toHaveBeenCalledWith(
      '{"amount":100}',
      "test-nonce",
    );

    const [, init] = lastCall();
    expect(init.body).toBe('{"cipherText":"ct","tag":"tg"}');
    expect(init.headers[H.HMAC_SIGNATURE]).toBe("hmac-sig");
  });
});
