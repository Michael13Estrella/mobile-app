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
