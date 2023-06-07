import type { Meta, StoryObj } from "@storybook/web-components";
import { init } from "../lib";
import { ISignInWithEsignetProps } from "../lib/SignInWithEsignet/ISignInWithEsignetProps";
import { html } from "lit";

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
const SignInWithEsignetMeta = {
  title: "Eample/SignInWithEsignet",
  tags: ["autodocs"],
  render: (args) => renderSignInButton(args),
  argTypes: {
    oidcConfig: {
      control: "object",
    },
    buttonConfig: {
      control: "object",
    },
  },
} satisfies Meta<ISignInWithEsignetProps>;

export default SignInWithEsignetMeta;

const renderSignInButton = (args: ISignInWithEsignetProps) => {
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
      ${init(args)}
    </div>
  </div>`;
};
type Story = StoryObj<typeof init>;

export const SignInWithEsignetStory: Story = {
  args: {
    oidcConfig: {
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
    },
    buttonConfig: {
      type: "standard",
      theme: "filled_orange",
      shape: "soft_edges",
      labelText: "Sign in with e-Signet",
    },
  },
};
