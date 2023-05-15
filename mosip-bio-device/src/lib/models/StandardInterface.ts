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
};
