import "./App.css";
import { SignInWithEsignet } from "sign-in-with-esignet";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    //configuration for Open id connect
    const oidcConfig = {
      authorizeUri: "https://esignet.dev.mosip.net/authorize",
      redirect_uri: "https://healthservices.dev.mosip.net/userprofile",
      client_id: "88Vjt34c5Twz1oJ",
      scope: "openid profile",
      nonce: "ere973eieljznge2311",
      state: "eree2311",
      acr_values:
        "mosip:idp:acr:generated-code mosip:idp:acr:biometrics mosip:idp:acr:static-code",
      claims_locales: "en",
      display: "page",
      prompt: "consent",
      max_age: 21,
      ui_locales: "en",
    };

    SignInWithEsignet({
      oidcConfig: oidcConfig,
      buttonConfig: {
        shape: "soft_edges",
        theme: "filled_orange",
        labelText: "Sign in With Esignet",
      },
      signInElement: document.getElementById("sign-in-with-esignet"),
    });
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%", background: "#F6F6F2" }}>
      <div className="center">
        <div id="sign-in-with-esignet"></div>
      </div>
    </div>
  );
}

export default App;
