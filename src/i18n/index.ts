import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { APP_CONFIG } from "config/app";
import enTranslations from "./locales/en.json";
import trTranslations from "./locales/tr.json";

const resources = {
  en: {
    translation: {
      ...enTranslations,
      appName: APP_CONFIG.name,
      appShortName: APP_CONFIG.shortName,
    },
  },
  tr: {
    translation: {
      ...trTranslations,
      appName: APP_CONFIG.name,
      appShortName: APP_CONFIG.shortName,
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("language") || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

