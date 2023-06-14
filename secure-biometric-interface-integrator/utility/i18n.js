/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import i18n from "i18next";

import en from "../assets/locales/en/en.json";
import ar from "../assets/locales/ar/ar.json";
import hi from "../assets/locales/hi/hi.json";
import ka from "../assets/locales/ka/ka.json";
import ta from "../assets/locales/ta/ta.json";
import eng from "../assets/locales/eng/eng.json";
import ara from "../assets/locales/ara/ara.json";
import hin from "../assets/locales/hin/hin.json";
import kan from "../assets/locales/kan/kan.json";
import tam from "../assets/locales/tam/tam.json";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
  hi: { translation: hi },
  ka: { translation: ka },
  ta: { translation: ta },
  eng: { translation: eng },
  ara: { translation: ara },
  hin: { translation: hin },
  kan: { translation: kan },
  tam: { translation: tam },
};

i18n
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
