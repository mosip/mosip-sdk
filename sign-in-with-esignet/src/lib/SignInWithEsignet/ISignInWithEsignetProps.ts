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
  code_challenge?: string;
  code_challenge_method?: string;
  display?: string;
  max_age?: number;
  prompt?: string;
}

interface ButtonConfigProp {
  type?: string;
  theme?: string;
  labelText?: string;
  shape?: string;
  width?: string;
  logoPath?: string;
  background?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: string;
  font?: string;
  fontFamily?: string;
  customStyle?: {
    outerDivStyleStandard: { [key: string]: string };
    outerDivStyleIcon: { [key: string]: string };
    logoDivStyle: { [key: string]: string };
    logoImgStyle: { [key: string]: string };
    labelSpanStyle: { [key: string]: string };
  };
}

interface ISignInWithEsignetProps {
  oidcConfig: OidcConfigProp;
  buttonConfig: ButtonConfigProp;
  signInElement: HTMLElement;
  style: { [key: string]: string };
}

export { OidcConfigProp, ButtonConfigProp, ISignInWithEsignetProps };
