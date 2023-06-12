const states = {
  LOADING: "LOADING",
  LOADED: "LOADED",
  ERROR: "ERROR",
  AUTHENTICATING: "AUTHENTICATING",
};

const DeviceStateStatus = {
  Ready: "READY",
  "Not Ready": "NOTREADY",
  Busy: "BUSY",
  "Not Registered": "NOTREGISTERED",
};

const DeviceState = {
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

const DEFAULT_PROPS = {
  buttonLabel: "scan_and_verify",
  disable: false,
  langCode: "en",
  sbiEnv: {
    env: "Staging",
    captureTimeout: 30,
    irisBioSubtypes: "UNKNOWN",
    fingerBioSubtypes: "UNKNOWN",
    faceCaptureCount: 1,
    faceCaptureScore: 70,
    fingerCaptureCount: 1,
    fingerCaptureScore: 70,
    irisCaptureCount: 1,
    irisCaptureScore: 70,
    portRange: "4501-4600",
    discTimeout: 15,
    dinfoTimeout: 30,
    domainUri: `${window.origin}`,
  },
  customStyle: {
    selectBoxStyle: {
      borderColor: "#cccccc",
      borderColorActive: "#2684ff",
      borderColorHover: "#b3b3b3",
      panelBgColor: "#fff",
      panelBgColorHover: "#deebff",
      panelBgColorActive: "#2684ff",
    },
    refreshButtonStyle: {
      iconUniCode: "\u21bb",
    },
  },
};

export { states, DeviceState, DeviceStateStatus, DEFAULT_PROPS };
