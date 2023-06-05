import { init } from "./../lib/secureBiometricDevice";
import { div } from "../utility";

import { action } from "@storybook/addon-actions";

const customStyle = {
  selectBoxStyle: {
    borderColor: "#cccccc",
    borderColorActive: "#2684ff",
    borderColorHover: "#b3b3b3",
    panelBgColor: "#fff",
    panelBgColorHover: "#deebff",
    panelBgColorActive: "#2684ff",
  },
  refreshButtonStyle: {
    iconUniCode: "\u21bb",
  },
};

const biometricEnv = {
  env: "Staging",
  captureTimeout: 30,
  irisBioSubtypes: "UNKNOWN",
  fingerBioSubtypes: "UNKNOWN",
  faceCaptureCount: 1,
  faceCaptureScore: 70,
  fingerCaptureCount: 1,
  fingerCaptureScore: 70,
  irisCaptureCount: 1,
  irisCaptureScore: 70,
  portRange: "4501-4600",
  discTimeout: 15,
  dinfoTimeout: 30,
  domainUri: `${window.origin}`,
};

export default {
  title: "Secure Biometric Device",
  tags: ["autodocs"],
  render: (args) => renderComponent(args),
  argTypes: {
    container: {
      control: "object",
      type: { required: true, name: "HTMLElement" },
      description:
        "Container inside of which the whole component will be created",
      // table: { category: "Required" },
    },
    langCode: {
      control: "text",
      type: { name: "string" },
      description: "Language code. valid values en& ar",
      table: {
        // category: "Design",
        defaultValue: { summary: "en" },
      },
    },
    disable: {
      control: "boolean",
      type: { name: "boolean" },
      description: "To disable scan_and_verify button.",
      table: {
        // category: "Design",
        defaultValue: { summary: "false" },
      },
    },
    buttonLabel: {
      control: "text",
      description: `Capture button label. valid values ”scan”, ”scan_and_verify”, “capture“, “capture_and_verify”`,
      table: {
        // category: "Design",
        defaultValue: { summary: "scan_and_verify" },
      },
    },
    transactionId: {
      control: "text",
      type: { required: true },
      description: "Transaction Id for the capture",
      // table: { category: "Required" },
    },
    customStyle: {
      control: "object",
      description: "Json object for customize the css of the component.",
      table: {
        // category: "Design",
        defaultValue: {
          summary: JSON.stringify(customStyle),
        },
      },
    },
    biometricEnv: {
      control: "object",
      description: "For customization of SBI environment.",
      table: {
        // category: "Settings",
        defaultValue: { summary: JSON.stringify(biometricEnv) },
      },
    },
    onCapture: {
      control: "events",
      type: { required: true },
      description:
        "The function to be called with Biometric response (successful/failed capture response)",
      // table: { category: "Required" },
    },
    onErrored: {
      control: "events",
      description:
        "Optional callback function on capture failure with the error code string (likely due to timeout)",
      // table: { category: "Error" },
    },
  },
  parameters: {
    layout: "fullscreen",
  },
};

const renderComponent = (args) => {
  const container = document.createElement("div");
  container.setAttribute("id", "secure-biometric-device");
  args.container = container;
  return div(
    {
      style: {
        width: "100%",
        background: "#f6f6f2",
      },
    },
    div(
      {
        style: {
          margin: "auto",
          width: "50%",
          border: "3px solid #d8d8d8",
          padding: "50px",
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
        },
      },
      init(args)
    )
  );
};

export const Primary = {
  args: {
    buttonLabel: "scan_and_verify",
    disable: false,
    langCode: "en",
    biometricEnv,
    customStyle,
    onCapture: (e) => action("onCapture")(e),
    onErrored: (e) => action("onErrored")(e),
  },
};

Primary.parameters = {
  docs: {
    source: {
      code: `
      <div id="secure-biometric-device"></div>

      // in javascript
      SecureBiometricDevice.init({
        container: document.getElementById("secure-biometric-device"),
        buttonLabel: "scan_and_verify",
        biometricEnv: {
          env: "Staging",
          captureTimeout: 30,
          irisBioSubtypes: "UNKNOWN",
          fingerBioSubtypes: "UNKNOWN",
          faceCaptureCount: 1,
          faceCaptureScore: 70,
          fingerCaptureCount: 1,
          fingerCaptureScore: 70,
          irisCaptureCount: 1,
          irisCaptureScore: 70,
          portRange: "4501-4502",
          discTimeout: 6,
          dinfoTimeout: 30,
          domainUri: \`${window.origin}\`,
        },
        langCode: "en",
        disable: false,
        transactionId: "123456789",
        onCapture: (e) => {
          console.log("*******************gettiing the biometric response");
          console.log(e);
        },
        onErrored: (e) => {
          console.log("**********getting error from secure bio device");
          console.log(e);
        },
      });
      `,
    },
  },
};
