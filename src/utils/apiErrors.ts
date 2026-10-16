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

/**
 * The first error message in an API validation response.
 * The server sends errors per field (ASP.NET style); the app shows one.
 *
 * @param errors - The `errors` object from an API result, field -> messages.
 * @returns The first message found, or `undefined` if there is none.
 * @example firstErrorMessage({ Email: ["Invalid email"] }); // "Invalid email"
 */
export const firstErrorMessage = (
  errors?: Record<string, string[]>,
): string | undefined =>
  errors ? Object.values(errors).flat().at(0) : undefined;
