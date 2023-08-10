import type { Meta, StoryObj } from "@storybook/web-components";
import SignInWithEsignet from "../lib/SignInWithEsignet";
import { html } from "lit";

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

const buttonConfig = {
  type: "standard",
  theme: "outline",
  shape: "sharp_edges",
  labelText: "Sign in with e-Signet",
};

const oidcConfigType =
  '{\r\n  authorizeUri: "string",\r\n  redirect_uri: "string",\r\n  client_id: "string",\r\n  scope: "string",\r\n  nonce: "string",\r\n  state: "string",\r\n  acr_values: "string",\r\n  claims_locales: "string",\r\n  ui_locales: "string",\r\n  display: "page" | "popup" | "touch" | "wap",\r\n  max_age: "number",\r\n  prompt: "none" | "login" | "consent" | "select_account",\r\n}';

const buttonType =
  '{\r\n  type: "standard" | "icon",\r\n  theme: "outline" | "filled_orange" | "filled_black" | "custom",\r\n  shape: "sharp_edges" | "soft_edges" | "rounded_edges",\r\n  labelText: "string",\r\n  logoPath: "string",\r\n  width: "string",\r\n  background: "string",\r\n  textColor: "string",\r\n  borderColor: "string",\r\n  borderWidth: "string",\r\n  font: "string",\r\n  fontFamily: "string",\r\n  customStyle: "Json-Object",\r\n}';

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
export default {
  title: "Sign In With Esignet",
  tags: ["autodocs"],
  render: (args: any) => renderSignInButton(args),
  argTypes: {
    oidcConfig: {
      control: "object",
      description: "Open Id connect configurations",
      table: {
        defaultValue: {
          detail: JSON.stringify(oidcConfig, null, "  "),
          summary: "oidcConfig",
        },
        type: {
          detail: oidcConfigType,
          summary: "OidcConfigType",
        },
      },
    },
    buttonConfig: {
      control: "object",
      description: "Configuration for sign in button",
      table: {
        defaultValue: {
          detail: JSON.stringify(buttonConfig, null, "  "),
          summary: "buttonConfig",
        },
        type: {
          detail: buttonType,
          summary: "ButtonConfigProp",
        },
      },
    },
  },
} as Meta<typeof SignInWithEsignet>;

const renderSignInButton = (args: any) => {
  args.signInElement = document.createElement("div");
  return html` <div style="width: 100%; background: #f6f6f2">
    <div
      style="
      margin: auto;
      width: 50%;
      border: 3px solid #d8d8d8;
      padding: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    "
    >
      ${SignInWithEsignet(args)}
    </div>
  </div>`;
};
type Story = StoryObj<typeof SignInWithEsignet>;

export const SignInWithEsignetStandardButton: Story = {
  args: {
    oidcConfig,
    buttonConfig: {
      type: "standard",
      theme: "filled_orange",
      shape: "soft_edges",
      labelText: "Sign in with e-Signet",
    },
  },
};

export const SignInWithEsignetStandardIconButton: Story = {
  args: {
    oidcConfig,
    buttonConfig: {
      type: "icon",
      theme: "filled_orange",
      shape: "soft_edges",
      labelText: "Sign in with e-Signet",
    },
  },
};

export const SignInWithEsignetStandardButtonWithCustomDesign: Story = {
  args: {
    oidcConfig,
    buttonConfig: {
      labelText: "Sign in with e-Signet",
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
          alignItems: "center",
          verticalAlign: "middle",
          width: "30px",
          height: "30px",
          right: "8px",
        },
        logoImgStyle: {
          width: "29px",
          height: "29px",
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
    },
  },
};
