import type { Meta, StoryObj } from "@storybook/react";

import { MosipBioDevice } from "../index";

const MosipBioDeviceMeta: Meta<typeof MosipBioDevice> = {
  title: "MosipBioDevice",
  component: MosipBioDevice,
  tags: ["autodocs"],
  argTypes: {
    labelName: {
      control: "text",
    },
    buttonName: {
      control: "text",
    },
    transactionId: {
      control: "text",
    },
    jsonCss: {
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
  labelName: "Biometric Device",
  buttonName: "Scan & Verify",
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
  onCapture: myChange,
  onErrored: myError,
};
