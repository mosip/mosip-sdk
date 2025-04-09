/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import axios from "axios";
import { localStorageService } from "./localstorage";
import * as jose from "jose";

const {
  addDeviceInfos,
  addDiscoveredDevices,
  clearDeviceInfos,
  clearDiscoveredDevices,
} = {
  ...localStorageService,
};
const purpose = "Auth";
const certification = "L1";

const DeviceStatusReady = "Ready";

/**
 * endpoint for the biometric device
 */
const deviceEndPoint = "/device";
const infoEndPoint = "/info";
const captureEndPoint = "/capture";

/**
 * http method for retrieving from &
 * sending data to the biometric devices
 */
const mosip_DiscoverMethod = "MOSIPDISC";
const mosip_DeviceInfoMethod = "MOSIPDINFO";
const mosip_CaptureMethod = "CAPTURE";

/**
 * Default from & till port as per SBI spec
 */
const defaultFromPort = 4501;
const defaultTillPort = 4600

const BioType = {
  FACE: "Face",
  FINGER: "Finger",
  IRIS: "Iris",
};

class SbiService {
  sbiConfig;

  constructor(sbiConfig) {
    this.sbiConfig = {
      env: this.nullCheckStr(sbiConfig.env,"Staging"),
      irisBioSubtypes: this.nullCheckStr(sbiConfig.irisBioSubtypes, "UNKNOWN"),
      fingerBioSubtypes: this.nullCheckStr(sbiConfig.fingerBioSubtypes, "UNKNOWN"),
      faceCaptureCount: this.nullCheckNum(sbiConfig.faceCaptureCount, "1"),
      faceCaptureScore: this.nullCheckNum(sbiConfig.faceCaptureScore, "70"),
      fingerCaptureCount: this.nullCheckNum(sbiConfig.fingerCaptureCount, "1"),
      fingerCaptureScore: this.nullCheckNum(sbiConfig.fingerCaptureScore, "70"),
      irisCaptureCount: this.nullCheckNum(sbiConfig.irisCaptureCount, "1"),
      irisCaptureScore: this.nullCheckNum(sbiConfig.irisCaptureScore, "70"),
      portRange: this.nullCheckStr(sbiConfig.portRange, "4501-4600"),
      captureTimeout: this.convertToMs(sbiConfig.captureTimeout, "30000"),
      discTimeout: this.convertToMs(sbiConfig.discTimeout, "15000"),
      dinfoTimeout: this.convertToMs(sbiConfig.dinfoTimeout, "30000"),
      domainUri: this.nullCheckStr(sbiConfig.domainUri, window.origin),
    };
  }

  /**
   * Convert sec to millisecond
   * @param {string | number | undefined | null} current
   * @param {string} default
   * @returns {string} converted millisecond
   */
  convertToMs = (current, defaultVal) => {
    if (current === null || current === undefined || current === "" || isNaN(current)) {
      return defaultVal;
    }
    return (current * 1000).toString();
  }

  /**
   * Null check & string conversion of number
   * @param {string | number | undefined | null} str
   * @param {string} defaultVal
   * @returns {string} string value
   */
  nullCheckNum = (current, defaultVal) => {
    if (current === null || current === undefined || current === "" || isNaN(current)) {
      return defaultVal;
    }
    return current.toString();
  }

  /**
   * Null check for string
   * @param {string | undefined | null} str
   * @param {string} defaultVal
   * @returns {string} string value
   */
  nullCheckStr = (current, defaultVal) => {
    if (current === null || current === undefined || current === "") {
      return defaultVal;
    }
    return current.toString();
  }


