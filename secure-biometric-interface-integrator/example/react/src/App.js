import { useEffect } from "react";

import { init, propChange } from "secure-biometric-interface-integrator";

const myChange = (e) => {
  console.log("my changes");
  console.log(e);
};

const myError = (e) => {
  console.log("my error");
  console.log(e);
};

const sbiEnv = {
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
    init({
      container: document.getElementById(
        "secure-biometric-interface-integration"
      ),
      sbiEnv,
      onCapture: myChange,
      onErrored: myError,
    });
  }, []);

  const myPropChange = () =>
    propChange({
      langCode: "ar",
      disable: false,
    });

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          margin: "auto",
          width: "50%",
          border: "3px solid green",
          padding: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          id="secure-biometric-interface-integration"
          style={{
            width: "60%",
          }}
        ></div>
      </div>

      <div>
        <button onClick={() => myPropChange()}>Change Prop</button>
      </div>
    </div>
  );
}

export default App;
