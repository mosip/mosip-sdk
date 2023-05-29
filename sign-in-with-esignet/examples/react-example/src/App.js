import "./App.css";
import { SignInWithEsignet } from "sign-in-with-esignet";
import { useEffect } from "react";

function App() {
  const claims = {
    userinfo: {
      given_name: {
        essential: true,
      },
      phone_number: {
        essential: false,
      },
      email: {
        essential: true,
      },
      picture: {
        essential: false,
      },
      gender: {
        essential: false,
      },
      birthdate: {
        essential: false,
      },
      address: {
        essential: false,
      },
    },
    id_token: {},
  };

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
    claims: claims,
  };

  let standardInputsBlack = [
    {
      logoPath: "esignet_logo.png",
      shape: "sharp_edges",
      theme: "filled_black",
    },
    {
      logoPath: "esignet_logo.png",
      shape: "rounded_edges",
      theme: "filled_black",
    },
    {
      logoPath: "esignet_logo.png",
      shape: "soft_edges",
      theme: "filled_black",
    },
    {
      logoPath: "long_logo.png",
      shape: "soft_edges",
      theme: "filled_black",
    },
  ];

  let standardInputsOrange = [
    {
      logoPath: "esignet_logo.png",
      shape: "sharp_edges",
      theme: "filled_orange",
    },
    {
      logoPath: "esignet_logo.png",
      shape: "rounded_edges",
      theme: "filled_orange",
    },
    {
      logoPath: "esignet_logo.png",
      shape: "soft_edges",
      theme: "filled_orange",
    },
    {
      logoPath: "long_logo.png",
      shape: "rounded_edges",
      theme: "filled_orange",
    },
  ];

  let standardInputsOutline = [
    {
      logoPath: "esignet_logo.png",
      shape: "sharp_edges",
      theme: "outline",
    },
    {
      logoPath: "esignet_logo.png",
      shape: "rounded_edges",
      theme: "outline",
    },
    {
      logoPath: "esignet_logo.png",
      shape: "soft_edges",
      theme: "outline",
    },
    {
      logoPath: "long_logo.png",
      shape: "sharp_edges",
      theme: "outline",
    },
  ];

  let iconInputsBlack = [
    {
      logoPath: "esignet_logo.png",
      shape: "sharp_edges",
      theme: "filled_black",
      type: "icon",
    },
    {
      logoPath: "esignet_logo.png",
      shape: "rounded_edges",
      theme: "filled_black",
      type: "icon",
    },
    {
      logoPath: "esignet_logo.png",
      shape: "soft_edges",
      theme: "filled_black",
      type: "icon",
    },
  ];

  let iconInputsOrange = [
    {
      logoPath: "long_logo.png",
      shape: "sharp_edges",
      theme: "filled_orange",
      type: "icon",
    },
    {
      logoPath: "long_logo.png",
      shape: "rounded_edges",
      theme: "filled_orange",
      type: "icon",
    },
    {
      logoPath: "long_logo.png",
      shape: "soft_edges",
      theme: "filled_orange",
      type: "icon",
    },
  ];

  let iconInputsOutline = [
    {
      logoPath: "esignet_logo.png",
      shape: "sharp_edges",
      theme: "outline",
      type: "icon",
    },
    {
      logoPath: "esignet_logo.png",
      shape: "rounded_edges",
      theme: "outline",
      type: "icon",
    },
    {
      logoPath: "esignet_logo.png",
      shape: "soft_edges",
      theme: "outline",
      type: "icon",
    },
  ];

  useEffect(() => {
    standardInputsBlack.map((input, idx) =>
      SignInWithEsignet({
        oidcConfig: oidcConfig,
        buttonConfig: {
          logoPath: input.logoPath,
          shape: input.shape,
          theme: input.theme,
        },
        signInElement: document.getElementById(
          "sign-in-with-esignet_sib" + idx
        ),
      })
    );

    iconInputsBlack.map((input, idx) =>
      SignInWithEsignet({
        oidcConfig: oidcConfig,
        buttonConfig: {
          logoPath: input.logoPath,
          shape: input.shape,
          theme: input.theme,
          type: input.type,
        },
        signInElement: document.getElementById(
          "sign-in-with-esignet_iib" + idx
        ),
      })
    );

    standardInputsOrange.map((input, idx) =>
      SignInWithEsignet({
        oidcConfig: oidcConfig,
        buttonConfig: {
          logoPath: input.logoPath,
          shape: input.shape,
          theme: input.theme,
          type: input.type,
        },
        signInElement: document.getElementById(
          "sign-in-with-esignet_sio" + idx
        ),
      })
    );

    iconInputsOrange.map((input, idx) =>
      SignInWithEsignet({
        oidcConfig: oidcConfig,
        buttonConfig: {
          logoPath: input.logoPath,
          shape: input.shape,
          theme: input.theme,
          type: input.type,
        },
        signInElement: document.getElementById(
          "sign-in-with-esignet_iio" + idx
        ),
      })
    );

    standardInputsOutline.map((input, idx) =>
      SignInWithEsignet({
        oidcConfig: oidcConfig,
        buttonConfig: {
          logoPath: input.logoPath,
          shape: input.shape,
          theme: input.theme,
          type: input.type,
        },
        signInElement: document.getElementById(
          "sign-in-with-esignet_siou" + idx
        ),
      })
    );

    iconInputsOutline.map((input, idx) =>
      SignInWithEsignet({
        oidcConfig: oidcConfig,
        buttonConfig: {
          logoPath: input.logoPath,
          shape: input.shape,
          theme: input.theme,
          type: input.type,
        },
        signInElement: document.getElementById(
          "sign-in-with-esignet_iiou" + idx
        ),
      })
    );

    SignInWithEsignet({
      oidcConfig: oidcConfig,
      buttonConfig: {
        logoPath: "long_logo.png",
        theme: "custom",
        labelText: "Sign in with Custom",
      },
      signInElement: document.getElementById("sign-in-with-esignet_custom_std"),
    });

    SignInWithEsignet({
      oidcConfig: oidcConfig,
      buttonConfig: {
        logoPath: "long_logo.png",
        theme: "custom",
        labelText: "Sign in with Custom",
        type: "icon",
      },
      signInElement: document.getElementById(
        "sign-in-with-esignet_custom_icon"
      ),
    });

    SignInWithEsignet({
      oidcConfig: {
        authorizeUri: "https://esignet.dev.mosip.net/authorize",
        redirect_uri: "https://healthservices.dev.mosip.net/userprofile",
        client_id: "88Vjt34c5Twz1oJ",
        scope: "openid profile",
        response_type: "hello",
      },
      buttonConfig: {
        logoPath: "long_logo.png",
        shape: "soft_edges",
        theme: "filled_orange",
        background: "lightblue url('long_logo.png')",
        textColor: "red",
        borderColor: "green",
        borderWidth: "2px",
      },
      signInElement: document.getElementById("sign-in-with-esignet_invalid"),
      style: {
        fontFamily: "'Lucida Console', 'Courier New', 'monospace'",
        font: "normal normal 600 20px Inter",
        color: "blue",
        marginTop: "1.5rem",
      },
    });

    SignInWithEsignet({
      oidcConfig: oidcConfig,
      buttonConfig: {
        logoPath: "philsys_logo2.png",
        labelText: "Sign in with Philippine Id System",
        customStyle: {
          outerDivStyleStandard: {
            position: "relative",
            width: "100%",
            borderWidth: "1px",
            borderColor: "rgb(203 213 225)",
            backgroundColor: "#0E3572",
            padding: "0.625rem 1.25rem",
            display: "flex",
            borderRadius: "0.375rem",
            textDecoration: "none",
            color: "white",
            alignItems: "center",
          },
          logoDivStyle: {
            borderRadius: "0.375rem",
            background: "white",
            position: "absolute",
            display: "inline-block",
            alignItems: "center",
            verticalAlign: "middle",
            width: "1.8rem",
            height: "1.8rem",
            right: "1rem",
          },
          labelSpanStyle: {
            display: "inline-block",
            verticalAlign: "middle",
            fontWeight: "600",
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
          },
        },
      },
      signInElement: document.getElementById("sign-in-with-esignet_style_std"),
      style: {
        fontFamily: "'Cera Pro Bold', Arial, sans-serif",
      },
    });

    SignInWithEsignet({
      oidcConfig: oidcConfig,
      buttonConfig: {
        logoPath: "long_logo.png",
        labelText: "Sign in with Custom Style",
        customStyle: {
          outerDivStyleIcon: {
            borderWidth: "2px",
            display: "inline-block",
            borderRadius: "15px",
            borderColor: "orange",
          },
          logoDivStyle: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "38px",
            height: "38px",
            backgroundColor: "white",
            borderRadius: "36px",
          },
          logoImgStyle: {
            width: "28px",
            height: "28px",
            objectFit: "contain",
          },
        },
        type: "icon",
      },
      signInElement: document.getElementById("sign-in-with-esignet_style_icon"),
      style: {
        fontFamily: "'Cera Pro Bold', Arial, sans-serif",
      },
    });
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%", background: "#F6F6F2" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ marginLeft: "1.5rem" }}>
          <div>Theme Black</div>
          {standardInputsBlack.map((input, idx) => (
            <div style={{ marginTop: "1.5rem" }}>
              <div id={"sign-in-with-esignet_sib" + idx}></div>
            </div>
          ))}
          <div style={{ display: "flex", marginTop: "1.5rem" }}>
            {iconInputsBlack.map((input, idx) => (
              <div style={{ marginLeft: "1.5rem" }}>
                <div id={"sign-in-with-esignet_iib" + idx}></div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "1.5rem" }}>Theme Custom</div>
          <div style={{ marginTop: "1.5rem" }}>
            <div id={"sign-in-with-esignet_custom_std"}></div>
          </div>
          <div style={{ marginTop: "1.5rem" }}>Theme Custom (Icon)</div>
          <div style={{ marginTop: "1.5rem" }}>
            <div id={"sign-in-with-esignet_custom_icon"}></div>
          </div>
        </div>
        <div style={{ marginLeft: "1.5rem" }}>
          <div>Theme Orange</div>
          {standardInputsOrange.map((input, idx) => (
            <div style={{ marginTop: "1.5rem" }}>
              <div id={"sign-in-with-esignet_sio" + idx}></div>
            </div>
          ))}
          <div style={{ display: "flex", marginTop: "1.5rem" }}>
            {iconInputsOrange.map((input, idx) => (
              <div style={{ marginLeft: "1.5rem" }}>
                <div id={"sign-in-with-esignet_iio" + idx}></div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            Theme Orange with invalid response_type
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <div id={"sign-in-with-esignet_invalid"}></div>
          </div>
        </div>
        <div style={{ marginLeft: "1.5rem" }}>
          <div>Theme Outline</div>
          {standardInputsOutline.map((input, idx) => (
            <div style={{ marginTop: "1.5rem" }}>
              <div id={"sign-in-with-esignet_siou" + idx}></div>
            </div>
          ))}
          <div style={{ display: "flex", marginTop: "1.5rem" }}>
            {iconInputsOutline.map((input, idx) => (
              <div style={{ marginLeft: "1.5rem" }}>
                <div id={"sign-in-with-esignet_iiou" + idx}></div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "1.5rem" }}>CustomStyle (Standard)</div>
          <div style={{ marginTop: "1.5rem" }}>
            <div id={"sign-in-with-esignet_style_std"}></div>
          </div>
          <div style={{ marginTop: "1.5rem" }}>CustomStyle (Icon)</div>
          <div style={{ marginTop: "1.5rem" }}>
            <div id={"sign-in-with-esignet_style_icon"}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
