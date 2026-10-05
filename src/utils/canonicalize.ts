import canonicalize from "canonicalize";

// Deterministic, RFC 8785 bytes - must match the server exactly.
export const jcs = (obj: unknown): string => canonicalize(obj) ?? "";
