import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/english.json";
import hi from "./locales/hindi.json";

export const LanguageCode = {
  EN: "en",
  HI: "hi",
} as const;

export type LanguageCode = (typeof LanguageCode)[keyof typeof LanguageCode];

const STORAGE_KEY = "user-language";
const DEFAULT_LANGUAGE = LanguageCode.EN;

const resources = {
  [LanguageCode.EN]: en,
  [LanguageCode.HI]: hi,
};

export const getSavedLanguage = (): LanguageCode => {
  const savedLanguage = localStorage.getItem(STORAGE_KEY);

  return Object.values(LanguageCode).includes(savedLanguage as LanguageCode)
    ? (savedLanguage as LanguageCode)
    : DEFAULT_LANGUAGE;
};

export const changeLanguage = async (language: LanguageCode): Promise<void> => {
  localStorage.setItem(STORAGE_KEY, language);
  await i18n.changeLanguage(language);
};

void i18n.use(initReactI18next).init({
  resources,
  lng: getSavedLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
