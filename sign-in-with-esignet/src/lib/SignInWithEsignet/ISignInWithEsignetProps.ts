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

interface ButtonConfig {
  type?: string;
  theme?: string;
  size?: string;
  text?: string;
  shape?: string;
  width?: number;
  logo_path?: string;
  logo_alignment?: object;
  font?: string;
  background_color?: string;
  text_color?: string;
  border?: number;
  border_color?: string;
  border_width?: string;
}

interface ISignInWithEsignetProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  oidcConfig: OidcConfigProp;
  buttonConfig: ButtonConfig;
}

export { OidcConfigProp, ButtonConfig, ISignInWithEsignetProps };
