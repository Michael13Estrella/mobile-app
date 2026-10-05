# Development Guide

## Prerequisites

- Node.js (LTS) and npm
- [Expo CLI](https://docs.expo.dev/more/expo-cli/) (via `npx`, no global install needed)
- [EAS CLI](https://docs.expo.dev/eas/) for device builds: `npm install -g eas-cli`
- Android Studio (emulator + SDK/platform tools) and/or Xcode (iOS Simulator, macOS only)
- A physical device for real-world testing (see [Running on a physical device](#running-on-a-physical-device))

## Environment variables

Create a `.env` file in the project root with:

```
EXPO_PUBLIC_API_BASE_URL=
EXPO_PUBLIC_API_KEY=
EXPO_PUBLIC_APP_BUNDLE_ID=
EXPO_PUBLIC_KEYCLOAK_URL=
EXPO_PUBLIC_KEYCLOAK_CLIENT_ID=
EXPO_PUBLIC_KEYCLOAK_REDIRECT_SCHEME=
EXPO_PUBLIC_KEYCLOAK_REDIRECT_PATH=
```

Ask a team member for the actual values — `EXPO_PUBLIC_KEYCLOAK_URL` points at the internal Keycloak realm (`auth-uat.metrobank.co.jp`), only reachable on the internal network.

You'll also need **`google-services.json`** (Firebase config for push notifications) in the project root — request this from whoever manages the Firebase project.

## Install dependencies

```bash
npm install
```

## Start the project

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `a` / `i` in the terminal to launch an emulator/simulator directly.

### Run on Android emulator

```bash
npm run android
```

### Run on iOS Simulator (macOS only)

```bash
npm run ios
```

## Running on a physical device

Physical-device testing needs a couple of extra steps beyond scanning the QR code, mainly to get Metro (port 8081) and the API reachable over USB.

1. Enable USB debugging on the device and connect via USB.
2. Confirm the device is visible: `adb devices`
3. Forward the ports Metro and the API use:
   ```bash
   adb reverse tcp:8081 tcp:8081
   adb reverse tcp:<API_PORT> tcp:<API_PORT>
   ```
4. Start Metro **without** `--localhost` (it binds `::1`, which `adb reverse` can't forward — use the default host binding instead):
   ```bash
   REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1 npx expo start
   ```
5. If your API runs over HTTPS with a local dev certificate, the device needs to trust it (e.g. via `mkcert` + the `expo-build-properties` network security config already set up in `app.json`).
6. If the backend needs to reach an **internal-network-only** host (like Keycloak) and your device's mobile/Wi-Fi data doesn't have that access, tether the connection through your dev machine (e.g. with `gnirehtet`) so DNS resolves correctly.

## Building for a device (EAS)

Build profiles are defined in `eas.json`:

```bash
# Development build (includes dev client, for use with `expo start --dev-client`)
eas build --profile development --platform android

# Internal preview build (share with testers)
eas build --profile preview --platform android

# Production build
eas build --profile production --platform android
```

Swap `--platform android` for `--platform ios` as needed (macOS-only build machine required for local iOS builds; EAS can build iOS in the cloud without one).

## Testing

Run the full suite:

```bash
npm test
```

Watch mode (re-runs on file change):

```bash
npm run test:watch
```

Run a single file (matches by filename substring, no need for the full path):

```bash
npx jest keycloakService.test
```

Run tests matching a specific test name:

```bash
npx jest apiClient.test -t "adds the DBRS headers"
```

### Test coverage

There's no dedicated npm script for this yet — run directly:

```bash
npx jest --coverage
```

This prints a summary table and writes a full HTML report to `coverage/lcov-report/index.html` — open it in a browser for a file-by-file breakdown.

> Optional: add a `"test:coverage": "jest --coverage"` script to `package.json`'s `scripts` block for consistency with `test`/`test:watch`.

## Project structure quick reference

- `app/` — expo-router file-based routes (`(auth)`, `(protected)/(onboarding)`, `(protected)/(tabs)`)
- `src/components/` — `common/` (shared UI), `screen/` (full-screen overlays like `LockScreen`), `layout/` (wrappers)
- `src/hooks/` — `useAuth`, `useAppTheme`, `useTranslation`, etc.
- `src/services/` — `auth/`, `security/`, `api/`, `notifications/`, `storage/`, `user/` — plain object-literal services, not classes
- `src/store/` — Redux Toolkit slices
- `src/constants/` — `security.ts`, `endpoints.ts`, `colors.ts`, `typography.ts` — no magic values/strings should live outside this folder
- `src/locales/` — `en.json` / `ja.json` + `_i18n.ts`

## Troubleshooting

- **Metro fails to connect from a physical device** — almost always the IPv4/IPv6 `--localhost` issue above; drop `--localhost` and set `REACT_NATIVE_PACKAGER_HOSTNAME`.
- **API calls fail with `status: 0`** — usually an untrusted HTTPS dev certificate; switch to HTTP for local testing or set up `mkcert` + the network security config.
- **Port conflicts** — Metro (8081) and the API server must use different ports; if they collide, `adb reverse` will only forward one correctly.
- **Biometrics unavailable on a Huawei device without GMS** — this is a known device/framework limitation (Huawei's biometric stack isn't compatible with AndroidX `BiometricPrompt`), not a bug — test biometrics on a Pixel or Samsung device instead.
