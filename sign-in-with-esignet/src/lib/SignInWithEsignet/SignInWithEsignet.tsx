import React from "react";
import {
  ButtonConfigProp,
  ISignInWithEsignetProps,
  OidcConfigProp,
} from "./ISignInWithEsignetProps";
//import esignetLogo from "../assets/esignet_logo.png";
import esignetLogo from "../assets/esignet_logo.png";
import {
  buttonTypes,
  defaultShapes,
  defaultThemes,
  validDisplays,
  validPrompt,
  validResponseTypes,
} from "../common/constants";
import { Error } from "../common/CommonTypes";
import styles from "./SignInWithEsignet.module.css";

const defaultResponseType = "code";

function validateInput(oidcConfig: OidcConfigProp): Error {
  let errorObj: Error = {};

  //Required parameters
  if (
    !oidcConfig ||
    !oidcConfig.authorizeUri ||
    !oidcConfig.redirect_uri ||
    !oidcConfig.client_id ||
    !oidcConfig.scope
  ) {
    errorObj.errorCode = "require_param_missing";
    errorObj.errorMsg = "Required parameter is missing";
    return errorObj;
  }

  //if not null and invalid then return false
  if (
    oidcConfig.response_type &&
    !validResponseTypes.includes(oidcConfig.response_type)
  ) {
    errorObj.errorCode = "invalid_response_type";
    errorObj.errorMsg = "Invalid Response Type";
    return errorObj;
  }
  if (oidcConfig.display && !validDisplays.includes(oidcConfig.display)) {
    errorObj.errorCode = "invalid_display_value";
    errorObj.errorMsg = "Invalid display value";
    return errorObj;
  }
  if (oidcConfig.prompt && !validPrompt.includes(oidcConfig.prompt)) {
    errorObj.errorCode = "invalid_prompt_value";
    errorObj.errorMsg = "Invalid prompt value";
    return errorObj;
  }

  return errorObj;
}

function buildRedirectURL(oidcConfig: OidcConfigProp): string {
  let urlToNavigate: string = oidcConfig?.authorizeUri;

  if (oidcConfig?.nonce) urlToNavigate += "?nonce=" + oidcConfig.nonce;

  if (oidcConfig?.client_id)
    urlToNavigate += "&client_id=" + oidcConfig.client_id;
  if (oidcConfig?.redirect_uri)
    urlToNavigate += "&redirect_uri=" + oidcConfig.redirect_uri;
  if (oidcConfig?.scope) urlToNavigate += "&scope=" + oidcConfig.scope;
  if (oidcConfig?.acr_values)
    urlToNavigate += "&acr_values=" + oidcConfig?.acr_values;
  if (oidcConfig?.claims)
    urlToNavigate += "&claims=" + encodeURI(JSON.stringify(oidcConfig.claims));
  if (oidcConfig?.display) urlToNavigate += "&display=" + oidcConfig.display;
  if (oidcConfig?.prompt) urlToNavigate += "&state=" + oidcConfig.prompt;
  if (oidcConfig?.max_age) urlToNavigate += "&max_age=" + oidcConfig.max_age;
  if (oidcConfig?.claims_locales)
    urlToNavigate += "&claims_locales=" + oidcConfig.claims_locales;

  if (oidcConfig?.response_type) {
    urlToNavigate += "&response_type=" + oidcConfig.response_type;
  } else {
    urlToNavigate += "&response_type=" + defaultResponseType;
  }

  //Generating random state if not provided
  if (oidcConfig?.state) {
    urlToNavigate += "&state=" + oidcConfig.state;
  } else {
    const randomState = Math.random().toString(36).substring(5);
    urlToNavigate += "&state=" + randomState;
  }

  return urlToNavigate;
}

