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

export interface StatusResponse {
  status: string;
}

// the result of a save (create, add, update, delete). message: the
// server's first error message, when it sent one (otherwise the screen
// shows a generic error)
export type SaveResult =
  Readonly<{ ok: true }> | Readonly<{ ok: false; message?: string }>;
