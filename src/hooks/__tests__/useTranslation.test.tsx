import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react-native";
import uiReducer, {
  setLocale as setLocaleAction,
} from "../../store/slices/uiSlice";
import authReducer from "../../store/slices/authSlice";
import { Provider } from "react-redux";
import i18n from "../../locales/_i18n";
import { useTranslation } from "../useTranslation";
import { preferenceService } from "../../services/storage/preferenceService";
import { Language } from "../../types/language.types";

// Don't touch native storage; just assert the call.
jest.mock("../../services/storage/preferenceService", () => ({
  preferenceService: { setLocale: jest.fn().mockResolvedValue(undefined) },
}));

// Fresh store per render so locale changes don't bleed across tests
const renderUseTranslation = async (initialLocale: Language = "en") => {
  const store = configureStore({
    reducer: { ui: uiReducer, auth: authReducer },
  });
  if (initialLocale !== "en") store.dispatch(setLocaleAction(initialLocale));

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  const { result } = renderHook(() => useTranslation(), { wrapper });

  return { store, result };
};

afterEach(() => {
  jest.clearAllMocks();
  i18n.locale = "en"; // i18n.locale is global - reset it
});

describe("useTranslation", () => {
  it("exposes the current locale from the store", async () => {
    expect((await renderUseTranslation()).result.current.locale).toBe("en");
    expect((await renderUseTranslation("ja")).result.current.locale).toBe("ja");
  });

  it("t() returns the same value as i18n.t (delegation, with options)", async () => {
    i18n.locale = "en";
    const { result } = await renderUseTranslation();
    expect(result.current.t("common.cancel")).toBe(i18n.t("common.cancel"));
    expect(result.current.t("common.cancel", { count: 1 })).toBe(
      i18n.t("common.cancel", { count: 1 }),
    );
  });

  it("setLocale updates i18n, the store, and persists the preference", async () => {
    const { result } = await renderUseTranslation("en");

    await act(async () => {
      await result.current.setLocale("ja");
    });

    expect(i18n.locale).toBe("ja");
    expect(result.current.locale).toBe("ja");
    expect(preferenceService.setLocale).toHaveBeenCalledWith("ja");
  });
});
