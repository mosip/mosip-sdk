/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {
  DeviceStateStatusType,
  EnvType,
  FingerSubBioType,
  IrisBioSubType,
} from "./StandardType";

interface IDeviceState {
  value: string;
  name: string;
  class: string;
  symbol: string;
}

interface IDeviceInfo {
  specVersion: string[];
  env: string;
  digitalId: IDigitalId | string;
  deviceId: string;
  deviceCode: string;
  purpose: string;
  serviceVersion: string;
  deviceStatus: string;
  firmware: string;
  certification: string;
  deviceSubId: string[];
  callbackId: string;
}

interface IDigitalId {
  serialNo: string;
  make: string;
  model: string;
  type: string;
  deviceSubType: string;
  deviceProviderId: string;
  deviceProvider: string;
  dateTime: string;
}

interface IDiscoverResponse {
  deviceId: string;
  deviceStatus: string;
  certification: string;
  serviceVersion: string;
  callbackId: string;
  digitalId: IDigitalId;
  deviceCode: string;
  purpose: string;
  error: IErrorInfo;
  specVersion: string[];
  deviceSubId: string[];
}

interface IErrorInfo {
  errorCode: string;
  errorInfo: string;
}

interface IInputField {
  labelText: string;
  labelFor: string;
  id: string;
  name: string;
  type: string;
  autoComplete: string;
  isRequired: boolean;
  placeholder: string;
}

interface IErrorClass {
  errorCode?: string;
  defaultMsg?: string;
}

interface IDeviceDetail {
  port: number;
  specVersion: string;
  type: string;
  deviceId: string;
  model: string;
  serialNo: string;
  text: string;
  value: string;
  icon: string;
  status: DeviceStateStatusType;
}

interface IBiometricEnv {
  env: EnvType;
  captureTimeout: number;
  irisBioSubtypes: IrisBioSubType;
  fingerBioSubtypes: FingerSubBioType;
  faceCaptureCount: number;
  faceCaptureScore: number;
  fingerCaptureCount: number;
  fingerCaptureScore: number;
  irisCaptureCount: number;
  irisCaptureScore: number;
  portRange: string;
  discTimeout: number;
  dinfoTimeout: number;
  domainUri: string;
}

interface ISelectBoxStyle {
  borderColor?: string;
  borderColorActive?: string;
  borderColorHover?: string
  panelBgColor?: string;
  panelBgColorHover?: string;
  panelBgColorActive?: string; 
}

interface IVerifyButtonStyle {
  background?: string;
  color?: string;
}

interface IRefreshButtonStyle {
  iconUniCode: string;
}

interface IBioCompStyle {
  selectBoxStyle?: ISelectBoxStyle;
  refreshButtonStyle?: IRefreshButtonStyle;
  verifyButtonStyle?: IVerifyButtonStyle;
  // errorBannerStyle?: Object;
}

export {
  IDeviceState,
  IDeviceInfo,
  IDigitalId,
  IDiscoverResponse,
  IErrorInfo,
  IInputField,
  IErrorClass,
  IDeviceDetail,
  IBiometricEnv,
  IBioCompStyle,
  IRefreshButtonStyle,
  ISelectBoxStyle,
  IVerifyButtonStyle,
};
