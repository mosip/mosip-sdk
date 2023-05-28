import { ButtonConfigProp, OidcConfigProp } from "./ISignInWithEsignetProps";
import esignetLogo from "../assets/esignet_logo.png";
import {
  buttonTypes,
  defaultButtonLabel,
  defaultShapes,
  defaultThemes,
  validDisplays,
  validPrompt,
  validResponseTypes,
} from "../common/constants";
import { customStyle, styleClasses } from "../common/CommonTypes";
import styles from "../assets/SignInWithEsignet.module.css";

const defaultResponseType = "code";

/**
 * Validates oidc configuration for required params and valid values
 * @param oidcConfig oidc configuration prop
 * @returns Error object with error code and error msg.
 */
function validateInput(oidcConfig: OidcConfigProp): string {
  //Required parameters
  if (
    !oidcConfig ||
    !oidcConfig.authorizeUri ||
    !oidcConfig.redirect_uri ||
    !oidcConfig.client_id ||
    !oidcConfig.scope
  ) {
    return "Required parameter is missing";
  }

  //if the param is not null and has and an invalid value return error msg.
  if (
    oidcConfig.response_type &&
    !validResponseTypes.includes(oidcConfig.response_type)
  ) {
    return "Invalid Response Type";
  }
  if (oidcConfig.display && !validDisplays.includes(oidcConfig.display)) {
    return "Invalid display value";
  }
  if (oidcConfig.prompt && !validPrompt.includes(oidcConfig.prompt)) {
    return "Invalid prompt value";
  }

  return "";
}

/**
 * Builds redirect URL to navigate to id provider's portal.
 * @param oidcConfig
 * @returns URL
 */
function buildRedirectURL(oidcConfig: OidcConfigProp): string {
  let urlToNavigate: string = oidcConfig?.authorizeUri;

  if (oidcConfig?.nonce) urlToNavigate += "?nonce=" + oidcConfig.nonce;

  //Generating random state if not provided
  if (oidcConfig?.state) {
    urlToNavigate += "&state=" + oidcConfig.state;
  } else {
    const randomState = Math.random().toString(36).substring(5);
    urlToNavigate += "&state=" + randomState;
  }

  if (oidcConfig?.client_id)
    urlToNavigate += "&client_id=" + oidcConfig.client_id;
  if (oidcConfig?.redirect_uri)
    urlToNavigate += "&redirect_uri=" + oidcConfig.redirect_uri;
  if (oidcConfig?.scope) urlToNavigate += "&scope=" + oidcConfig.scope;

  if (oidcConfig?.response_type) {
    urlToNavigate += "&response_type=" + oidcConfig.response_type;
  } else {
    urlToNavigate += "&response_type=" + defaultResponseType;
  }

  if (oidcConfig?.acr_values)
    urlToNavigate += "&acr_values=" + oidcConfig?.acr_values;
  if (oidcConfig?.claims)
    urlToNavigate += "&claims=" + encodeURI(JSON.stringify(oidcConfig.claims));
  if (oidcConfig?.claims_locales)
    urlToNavigate += "&claims_locales=" + oidcConfig.claims_locales;
  if (oidcConfig?.display) urlToNavigate += "&display=" + oidcConfig.display;
  if (oidcConfig?.prompt) urlToNavigate += "&state=" + oidcConfig.prompt;
  if (oidcConfig?.max_age) urlToNavigate += "&max_age=" + oidcConfig.max_age;

  if (oidcConfig?.ui_locales)
    urlToNavigate += "&ui_locales=" + oidcConfig.ui_locales;

  return urlToNavigate;
}

/**
 * builds classes based on input shape, theme and button type.
 *
 * if theme is 'custom' then standard classes are applied and these clases
 *  are expected to be added by the button implementer.
 *
 * @param buttonConfig
 * @returns classes
 */
