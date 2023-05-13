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
    outerDivStyleStandard: React.CSSProperties;
    outerDivStyleIcon: React.CSSProperties;
    logoDivStyle: React.CSSProperties;
    logoImgStyle: React.CSSProperties;
    labelSpanStyle: React.CSSProperties;
  };
}

interface ISignInWithEsignetProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  oidcConfig: OidcConfigProp;
  buttonConfig: ButtonConfigProp;
}

export { OidcConfigProp, ButtonConfigProp, ISignInWithEsignetProps };
