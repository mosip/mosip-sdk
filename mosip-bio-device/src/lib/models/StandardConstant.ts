import { IDeviceState } from "./StandardInterface";
import { DeviceStateStatusType } from "./StandardType";

const DeviceStateStatus: { [name: string]: DeviceStateStatusType } = {
  Ready: "READY",
  "Not Ready": "NOTREADY",
  Busy: "BUSY",
  "Not Registered": "NOTREGISTERED",
};

const DeviceState: { [name in DeviceStateStatusType]: IDeviceState } = {
  READY: {
    value: "READY",
    name: "Ready",
    class: "ready",
    symbol: "\u25CF",
  },
  NOTREADY: {
    value: "NOTREADY",
    name: "Not Ready",
    class: "not-ready",
    symbol: "\u25CF",
  },
  BUSY: {
    value: "BUSY",
    name: "Busy",
    class: "busy",
    symbol: "\u25CF",
  },
  NOTREGISTERED: {
    value: "NOTREGISTERED",
    name: "Not Registered",
    class: "not-registered",
    symbol: "\u25CE",
  },
};

const LoadingStates = {
  LOADING: "LOADING",
  LOADED: "LOADED",
  ERROR: "ERROR",
  AUTHENTICATING: "AUTHENTICATING",
};

const host = "http://127.0.0.1";
const errorRibbonClass =
  "mdb-p-2 mdb-mt-1 mdb-mb-1 mdb-w-full mdb-text-center mdb-text-sm mdb-rounded-lg mdb-text-red-700 mdb-bg-red-100 ";

const loadingContClass =
  "mdb-bottom-0 mdb-left-0 mdb-bg-white mdb-bg-opacity-70 mdb-py-4 mdb-h-full mdb-w-full mdb-flex mdb-justify-center mdb-font-semibold";

const verifyButtonClass =
  "mdb-cursor-pointer mdb-block mdb-w-full mdb-font-medium mdb-rounded-lg mdb-text-sm mdb-px-5 mdb-py-2 mdb-text-center mdb-border mdb-border-2 ";

const scanButtonClass =
  "mdb-cursor-pointer mdb-flex mdb-items-center mdb-ml-auto mdb-text-gray-900 mdb-bg-white mdb-shadow border mdb-border-gray-300 mdb-hover:bg-gray-100 mdb-font-medium mdb-rounded-lg mdb-text-lg mdb-px-3 mdb-py-1 mdb-ml-1";

export {
  host,
  DeviceState,
  DeviceStateStatus,
  LoadingStates,
  errorRibbonClass,
  loadingContClass,
  verifyButtonClass,
  scanButtonClass,
};
