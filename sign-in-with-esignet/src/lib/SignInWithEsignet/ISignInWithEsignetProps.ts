interface OidcConfigProp {
  authorizeUri: string;
  redirect_uri: string;
  client_id: string;
  scope: string;
  response_type?: string;
  nonce?: string;
  state?: string;
  acr_values?: string;
  claims?: object;
  claims_locales?: string;
  ui_locales?: string;
  display?: string;
  max_age?: number;
  prompt?: string;
}

interface ButtonConfigProp {
  type?: string;
  theme?: string;
  labelText?: string;
  shape?: string;
  width?: number;
  logoPath?: string;
  background?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: string;
  customStyle?: {
    outerDivStyleStandard: { [key: string]: string };
    outerDivStyleIcon: { [key: string]: string };
    logoDivStyle: { [key: string]: string };
    logoImgStyle: { [key: string]: string };
    labelSpanStyle: { [key: string]: string };
  };
}

// interface ISignInWithEsignetProps {
//   oidcConfig: OidcConfigProp;
//   buttonConfig: ButtonConfigProp;
// }

export { OidcConfigProp, ButtonConfigProp };