function buildButtonCustomStyles(
  baseStyle: React.CSSProperties,
  buttonConfig: ButtonConfigProp
): React.CSSProperties {
  if (buttonConfig?.width) baseStyle.width = buttonConfig.width;
  if (buttonConfig?.background) baseStyle.background = buttonConfig.background;
  if (buttonConfig?.textColor) baseStyle.color = buttonConfig.textColor;
  if (buttonConfig?.borderWidth)
    baseStyle.borderWidth = buttonConfig.borderWidth;
  if (buttonConfig?.borderColor)
    baseStyle.borderColor = buttonConfig.borderColor;

  return baseStyle;
}

function buildButtonClasses(buttonConfig: ButtonConfigProp): {
  outerDivClasses: string;
  logoDivClasses: string;
  logoImgClasses: string;
  labelSpanClasses: string;
} {
  let outerDivClasses = "";
  let logoDivClasses = "";
  let logoImgClasses = "";
  let labelSpanClasses = styles.textbox;

  switch (buttonConfig.shape) {
    case defaultShapes.sharpEdges:
      outerDivClasses =
        buttonConfig.type == buttonTypes.icon
          ? styles.sharpRectIcon
          : styles.sharpRectBox;
      logoDivClasses = styles.sharpLogoBox;
      logoImgClasses = styles.sharpLogo;
      break;
    case defaultShapes.softEdges:
      outerDivClasses =
        buttonConfig.type == buttonTypes.icon
          ? styles.softRectIcon
          : styles.softRectBox;
      logoDivClasses = styles.softLogoBox;
      logoImgClasses = styles.softLogo;
      break;
    case defaultShapes.roundedEdges:
      outerDivClasses =
        buttonConfig.type == buttonTypes.icon
          ? styles.roundedRectIcon
          : styles.roundedRectBox;
      logoDivClasses = styles.roundedLogoBox;
      logoImgClasses = styles.roundedLogo;
      break;
    default:
      outerDivClasses =
        buttonConfig.type == buttonTypes.icon
          ? styles.sharpRectIcon
          : styles.sharpRectBox;
      logoDivClasses = styles.sharpLogoBox;
      logoImgClasses = styles.sharpLogo;
  }

  switch (buttonConfig.theme) {
    case defaultThemes.outline:
      outerDivClasses += " " + styles.standardOutline;
      break;
    case defaultThemes.filledOrange:
      outerDivClasses += " " + styles.filledOrange;
      break;
    case defaultThemes.filledBlack:
      outerDivClasses += " " + styles.filledBlack;
      break;
    default:
      outerDivClasses += " " + styles.standardOutline;
  }

  return {
    outerDivClasses: outerDivClasses,
    logoDivClasses: logoDivClasses,
    logoImgClasses: logoImgClasses,
    labelSpanClasses: labelSpanClasses,
  };
}

const SignInWithEsignet: React.FC<ISignInWithEsignetProps> = ({ ...props }) => {
  const { oidcConfig, buttonConfig, style } = props;

  const baseStyle: React.CSSProperties = style || {};

  let errorObj = validateInput(oidcConfig);
  let urlToNavigate = "#";
  if (!errorObj.errorCode) {
    urlToNavigate = buildRedirectURL(oidcConfig);
  }

  const defaultButtonLabel = "Sign in with e-Signet";
  const label = buttonConfig?.text ?? defaultButtonLabel;
  const logoPath = buttonConfig?.logoPath ?? esignetLogo;

  const buttonClasses = buildButtonClasses(buttonConfig);
  const buttonStyle = buildButtonCustomStyles(baseStyle, buttonConfig);
  return (
    <>
      {errorObj.errorMsg && (
        <span style={{ color: "red", fontSize: "14px" }}>
          {errorObj.errorMsg + ". Please report to site admin"}
        </span>
      )}
      <a href={urlToNavigate}>
        <div className={buttonClasses.outerDivClasses} style={buttonStyle}>
          <div className={buttonClasses.logoDivClasses}>
            <img className={buttonClasses.logoImgClasses} src={logoPath} />
          </div>
          {buttonConfig.type != buttonTypes.icon && (
            <span className={buttonClasses.labelSpanClasses}>{label}</span>
          )}
        </div>
      </a>
    </>
  );
};

export default SignInWithEsignet;
