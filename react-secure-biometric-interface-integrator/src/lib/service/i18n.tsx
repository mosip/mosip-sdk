/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../assets/locales/en/en.json";
import ar from "../assets/locales/ar/ar.json";
import hi from "../assets/locales/hi/hi.json";
import kn from "../assets/locales/kn/kn.json";
import ta from "../assets/locales/ta/ta.json";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
  hi: { translation: hi },
  kn: { translation: kn },
  ta: { translation: ta },
  eng: { translation: en },
  ara: { translation: ar },
  hin: { translation: hi },
  kan: { translation: kn },
  tam: { translation: ta },
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

