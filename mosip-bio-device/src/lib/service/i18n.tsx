import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../assets/locales/en/en.json";
import ar from "../assets/locales/ar/ar.json";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    debug: false,
    fallbackLng: "en", //default language
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources,
  });

export { i18n };

