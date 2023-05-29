MosipBioDevice.mosipBioDeviceHelper({
  container: document.getElementById("mosip-bio-device"),
  biometricEnv: {
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
    portRange: "4501-4502",
    discTimeout: 6,
    dinfoTimeout: 30,
    domainUri: `${window.origin}`,
  },
  buttonLabel: "Scan & Verify",
  // customStyle?: IBioCompStyle;
  // langCode?: string;
  disable: false,
  transactionId: "123456789",
  onCapture: (e) => {
    console.log("*******************gettiing the biometric response");
    console.log(e);
  },
  onErrored: (e) => {
    console.log("**********getting error from mosip bio device");
    console.log(e);
  }
});
