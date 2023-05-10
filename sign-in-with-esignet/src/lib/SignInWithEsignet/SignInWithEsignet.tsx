import React from "react";
import { ISignInWithEsignetProps } from "./ISignInWithEsignetProps";

const SignInWithEsignet: React.FC<ISignInWithEsignetProps> = ({ ...props }) => {
  // const { oidcConfig, buttonConfig } = props;

  const redirectURL =
    "https://esignet.dev.mosip.net/authorize?nonce=ere973eieljznge2311&state=eree2311&client_id=88Vjt34c5Twz1oJ&redirect_uri=https://healthservices.dev.mosip.net/userprofile&response_type=code&scope=openid%20profile&acr_values=mosip:idp:acr:generated-code%20mosip:idp:acr:biometrics%20mosip:idp:acr:static-code&claims=%7B%22userinfo%22:%7B%22given_name%22:%7B%22essential%22:true%7D,%22phone_number%22:%7B%22essential%22:false%7D,%22email%22:%7B%22essential%22:true%7D,%22picture%22:%7B%22essential%22:false%7D,%22gender%22:%7B%22essential%22:false%7D,%22birthdate%22:%7B%22essential%22:false%7D,%22address%22:%7B%22essential%22:false%7D%7D,%22id_token%22:%7B%7D%7D&display=page&prompt=consent&max_age=21&claims_locales=en&ui_locales=en"; // oidcConfig.redirect_uri;
  const label = "Sign in with e-Signet";
  const logoPath = "./esignet_logo.png";
  // const logoPath = img;
  const logoAlt = "E-signet logo";

  return (
    <a
      href={redirectURL}
      style={{
        position: "relative",
        width: "100%",
        borderWidth: "1px",
        borderColor: "rgb(203 213 225)",
        backgroundColor: "#f3f4f6",
        padding: "0.625rem 1.25rem",
        display: "inline-block",
        borderRadius: "0.375rem",
        textDecoration: "none",
        color: "black",
      }}
    >
      <span
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          fontWeight: "600",
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
        }}
      >
        {label}
      </span>
      <img
        style={{
          position: "absolute",
          display: "inline-block",
          verticalAlign: "middle",
          width: "1.5rem",
          height: "1.5rem",
          right: "1.25rem",
        }}
        src={logoPath}
        alt={logoAlt}
      />
    </a>
  );
};

export default SignInWithEsignet;
