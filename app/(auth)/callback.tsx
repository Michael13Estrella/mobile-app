/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { AuthLoadingOverlay } from "../../src/components/screens/AuthLoadingOverlay";

export default function AuthCallback() {
  // Mid-OIDC: the deep-link redirect landed here while the auth session is
  // still resolving. Show the SAME branded overlay instead of bouncing to
  // welcome, so the hand-off to OTP is seamless.
  return <AuthLoadingOverlay />;
}
