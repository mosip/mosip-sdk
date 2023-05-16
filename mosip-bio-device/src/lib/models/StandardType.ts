/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

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
