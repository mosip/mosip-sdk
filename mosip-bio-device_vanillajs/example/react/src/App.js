import { useEffect, useState } from "react";

import { init, propChange } from "mosip-bio-device";

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

  init({
    container: document.getElementById("mosip-bio-device"),
    biometricEnv,
    onCapture: myChange,
    onErrored: myError,
  });
  const [langCode, setLangCode] = useState("en");
  useEffect(() => {
    propChange({langCode})
  }, [langCode]);

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

      <div
        style={{
          margin: "4rem",
          border: "solid red 4px",
          padding: "20px",
        }}
      >
        <button onClick={setLangCode("er")}>Change Language</button>
      </div>
    </div>
  );
}

export default App;
