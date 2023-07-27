/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { MosipBioDevice } from "../index";
import { IBioCompStyle, IBiometricEnv } from "../lib/models";

const MosipBioDeviceMeta: Meta<typeof MosipBioDevice> = {
  title: "MosipBioDevice",
  component: MosipBioDevice,
  tags: ["autodocs"],
  argTypes: {
    langCode: {
      control: "select",
      options: [
        "en",
        "hi",
        "ta",
        "kn",
        "ar",
        "eng",
        "hin",
        "tam",
        "kan",
        "ara",
      ],
      type: { name: "string" },
      description: "Language code",
      table: {
        defaultValue: { summary: "en" },
        type: {
          summary: "en | hi | ta | kn | ar | eng | hin | tam | kan | ara",
        },
      },
    },
    buttonName: {
      control: "select",
      options: [
        "scan",
        "scan_and_verify",
        "capture",
        "capture_and_verify"
      ],
      type: {name: "string"},
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
    biometricEnv: {
      control: "object",
    },
  },
};

export default MosipBioDeviceMeta;

const onCapture = (e: any) => action("onCapture")(e);

const onErrored = (e: any) => action("onErrored")(e);

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
    color: "yellow"
  },
  selectBoxStyle: {
    borderColorHover: "yellow",
    borderColorActive: "red",
    borderColor: "green",
    panelBgColor: "yellow",
    panelBgColorHover: "red",
    panelBgColorActive: "green",
  },
}

export const MosipBioDeviceStory: StoryObj<typeof MosipBioDeviceMeta> = {
  render: (args) => {
    return (
      <div style={{ width: "300px" }}>
        <MosipBioDevice {...args} />
      </div>
    );
  },
};

MosipBioDeviceStory.args = {
  langCode: "en",
  buttonName: "scan_and_verify",
  transactionId: "My Transaction Id",
  biometricEnv,
  onCapture,
  onErrored,
};

export const MosipBioDeviceStoryCustomStyle: StoryObj<typeof MosipBioDeviceMeta> = {
  render: (args) => {
    return (
      <div style={{ width: "300px" }}>
        <MosipBioDevice {...args} />
      </div>
    );
  },
};

MosipBioDeviceStoryCustomStyle.args = {
  langCode: "en",
  buttonName: "scan_and_verify",
  transactionId: "My Transaction Id",
  biometricEnv,
  customStyle,
  onCapture,
  onErrored,
};