function buildButtonClasses(buttonConfig: ButtonConfigProp): styleClasses {
  let outerDivClasses = "";
  let logoDivClasses = "";
  let logoImgClasses = "";
  let labelSpanClasses = styles.textbox;

  if (buttonConfig.theme == defaultThemes.custom) {
    return {
      outerDivClasses: (outerDivClasses =
        buttonConfig.type == buttonTypes.icon
          ? "sign-in-outer-div-container-icon"
          : "sign-in-outer-div-container-standard"),
      logoDivClasses: "sign-in-logo-div-container",
      logoImgClasses: "sign-in-logo-img",
      labelSpanClasses: "sign-in-label-span",
    };
  }

  //theme based styling
  switch (buttonConfig.theme) {
    case defaultThemes.outline:
      outerDivClasses = styles.standardOutline;
      break;
    case defaultThemes.filledOrange:
      outerDivClasses = styles.filledOrange;
      break;
    case defaultThemes.filledBlack:
      outerDivClasses = styles.filledBlack;
      break;
    default: //default theme outline
      outerDivClasses = styles.standardOutline;
  }

  //shaped based styling
  switch (buttonConfig.shape) {
    case defaultShapes.sharpEdges:
      //default button type is standard. Setting shape based on button type
      outerDivClasses +=
        " " +
        (buttonConfig.type == buttonTypes.icon
          ? styles.sharpRectIcon
          : styles.sharpRectBox);
      logoDivClasses = styles.sharpLogoBox;
      logoImgClasses = styles.sharpLogo;
      break;
    case defaultShapes.softEdges:
      outerDivClasses +=
        " " +
        (buttonConfig.type == buttonTypes.icon
          ? styles.softRectIcon
          : styles.softRectBox);
      logoDivClasses = styles.softLogoBox;
      logoImgClasses = styles.softLogo;
      break;
    case defaultShapes.roundedEdges:
      outerDivClasses +=
        " " +
        (buttonConfig.type == buttonTypes.icon
          ? styles.roundedRectIcon
          : styles.roundedRectBox);
      logoDivClasses = styles.roundedLogoBox;
      logoImgClasses = styles.roundedLogo;
      break;
    default: //default shaped SharpEdges
      outerDivClasses +=
        " " +
        (buttonConfig.type == buttonTypes.icon
          ? styles.sharpRectIcon
          : styles.sharpRectBox);
      logoDivClasses = styles.sharpLogoBox;
      logoImgClasses = styles.sharpLogo;
  }

  return {
    outerDivClasses: outerDivClasses,
    logoDivClasses: logoDivClasses,
    logoImgClasses: logoImgClasses,
    labelSpanClasses: labelSpanClasses,
  };
}

/**
 * builds style for the outer div by updating baseStyle by adding/overriding
 *  button config styling parameters.
 * @param baseStyle
 * @param buttonConfig
 * @returns style
 */
function buildButtonStyles(
  baseStyle: any,
  buttonConfig: ButtonConfigProp
): any {
  if (buttonConfig?.width) baseStyle.width = buttonConfig.width;
  if (buttonConfig?.background) baseStyle.background = buttonConfig.background;
  if (buttonConfig?.textColor) baseStyle.color = buttonConfig.textColor;
  if (buttonConfig?.borderWidth)
    baseStyle.borderWidth = buttonConfig.borderWidth;
  if (buttonConfig?.borderColor)
    baseStyle.borderColor = buttonConfig.borderColor;

  return baseStyle;
}

/**
 * builds style based on button type and custom style.
 *
 * if theme is 'custom' then standard classes are applied and these clases
 *  are expected to be added by the button implementer.
 * @param baseStyle
 * @param buttonConfig
 * @returns
 */
function buildButtonCustomStyles(
  baseStyle: any,
  buttonConfig: ButtonConfigProp
): customStyle {
  if (!buttonConfig.customStyle) {
    return {};
  }

  let outerDiv =
    buttonConfig.type == buttonTypes.icon
      ? buttonConfig.customStyle.outerDivStyleIcon
      : buttonConfig.customStyle.outerDivStyleStandard;

  Object.assign(baseStyle, outerDiv);

  return {
    outerDivStyle: buildButtonStyles(baseStyle, buttonConfig),
    logoDivStyle: buttonConfig.customStyle.logoDivStyle,
    logoImgStyle: buttonConfig.customStyle.logoImgStyle,
    labelSpanStyle: buttonConfig.customStyle.labelSpanStyle,
  };
}

