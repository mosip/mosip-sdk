import "./App.css";
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
      window.SignInWithEsignetButton.init({
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
      window.SignInWithEsignetButton.init({
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

    window.SignInWithEsignetButton.init({
      oidcConfig: oidcConfig,
      buttonConfig: {
        logoPath: "long_logo.png",
        theme: "custom",
        labelText: "Sign in with Custom",
      },
      signInElement: document.getElementById("sign-in-with-esignet_custom_std"),
    });

    window.SignInWithEsignetButton.init({
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

    standardInputsOrange.map((input, idx) =>
      window.SignInWithEsignetButton.init({
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
      window.SignInWithEsignetButton.init({
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

    window.SignInWithEsignetButton.init({
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
        borderWidth: "4px",
        width: "300px",
        fontFamily:
          "'Cera Pro Bold', Arial, 'Lucida Console', 'Courier New', 'monospace'",
        font: "normal normal 600 20px Inter",
      },
      signInElement: document.getElementById("sign-in-with-esignet_invalid"),
    });

    standardInputsOutline.map((input, idx) =>
      window.SignInWithEsignetButton.init({
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
      window.SignInWithEsignetButton.init({
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

    window.SignInWithEsignetButton.init({
      oidcConfig: oidcConfig,
      buttonConfig: {
        logoPath: "phil_logo.png",
        labelText: "Sign in with Phily Id System",
        customStyle: {
          outerDivStyleStandard: {
            position: "relative",
            width: "250px",
            border: "1px solid #0E3572",
            background: "#0E3572",
            padding: "0.625rem 1.25rem",
            display: "flex",
            "border-radius": "0.375rem",
            "text-decoration": "none",
            color: "white",
            "align-items": "center",
          },
          logoDivStyle: {
            border: "1px solid #0E3572",
            "border-radius": "18px",
            background: "white",
            position: "absolute",
            display: "inline-block",
            "align-items": "center",
            "vertical-align": "middle",
            width: "38px",
            height: "38px",
            right: "2px",
          },
          logoImgStyle: {
            width: "38px",
            height: "38px",
            "object-fit": "contain",
          },
          labelSpanStyle: {
            display: "inline-block",
            "vertical-align": "middle",
            "font-weight": "600",
            "font-size": "0.875rem",
            "line-height": "1.25rem",
          },
        },
        style: {
          "font-family": "'Cera Pro Bold', Arial, sans-serif",
        },
      },
      signInElement: document.getElementById("sign-in-with-esignet_style_std"),
    });

    window.SignInWithEsignetButton.init({
      oidcConfig: oidcConfig,
      buttonConfig: {
        logoPath: "long_logo.png",
        labelText: "Sign in with Custom Style",
        customStyle: {
          outerDivStyleIcon: {
            border: "2px solid orange",
            display: "inline-block",
            "border-radius": "15px",
          },
          logoDivStyle: {
            display: "flex",
            "justify-content": "center",
            "align-items": "center",
            width: "38px",
            height: "38px",
            "background-color": "white",
            "border-radius": "36px",
          },
          logoImgStyle: {
            width: "28px",
            height: "28px",
            "object-fit": "contain",
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100%",
        background: "#F6F6F2",
      }}
    >
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
