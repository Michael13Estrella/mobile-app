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

export interface BiometricEnrollRequest {
  publicKey: string;
  challenge: string;
  signature: string;
}

export interface BiometricRefreshRequest {
  userId: string;
  challenge: string;
  signature: string;
  refreshToken: string;
}

export interface ChallengeResponse {
  challenge: string;
}
