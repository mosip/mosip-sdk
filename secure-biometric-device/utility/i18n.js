/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import i18n from "i18next";

import en from "../assets/locales/en/en.json";
import ar from "../assets/locales/ar/ar.json";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
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
