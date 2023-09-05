/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { SecureBiometricInterfaceIntegrator } from "../index";
import { IBioCompStyle, ISbiEnv } from "../lib/models";

const SBIMeta: Meta<typeof SecureBiometricInterfaceIntegrator> = {
  title: "Secure Biometric Interface Integrator",
  render: (args) => {
    return (
      <div style={{ width: "300px" }}>
        <SecureBiometricInterfaceIntegrator {...args} />
      </div>
    );
  },
  tags: ["autodocs"],
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
    buttonLabel: {
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
    },
    customStyle: {
      control: "object",
    },
    sbiEnv: {
      control: "object",
    },
  },
};

export default SBIMeta;
type Story = StoryObj<typeof SBIMeta>;

const onCapture = (e: any) => action("onCapture")(e);

const onErrored = (e: any) => action("onErrored")(e);

const sbiEnv: ISbiEnv = {
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
  portRange: "4501-4510",
  discTimeout: 15,
  dinfoTimeout: 30,
  domainUri: `${window.origin}`,
};

const customStyle: IBioCompStyle = {
  // errorBannerStyle: {
  //   backgroundColor: "blue",
  //   color: "yellow",
  // },
  refreshButtonStyle: {
    iconUniCode: "\u21bb",
  },
  verifyButtonStyle: {
    background: "green",
    color: "yellow",
  },
  selectBoxStyle: {
    borderColorHover: "yellow",
    borderColorActive: "red",
    borderColor: "green",
    panelBgColor: "yellow",
    panelBgColorHover: "red",
    panelBgColorActive: "green",
  },
};

export const Primary: Story = {
  args: {
    langCode: "en",
    buttonLabel: "scan_and_verify",
    transactionId: "My Transaction Id",
    sbiEnv,
    onCapture,
    onErrored,
  },
};

export const WithCustomStyle: Story = {
  args: {
    langCode: "en",
    buttonLabel: "scan_and_verify",
    transactionId: "My Transaction Id",
    sbiEnv,
    customStyle,
    onCapture,
    onErrored,
  },
};
