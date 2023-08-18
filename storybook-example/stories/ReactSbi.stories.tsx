/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import ReactSbi from "../src/ReactSbi";

import {
  IBioCompStyle,
  IBiometricEnv,
} from "../../mosip-bio-device/src/lib/models";

const customStyleType = {
  selectBoxStyle: {
    borderColor: "string",
    borderColorActive: "string",
    borderColorHover: "string",
    panelBgColor: "string",
    panelBgColorHover: "string",
    panelBgColorActive: "string",
  },
  refreshButtonStyle: {
    iconUniCode: "string",
  },
  verifyButtonStyle: {
    background: "string",
    color: "string",
  },
};

const biometricEnvType =
  '{\r\n  env: "Staging" | "Developer" | "Pre-Production" | "Production",\r\n  captureTimeout: "number",\r\n  irisBioSubtypes: "Left" | "Right" | "UNKNOWN",\r\n  fingerBioSubtypes:\r\n    "Left IndexFinger" | "Left MiddleFinger" | "Left RingFinger" | "Left LittleFinger" | "Left Thumb" | "Right IndexFinger" | "Right MiddleFinger" | "Right RingFinger" | "Right LittleFinger" | "Right Thumb" | "UNKNOWN",\r\n  faceCaptureCount: 1,\r\n  faceCaptureScore: "0-100",\r\n  fingerCaptureCount: "1-10",\r\n  fingerCaptureScore: "0-100",\r\n  irisCaptureCount: "1-2",\r\n  irisCaptureScore: "0-100",\r\n  portRange: "4501-4600",\r\n  discTimeout: "number",\r\n  dinfoTimeout: "number",\r\n  domainUri: "string",\r\n}';

const biometricEnv: IBiometricEnv = {
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
  portRange: "4501-4505",
  discTimeout: 15,
  dinfoTimeout: 30,
  domainUri: `${window.origin}`,
};

const customStyle: IBioCompStyle = {
  refreshButtonStyle: {
    iconUniCode: "\u21bb",
  },
  verifyButtonStyle: {
    background: "#A9D8E0",
    color: "#140111",
  },
  selectBoxStyle: {
    borderColor: "#cccccc",
    borderColorActive: "#2684ff",
    borderColorHover: "#b3b3b3",
    panelBgColor: "#fff",
    panelBgColorHover: "#deebff",
    panelBgColorActive: "#2684ff",
  },
};

const SbiMeta = {
  title: "React/Secure Biometric Interface",
  tags: ["autodocs"],
  component: ReactSbi,
  argTypes: {
    langCode: {
      control: "text",
      type: { name: "string" },
      description: "Language code",
      table: {
        defaultValue: { summary: "en" },
        type: {
          summary: "en | hi | ta | kn | ar | eng | hin | tam | kan | ara",
        },
      },
    },
    disable: {
      control: "boolean",
      description: "To disable `scan & verify` button.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    buttonName: {
      control: "text",
      type: { name: "string" },
      description: `Capture button label`,
      table: {
        defaultValue: { summary: "scan_and_verify" },
        type: {
          summary: "scan | scan_and_verify | capture | capture_and_verify",
        },
      },
    },
    transactionId: {
      control: "text",
      description: "Transaction Id for the capture",
      table: {
        type: { summary: "string" },
      },
    },
    customStyle: {
      control: "object",
      description: "Json object for customize the css of the component.",
      table: {
        defaultValue: {
          detail: JSON.stringify(customStyle, null, "  "),
          summary: "customStyle",
        },
        type: {
          detail: JSON.stringify(customStyleType, null, "  "),
          summary: "CustomStyleType",
        },
      },
    },
    biometricEnv: {
      control: "object",
      description: "For customization of SBI environment.",
      table: {
        defaultValue: {
          detail: JSON.stringify(biometricEnv, null, "  "),
          summary: "biometricEnv",
        },
        type: {
          detail: biometricEnvType,
          summary: "BiometricEnvType",
        },
      },
    },
    onCapture: {
      control: "events",
      description:
        "The function to be called with Biometric response (successful/failed capture response)",
    },
    onErrored: {
      control: "events",
      description:
        "Optional callback function on capture failure with the error code string (likely due to timeout)",
    },
  },
  parameters: {
    layout: "fullscreen"
  }
} as Meta;
export default SbiMeta;
type Story = StoryObj<typeof SbiMeta>;

const onCapture = (e: any) => action("onCapture")(e);

const onErrored = (e: any) => action("onErrored")(e);

export const Primary: Story = {
  args: {
    langCode: "en",
    buttonName: "scan_and_verify",
    transactionId: "My Transaction Id",
    biometricEnv,
    onCapture,
    onErrored,
  },
};

export const WithCustomStyle: Story = {
  args: {
    langCode: "en",
    buttonName: "scan_and_verify",
    transactionId: "My Transaction Id",
    biometricEnv,
    customStyle,
    onCapture,
    onErrored,
  },
};