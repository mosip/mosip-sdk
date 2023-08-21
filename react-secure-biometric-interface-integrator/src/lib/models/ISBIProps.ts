/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { IBiometricEnv, IErrorClass, IBioCompStyle } from "./StandardInterface";

interface ISBIProps {
  buttonName: string;
  transactionId: string;
  customStyle?: IBioCompStyle;
  langCode?: string;
  biometricEnv?: IBiometricEnv;
  disable?: boolean;
  onCapture: (biometricResponse: Object) => void;
  onErrored: (errorObj: IErrorClass | null) => void;
}

export { ISBIProps };
