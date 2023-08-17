import { useEffect } from "react";

// importing Sign in with esignet from the sign-in-with-esignet folder
import init from "../../sign-in-with-esignet/src/lib/SignInWithEsignet/SignInWithEsignet";

function SignInWithEsignet({ oidcConfig, buttonConfig, id }) {
  useEffect(() => {
    init({
      oidcConfig,
      buttonConfig,
      signInElement: document.getElementById(id),
      style: {
        fontFamily: "'Cera Pro Bold', Arial, sans-serif",
      },
    });
  }, [oidcConfig, buttonConfig]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        width: "100%",
        background: "#F6F6F2",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ marginLeft: "1.5rem" }}>
          <div id={id}></div>
        </div>
      </div>
    </div>
  );
}

export default SignInWithEsignet;
