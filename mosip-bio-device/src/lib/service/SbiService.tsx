import axios from "axios";
import { localStorageService } from "./";
import * as jose from "jose";
import { BioType, IBiometricEnv, IDeviceInfo } from "../models";

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

const deviceEndPoint = "/device";
const infoEndPoint = "/info";
const captureEndPoint = "/capture";

const mosip_DiscoverMethod = "MOSIPDISC";
const mosip_DeviceInfoMethod = "MOSIPDINFO";
const mosip_CaptureMethod = "CAPTURE";

class SbiService {
  esignetConfig!: IBiometricEnv;

  constructor(
    esignetConfig: IBiometricEnv = {
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
    }
  ) {
    this.esignetConfig = esignetConfig;
  }

  /**
   * Triggers capture request of SBI for auth capture
   * @param {url} host SBI is hosted on given host
   * @param {int} port port on which SBI is listening to.
   * @param {string} transactionId same as Esignet transactionId
   * @param {string} specVersion supported spec version
   * @param {string} type modality type
   * @param {string} deviceId
   * @returns auth capture response
   */
  capture_Auth = async (
    host: string,
    port: number,
    transactionId: string,
    specVersion: string,
    type: string,
    deviceId: string
  ) => {
    let count = 1;
    let requestedScore = 70;
    let bioSubType: string[] | null = ["UNKNOWN"];
    switch (type) {
      case BioType.FACE:
        count = this.esignetConfig.faceCaptureCount;
        requestedScore = this.esignetConfig.faceCaptureScore;
        bioSubType = null; //For Face: No bioSubType
        break;
      case BioType.FINGER:
        count = this.esignetConfig.fingerCaptureCount;
        requestedScore = this.esignetConfig.fingerCaptureScore;
        bioSubType = this.esignetConfig.fingerBioSubtypes
          .split(",")
          .map((x) => x.trim());
        break;
      case BioType.IRIS:
        count = this.esignetConfig.irisCaptureCount;
        requestedScore = this.esignetConfig.irisCaptureScore;
        bioSubType = this.esignetConfig.irisBioSubtypes
          .split(",")
          .map((x) => x.trim());
        break;
    }

    let request = {
      env: this.esignetConfig.env,
      purpose,
      specVersion,
      timeout: this.esignetConfig.captureTimeout * 1000,
      captureTime: new Date().toISOString(),
      domainUri: this.esignetConfig.domainUri,
      transactionId,
      bio: [
        {
          type, //modality
          count, // from configuration
          bioSubType,
          requestedScore, // from configuration
          deviceId, // from discovery
          deviceSubId: 0, //Set as 0, not required for Auth capture.
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
      timeout: this.esignetConfig.captureTimeout * 1000,
    });

    return response?.data;
  };

  /**
   * Triggers MOSIPDISC request on multiple port simultaneously.
   * @param {url} host SBI is hosted on given host
   * @returns MOSIPDISC requests for the given host and the port ranging between fromPort and tillPort
   */
  mosipdisc_DiscoverDevicesAsync = async (host: string) => {
    clearDiscoveredDevices();
    clearDeviceInfos();

    let [fromPort, tillPort] = this.esignetConfig?.portRange
      ?.split("-")
      ?.map((x) => Number(x.trim()));

    if (
      isNaN(fromPort) ||
      isNaN(tillPort) ||
      !(fromPort > 0) ||
      !(tillPort > 0) ||
      !(fromPort <= tillPort)
    ) {
      // default port
      [fromPort, tillPort] = [4501, 4510];
    }

    let discoverRequestList = [];
    for (let i = fromPort; i <= tillPort; i++) {
      discoverRequestList.push(
        discoverRequestBuilder(
          host,
          i,
          this.esignetConfig.discTimeout,
          this.esignetConfig.dinfoTimeout
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
  host: string,
  port: number,
  discTimeout: number,
  dinfoTimeout: number
) => {
  let endpoint = host + ":" + port + deviceEndPoint;

  let request = {
    type: "Biometric Device",
  };

  return axios({
    method: mosip_DiscoverMethod,
    url: endpoint,
    data: request,
    timeout: discTimeout * 1000,
  })
    .then(async (response: any) => {
      if (response?.data !== null) {
        addDiscoveredDevices(port, response.data);
        await mosipdinfo_DeviceInfo(host, port, dinfoTimeout);
      }
    })
    .catch((error: any) => {
      //ignore
    });
};

/**
 * MOSIPDINFO API call for fetch deviceinfo from SBI on the specifed host and port
 * On success response, the device infos are decoded, validated and cached.
 * @param {url} host SBI is hosted on given host
 * @param {int} port port on which SBI is listening to.
 */
const mosipdinfo_DeviceInfo = async (
  host: string,
  port: number,
  dinfoTimeout: number
) => {
  let endpoint = host + ":" + port + infoEndPoint;

  await axios({
    method: mosip_DeviceInfoMethod,
    url: endpoint,
    timeout: dinfoTimeout * 1000,
  })
    .then(async (response: any) => {
      if (response?.data !== null) {
        var decodedDeviceDetails = await decodeAndValidateDeviceInfo(
          response.data
        );
        addDeviceInfos(port, decodedDeviceDetails);
      }
    })
    .catch((error: any) => {
      //ignore
    });
};

/**
 * decodes and validates the JWT device info response from /deviceinfo api of SBI
 * @param {json Object} deviceInfo JWT response array from /deviceinfo api of SBI
 * @returns {Array<Object>} JWT decoded deviceInfo array
 */
const decodeAndValidateDeviceInfo = async (
  deviceInfoList: any[]
): Promise<IDeviceInfo[]> => {
  var deviceDetailList: any[] = [];
  for (let i = 0; i < deviceInfoList.length; i++) {
    var decodedDevice = await decodeJWT(deviceInfoList[i].deviceInfo);
    decodedDevice.digitalId = await decodeJWT(
      decodedDevice.digitalId as string
    );

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
const validateDeviceInfo = (deviceInfo: IDeviceInfo | any): boolean => {
  if (
    deviceInfo.certification === certification &&
    deviceInfo.purpose === purpose &&
    deviceInfo.deviceStatus === DeviceStatusReady
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
const decodeJWT = async (signed_jwt: string) => {
  const data = await jose.decodeJwt(signed_jwt);
  return data;
};

export { SbiService };
