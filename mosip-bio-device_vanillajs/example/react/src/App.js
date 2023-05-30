import { useEffect } from "react";

import { mosipBioDeviceHelper } from "mosip-bio-device-js";

const myChange = (e) => {
  console.log("my changes");
  console.log(e);
};

const myError = (e) => {
  console.log("my error");
  console.log(e);
};

const biometricEnv = {
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
  portRange: "4501-4510",
  discTimeout: 15,
  dinfoTimeout: 30,
};

function App() {
  useEffect(() => {
    mosipBioDeviceHelper({
      container: document.getElementById("mosip-bio-device"),
      biometricEnv,
      onCapture: myChange,
      onErrored: myError,
    });
  }, []);

  return (
    <div
      className="App"
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          margin: "4rem",
          border: "solid red 4px",
          padding: "20px",
        }}
      >
        <div id="mosip-bio-device" style={{ width: "400px" }}></div>
      </div>
    </div>
  );
}

export default App;
