import { ExpoConfig, ConfigContext } from "expo/config";

const IS_PRODUCTION = process.env.APP_VARIANT === "production";

// const PACKAGE = IS_PRODUCTION
//    "com.metrobank.japan.app"
//   : "com.metrobank.japan.app.dev";

const PACKAGE = "com.mbj.remittance";

const APP_NAME = IS_PRODUCTION ? "Metrobank Japan" : "Metrobank Japan (Dev)";

const SCHEME = IS_PRODUCTION ? "mbjremittance" : "mbjremittance-dev";

const GOOGLE_SERVICES_FILE = IS_PRODUCTION
  ? "./firebase/google-services.prod.json"
  : "./firebase/google-services.dev.json";

const defineAppConfig = ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_NAME,
  slug: config.slug ?? "mbj-mobile-app",
  scheme: SCHEME,
  android: {
    ...config.android,
    package: PACKAGE,
    googleServicesFile: GOOGLE_SERVICES_FILE,
    softwareKeyboardLayoutMode: "pan",
  },
  ios: {
    ...config.ios,
    bundleIdentifier: PACKAGE,
  },
});

export default defineAppConfig;
