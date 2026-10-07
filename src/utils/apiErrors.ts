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

export const firstErrorMessage = (
  errors?: Record<string, string[]>,
): string | undefined => (errors ? Object.values(errors)[0]?.[0] : undefined);
