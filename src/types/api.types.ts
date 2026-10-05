export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string; // server-provided error code on failure
}
