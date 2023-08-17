import { useEffect } from "react";

// importing Sign in with esignet from the secure-biometric-interface-integrator folder
import { init } from "../../secure-biometric-interface-integrator/lib/secureBiometricInterface";

function SecureBiomtericInterfaceIntegrator({
  buttonLabel,
  disable,
  langCode,
  sbiEnv,
  customStyle,
  transactionId,
  onCapture,
  onErrored,
  id,
}) {
  useEffect(() => {
    init({
      container: document.getElementById(id),
      buttonLabel,
      disable,
      langCode,
      sbiEnv,
      customStyle,
      transactionId,
      onCapture,
      onErrored,
    });
  }, [
    buttonLabel,
    disable,
    langCode,
    sbiEnv,
    customStyle,
    onCapture,
    onErrored,
  ]);

  return (
    <div
      style={{
        width: "100%",
        background: "#f6f6f2",
      }}
    >
      <div
        style={{
          margin: "auto",
          width: "50%",
          border: "3px solid #d8d8d8",
          padding: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div id={id}></div>
      </div>
    </div>
  );
}

export default SecureBiomtericInterfaceIntegrator;