  /**
   * Triggers capture request of SBI for auth capture
   * @param {url} host SBI is hosted on given host
   * @param {int} port port on which SBI is listening to.
   * @param {string} transactionId same as Biometric transactionId
   * @param {string} specVersion supported spec version
   * @param {string} type modality type
   * @param {string} deviceId
   * @returns auth capture response
   */
  capture_Auth = async (
    host,
    port,
    transactionId,
    specVersion,
    type,
    deviceId
  ) => {
    let count = 1;
    let requestedScore = 70;
    let bioSubType = ["UNKNOWN"];
    switch (type) {
      case BioType.FACE:
        count = this.sbiConfig.faceCaptureCount;
        requestedScore = this.sbiConfig.faceCaptureScore;
        bioSubType = null; //For Face: No bioSubType
        break;
      case BioType.FINGER:
        count = this.sbiConfig.fingerCaptureCount;
        requestedScore = this.sbiConfig.fingerCaptureScore;
        bioSubType = this.sbiConfig.fingerBioSubtypes
          .split(",")
          .map((x) => x.trim());
        break;
      case BioType.IRIS:
        count = this.sbiConfig.irisCaptureCount;
        requestedScore = this.sbiConfig.irisCaptureScore;
        bioSubType = this.sbiConfig.irisBioSubtypes
          .split(",")
          .map((x) => x.trim());
        break;
    }

    let request = {
      env: this.sbiConfig.env,
      purpose,
      specVersion,
      timeout: this.sbiConfig.captureTimeout,
      captureTime: new Date().toISOString(),
      domainUri: this.sbiConfig.domainUri,
      transactionId,
      bio: [
        {
          type, //modality
          count, // from configuration
          bioSubType,
          requestedScore, // from configuration
          deviceId, // from discovery
          deviceSubId: "0", //Set as 0, not required for Auth capture.
          previousHash: "", // empty string
        },
      ],
      customOpts: null,
    };

    let endpoint = host + ":" + port + captureEndPoint;

    let response = await axios({
      method: mosip_CaptureMethod,
      url: endpoint,
      data: request,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response?.data;
  };

  /**
   * Triggers MOSIPDISC request on multiple port simultaneously.
   * @param {url} host SBI is hosted on given host
   * @returns MOSIPDISC requests for the given host and the port ranging between fromPort and tillPort
   */
  mosipdisc_DiscoverDevicesAsync = async (host) => {
    clearDiscoveredDevices();
    clearDeviceInfos();

    let [fromPort, tillPort] = this.sbiConfig?.portRange
      ?.split("-")
      ?.map((x) => Number(x.trim())) ?? [defaultFromPort, defaultTillPort];

    if (
      isNaN(fromPort) ||
      isNaN(tillPort) ||
      !(fromPort >= defaultFromPort) ||
      !(tillPort <= defaultTillPort) ||
      !(fromPort <= tillPort)
    ) {
      // default port
      [fromPort, tillPort] = [defaultFromPort, defaultTillPort];
    }

    let discoverRequestList = [];
    for (let i = fromPort; i <= tillPort; i++) {
      discoverRequestList.push(
        discoverRequestBuilder(
          host,
          i,
          this.sbiConfig.discTimeout,
          this.sbiConfig.dinfoTimeout
        )
      );
    }

    return axios.all(discoverRequestList);
  };
}

/**
 * Builds MOSIPDISC API request for multiple ports to discover devices on
 * the specifed host and port. On success response, discovered devices
 * are cached and MOSIPDINFO API is called to fetch deviceInfo.
 * @param {url} host SBI is hosted on given host
 * @param {int} port port on which SBI is listening to.
 * @returns MOSIPDISC request for the give host and port
 */
const discoverRequestBuilder = async (
  host,
  port,
  discTimeout,
  dinfoTimeout
) => {
  let endpoint = host + ":" + port + deviceEndPoint;

  let request = {
    type: "Biometric Device",
  };

  return axios({
    method: mosip_DiscoverMethod,
    url: endpoint,
    data: request,
    timeout: discTimeout,
  })
    .then(async (response) => {
      if (response?.data !== null) {
        addDiscoveredDevices(port, response.data);
        await mosipdinfo_DeviceInfo(host, port, dinfoTimeout);
      }
    })
    .catch((error) => {
      //ignore
    });
};

/**
 * MOSIPDINFO API call for fetch deviceinfo from SBI on the specifed host and port
 * On success response, the device infos are decoded, validated and cached.
 * @param {url} host SBI is hosted on given host
 * @param {int} port port on which SBI is listening to.
 */
const mosipdinfo_DeviceInfo = async (host, port, dinfoTimeout) => {
  let endpoint = host + ":" + port + infoEndPoint;

  await axios({
    method: mosip_DeviceInfoMethod,
    url: endpoint,
    timeout: dinfoTimeout,
  })
    .then(async (response) => {
      if (response?.data !== null) {
        var decodedDeviceDetails = await decodeAndValidateDeviceInfo(
          response.data
        );
        addDeviceInfos(port, decodedDeviceDetails);
      }
    })
    .catch((error) => {
      //ignore
    });
};

/**
 * decodes and validates the JWT device info response from /deviceinfo api of SBI
 * @param {json Object} deviceInfo JWT response array from /deviceinfo api of SBI
 * @returns {Array<Object>} JWT decoded deviceInfo array
 */
const decodeAndValidateDeviceInfo = async (deviceInfoList) => {
  var deviceDetailList = [];
  for (let i = 0; i < deviceInfoList.length; i++) {
    var decodedDevice = await decodeJWT(deviceInfoList[i].deviceInfo);
    decodedDevice.digitalId = await decodeJWT(decodedDevice.digitalId);

    if (validateDeviceInfo(decodedDevice)) {
      deviceDetailList.push(decodedDevice);
    }
  }
  return deviceDetailList;
};

/**
 * validates the device info for device certification level, purpose and status.
 * @param {*} deviceInfo decoded deviceInfo
 * @returns {boolean}
 */
const validateDeviceInfo = (deviceInfo) => {
  // TODO: check if not registered devices has certification or not
  if (
    deviceInfo.certification === certification &&
    deviceInfo.purpose === purpose
  ) {
    return true;
  }
  return false;
};

/**
 * decode the JWT
 * @param {JWT} signed_jwt
 * @returns decoded jwt data
 */
const decodeJWT = async (signed_jwt) => {
  const data = await jose.decodeJwt(signed_jwt);
  return data;
};

export { SbiService };
