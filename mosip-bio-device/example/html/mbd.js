var lang = "en";
MosipBioDevice.init({
  container: document.getElementById("mosip-bio-device"),
  buttonLabel: "scan_and_verify",
  langCode: lang,
  disable: false,
  transactionId: "123456789",
  onCapture: (e) => {
    console.log("*******************gettiing the biometric response");
    console.log(e);
  },
  onErrored: (e) => {
    console.log("**********getting error from mosip bio device");
    console.log(e);
  },
});

const myObject = {
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
  buttonLabel: "scan",
  langCode: "ar",
  disable: true,
  transactionId: "9876543210",
  onCapture: (e) => {
    console.log("******************new on capture method");
    console.log(e);
  },
  onErrored: (e) => {
    console.log("****************new errored message");
    console.log(e);
  },
};

document
  .getElementById("deviceLanguageChange")
  .addEventListener("click", () => {
    MosipBioDevice.propChange(myObject);
  });
