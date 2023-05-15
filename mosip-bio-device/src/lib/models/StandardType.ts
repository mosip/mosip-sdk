type EnvType = "Staging" | "Developer" | "Pre-Production" | "Production";

type FingerSubBioType =
  | "Left IndexFinger"
  | "Left MiddleFinger"
  | "Left RingFinger"
  | "Left LittleFinger"
  | "Left Thumb"
  | "Right IndexFinger"
  | "Right MiddleFinger"
  | "Right RingFinger"
  | "Right LittleFinger"
  | "Right Thumb"
  | "UNKNOWN";

type IrisBioSubType = "Left" | "Right" | "UNKNOWN";

type DeviceStateStatusType = "READY" | "NOTREADY" | "BUSY" | "NOTREGISTERED";

enum BioType {
  FACE = "Face",
  FINGER = "Finger",
  IRIS = "Iris",
}

export {
  EnvType,
  BioType,
  IrisBioSubType,
  FingerSubBioType,
  DeviceStateStatusType,
};