const setStyleAttribute = (
  element: HTMLElement,
  attrs: { [key: string]: string }
): void => {
  if (attrs !== undefined) {
    Object.keys(attrs).forEach((key: string) => {
      element.style.setProperty(key, attrs[key]);
    });
  }
};

const createButton = (
  buttonLabel: string,
  urlToNavigate: string,
  buttonCustomStyle: customStyle | null,
  buttonClasses: styleClasses | null,
  buttonStyle: any,
  logoPath: string,
  errorMsg: string,
  type: string
) => {
  //Div Container
  var container = document.createElement("div");

  //Button
  var anchor = document.createElement("a");
  anchor.href = urlToNavigate;
  anchor.style.textDecoration = "none";

  var outerDiv = document.createElement("div");

  var logoDiv = document.createElement("div");

  var logoImg = document.createElement("img");
  logoImg.src = logoPath;

  var labelSpan = document.createElement("span");
  labelSpan.innerHTML = buttonLabel;

  if (buttonCustomStyle) {
    //apply custom style
    setStyleAttribute(outerDiv, buttonCustomStyle.outerDivStyle);
    setStyleAttribute(logoDiv, buttonCustomStyle.logoDivStyle);
    setStyleAttribute(logoImg, buttonCustomStyle.logoDivStyle);
    setStyleAttribute(labelSpan, buttonCustomStyle.labelSpanStyle);
  } else if (buttonClasses) {
    //or apply classes
    setStyleAttribute(outerDiv, buttonStyle);
    outerDiv.classList.add(...buttonClasses.outerDivClasses.split(" "));
    logoDiv.classList.add(...buttonClasses.logoDivClasses.split(" "));
    logoImg.classList.add(...buttonClasses.logoImgClasses.split(" "));
    labelSpan.classList.add(...buttonClasses.labelSpanClasses.split(" "));
  }

  logoDiv.appendChild(logoImg);
  outerDiv.appendChild(logoDiv);

  //Do not add label span for icon button
  if (type != buttonTypes.icon) {
    outerDiv.appendChild(labelSpan);
  }

  anchor.appendChild(outerDiv);

  if (errorMsg) {
    //adding error span
    var errorSpan = document.createElement("span");
    errorSpan.style.color = "red";
    errorSpan.style.color = "14px";
    errorSpan.innerHTML = errorMsg + ". Please report to site admin";
    container.appendChild(errorSpan);
  }

  container.appendChild(anchor);
  return container;
};

//TODO add option for custom styling
const SignInWithEsignet = ({ ...props }) => {
  let { oidcConfig, buttonConfig, signInElement } = props;

  if (signInElement == null) {
    return;
  }

  //validate input
  let errorMsg = validateInput(oidcConfig);
  let urlToNavigate = "#";
  if (!errorMsg) {
    urlToNavigate = buildRedirectURL(oidcConfig);
  }

  if (!buttonConfig) {
    //default values
    buttonConfig = {
      type: buttonTypes.standard,
      theme: defaultThemes.outline,
      labelText: defaultButtonLabel,
      shape: defaultShapes.sharpEdges,
    };
  }
  const label = buttonConfig.labelText ?? defaultButtonLabel;
  const logoPath = buttonConfig.logoPath ?? esignetLogo;

  let buttonCustomStyle: customStyle | null = null;
  let buttonClasses: styleClasses | null = null;
  let buttonStyle: any = {};

  buttonClasses = buildButtonClasses(buttonConfig);

  // customStyle has precedence over buttonClasses
  if (buttonConfig.customStyle) {
    buttonCustomStyle = buildButtonCustomStyles(buttonStyle, buttonConfig);
  } else {
    buttonClasses = buildButtonClasses(buttonConfig);
    buttonStyle = buildButtonStyles(buttonStyle, buttonConfig);
  }

  var button = createButton(
    label,
    urlToNavigate,
    buttonCustomStyle,
    buttonClasses,
    buttonStyle,
    logoPath,
    errorMsg,
    buttonConfig.type
  );
  signInElement.innerHTML = "";
  signInElement.appendChild(button);
};

export default SignInWithEsignet;
