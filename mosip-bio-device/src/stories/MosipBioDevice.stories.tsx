/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from "@storybook/react";

import { MosipBioDevice } from "../index";

const MosipBioDeviceMeta: Meta<typeof MosipBioDevice> = {
  title: "MosipBioDevice",
  component: MosipBioDevice,
  tags: ["autodocs"],
  argTypes: {
    langCode: {
      control: "text",
    },
    buttonName: {
      control: "text",
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

const myChange = (e: any) => {
  console.log("my changes");
  console.log(e);
};

const myError = (e: any) => {
  console.log("my error");
  console.log(e);
};

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
    portRange: "4501-4510",
    discTimeout: 15,
    dinfoTimeout: 30,
    domainUri: `${window.origin}`,
  },
  customStyle: {
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
  },
  onCapture: myChange,
  onErrored: myError,
};
