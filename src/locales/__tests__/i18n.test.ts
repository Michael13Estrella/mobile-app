import { getLocales } from "expo-localization";
import en from "../en.json";
import ja from "../ja.json";
import { I18n } from "i18n-js";

jest.mock("expo-localization", () => ({
  getLocales: jest.fn(),
}));

// Re-import i18n.ts fresh with a chosen device-locale result.
const loadI18n = (locales: Array<{ languageCode: string | null }>) => {
  (getLocales as jest.Mock).mockReturnValue(locales);
  let i18n!: I18n;
  jest.isolateModules(() => {
    i18n = require("../_i18n").default;
  });

  return i18n;
};

beforeEach(() => jest.clearAllMocks());

describe("i18n locale selection", () => {
  it("uses the device language code when available", () => {
    expect(loadI18n([{ languageCode: "ja" }]).locale).toBe("ja");
  });

  it("falls back to 'en' when no locale is reported", () => {
    expect(loadI18n([]).locale).toBe("en");
  });

  it("falls back to 'en' when the language code is null", () => {
    expect(loadI18n([{ languageCode: null }]).locale).toBe("en");
  });
});

describe("i18n configuration", () => {
  it("enables fallback and sets the default locale to en", () => {
    const i18n = loadI18n([{ languageCode: "en" }]);
    expect(i18n.enableFallback).toBe(true);
    expect(i18n.defaultLocale).toBe("en");
  });
});

describe("translation + fallback", () => {
  it("returns Japanese strings when the locale is ja", () => {
    const i18n = loadI18n([{ languageCode: "ja" }]);
    expect(i18n.t("common.cancel")).toBe(ja.common.cancel);
  });

  it("returns English strings when the locale is en", () => {
    const i18n = loadI18n([{ languageCode: "en" }]);
    expect(i18n.t("common.cancel")).toBe(en.common.cancel);
  });

  it("falls back to en for an unsupported device locale", () => {
    const i18n = loadI18n([{ languageCode: "fr" }]); // not en/ja
    expect(i18n.locale).toBe("fr");
    expect(i18n.t("common.cancel")).toBe(en.common.cancel); // fallback -> defaultLocale
  });
});
