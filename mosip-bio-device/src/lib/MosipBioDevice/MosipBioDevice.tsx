/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useState, useEffect } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { LoadingIndicator } from "../common";
import { localStorageService, SbiService } from "../service";
import {
  DeviceState,
  DeviceStateStatus,
  IBiometricEnv,
  IDeviceDetail,
  IDeviceInfo,
  IMosipBioDeviceProps,
  LoadingStates as states,
  host,
  errorRibbonClass,
  loadingContClass,
  verifyButtonClass,
  scanButtonClass,
  DeviceStateStatusType,
} from "../models";

import faceIcon from "../assets/face_sign_in.png";
import fingerIcon from "../assets/fingerprint_sign_in.png";
import irisIcon from "../assets/iris_sign_in.png";

import "./MosipBioDevice.scss";

const modalityIconPath: { [name: string]: string } = {
  Face: faceIcon,
  Finger: fingerIcon,
  Iris: irisIcon,
};

const MosipBioDevice = (props: IMosipBioDeviceProps) => {
  const { t, i18n } = useTranslation();

  const sbiService = new SbiService(props.biometricEnv);

  const { getDeviceInfos } = {
    ...localStorageService,
  };
  const [modalityDevices, setModalityDevices] = useState<IDeviceDetail[]>();

  const [selectedDevice, setSelectedDevice] = useState<IDeviceDetail>();

  const [status, setStatus] = useState({
    state: states.LOADED,
    msg: "",
  });

  const [timer, setTimer] = useState<number | null | any>(null);

  const [errorState, setErrorState] = useState<string | null>(null);

  const [isRtl, setIsRtl] = useState<boolean>(
    i18n.dir(i18n.language) === "rtl"
  );

  useEffect(() => {
    handleLanguageChange();
    scanDevices(false);
  }, [props.langCode]);

  const handleLanguageChange = () => {
    if (props.langCode && i18n.language != props.langCode) {
      setIsRtl(i18n.dir(props.langCode) === "rtl");
      i18n.changeLanguage(props.langCode);
    }
  };

  const scanDevices = (forceScan: boolean) => {
    if (!forceScan && modalityDevices?.length && selectedDevice) {
      return;
    }
    props.onErrored(null);
    setErrorState(null);

    try {
      setStatus({
        state: states.LOADING,
        msg: t("scanning_devices_msg"),
      });

      discoverDevicesAsync(host);
    } catch (error: any) {
      setErrorState(t("device_disc_failed"));
      props.onErrored({
        errorCode: error.message,
        defaultMsg: error.message,
      });
    }
  };

  const discoverDevicesAsync = async (host: string) => {
    if (timer) {
      clearInterval(timer);
    }
    let timePassed = 0;
    let dicoverTimeout = (props.biometricEnv as IBiometricEnv).discTimeout;
    const intervalId = setInterval(async () => {
      timePassed += 2;

      await sbiService.mosipdisc_DiscoverDevicesAsync(host);
      let timeLeft = dicoverTimeout - timePassed;
      if (timeLeft <= 0) {
        clearInterval(intervalId);
        setStatus({ state: states.LOADED, msg: "" });
        setErrorState(t("device_disc_failed"));
        props.onErrored({
          errorCode: "device_not_found_msg",
          defaultMsg: "Device not found",
        });
      } else if (
        localStorageService.getDeviceInfos() &&
        Object.keys(localStorageService.getDeviceInfos()).length > 0
      ) {
        setErrorState(null);
        clearInterval(intervalId);
        setStatus({ state: states.LOADED, msg: "" });
        refreshDeviceList();
      }
    }, 3000);

    setTimer(intervalId);
  };

  const refreshDeviceList = () => {
    let deviceInfosPortsWise = getDeviceInfos();

    if (!deviceInfosPortsWise) {
      setModalityDevices([]);
      setErrorState(t("no_devices_found_msg"));
      props.onErrored({
        errorCode: "no_devices_found_msg",
      });
      return;
    }

    let modalitydevices: any[] = [];

    Object.keys(deviceInfosPortsWise).map((port: any) => {
      let deviceInfos = deviceInfosPortsWise[port];

      deviceInfos?.forEach((deviceInfo: IDeviceInfo) => {
        if (typeof deviceInfo.digitalId !== "string") {
          let deviceDetail: IDeviceDetail = {
            port: port,
            specVersion: deviceInfo?.specVersion[0],
            type: deviceInfo?.digitalId.type,
            deviceId: deviceInfo?.deviceId,
            model: deviceInfo?.digitalId.model,
            serialNo: deviceInfo?.digitalId.serialNo,
            text:
              deviceInfo?.digitalId.make + "-" + deviceInfo?.digitalId.model,
            value: deviceInfo?.digitalId.serialNo,
            icon: modalityIconPath[deviceInfo?.digitalId.type],
            status: DeviceStateStatus[deviceInfo?.deviceStatus],
          };
          modalitydevices.push(deviceDetail);
        }
      });
    });

    setModalityDevices(modalitydevices);

    if (modalitydevices.length === 0) {
      setErrorState(t("no_devices_found_msg"));
      props.onErrored({
        errorCode: "no_devices_found_msg",
      });
      return;
    }

    let selectedDevice =
      modalitydevices?.find((_) => _.status === DeviceState.READY.value) ??
      modalitydevices[0];

    setSelectedDevice(selectedDevice);
  };

  const handleDeviceChange = (device: any) => setSelectedDevice(device);

  const handleScan = () => scanDevices(true);

  const scanAndVerify = () => startCapture();

  const startCapture = async () => {
    props.onErrored(null);
    setErrorState(null);
    if (selectedDevice === null || selectedDevice === undefined) {
      setErrorState(t("device_not_found_msg"));
      props.onErrored({
        errorCode: "device_not_found_msg",
      });
      return;
    }

    let biometricResponse = null;

    try {
      setStatus({
        state: states.AUTHENTICATING,
        msg: t("capture_initiated_msg", {
          modality: t(selectedDevice.type),
          deviceModel: selectedDevice.model,
        }),
      });

      biometricResponse = await sbiService.capture_Auth(
        host,
        selectedDevice.port,
        props.transactionId,
        selectedDevice.specVersion,
        selectedDevice.type,
        selectedDevice.deviceId
      );

      setStatus({ state: states.LOADED, msg: "" });
    } catch (error: any) {
      setErrorState(t("biometric_capture_failed_msg"));
      props.onErrored({
        errorCode: error.message,
        defaultMsg: error.message,
      });
      return;
    }

    props.onCapture(biometricResponse);
  };

  const bioSelectOptionLabel = (e: IDeviceDetail) => (
    <div className="mdb-flex mdb-items-center h-7">
      <img className="w-7" src={e.icon} />
      <span className={"mdb-text-xs" + (isRtl ? " mdb-mr-2" : " mdb-ml-2")}>
        {e.text}
      </span>
      <span
        className={
          DeviceState[e.status].class +
          (isRtl ? " mdb-mr-auto" : " mdb-ml-auto")
        }
      ></span>
    </div>
  );

  const errorStateDiv = (eMsg: string) => (
    <div className={errorRibbonClass} role="alert">
      {eMsg}
    </div>
  );

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="mdb-flex mdb-flex-col">
      <>
        {(status.state === states.LOADING ||
          status.state === states.AUTHENTICATING) && (
          <div className={loadingContClass}>
            <div className="mdb-flex mdb-items-center">
              <LoadingIndicator size="medium" message={status.msg} />
            </div>
          </div>
        )}
        {status.state === states.LOADED && (
          <>
            <div className="mdb-flex mdb-flex-col mdb-justify-center mdb-w-full mdb-mb-4">
              <label
                htmlFor="modality_device"
                className="block mb-2 text-xs font-medium text-gray-900 text-opacity-70"
              >
                {t("select_a_device")}
              </label>
              <div className="mdb-flex mdb-items-stretch">
                <Select
                  name="modality_device"
                  id="modality_device"
                  aria-label="Modality Device Select"
                  className={
                    "mdb-block rounded mdb-bg-white mdb-shadow mdb-w-full" +
                    (isRtl ? " mdb-ml-2" : " mdb-mr-2")
                  }
                  value={selectedDevice}
                  options={modalityDevices}
                  onChange={handleDeviceChange}
                  formatOptionLabel={(e: any) => bioSelectOptionLabel(e)}
                />
                <button
                  type="button"
                  className={scanButtonClass}
                  onClick={handleScan}
                >
                  &#x21bb;
                </button>
              </div>
            </div>
            <div className="mdb-flex mdb-py-2">
              {!errorState && (
                <>
                  {selectedDevice &&
                    selectedDevice.status == DeviceStateStatus.Ready && (
                      <button
                        type="button"
                        value="button"
                        onClick={scanAndVerify}
                        className={
                          verifyButtonClass +
                          (props.disable
                            ? " mdb-text-slate-400"
                            : " mdb-bg-gradient mdb-text-white")
                        }
                        disabled={props.disable}
                      >
                        {t(props.buttonName)}
                      </button>
                    )}
                  {selectedDevice &&
                    selectedDevice.status != DeviceStateStatus.Ready &&
                    errorStateDiv(
                      t("invalid_state_msg", {
                        deviceName: selectedDevice.text,
                        deviceState: t(
                          DeviceState[
                            selectedDevice.status as DeviceStateStatusType
                          ].name
                        ),
                      })
                    )}
                </>
              )}
              {errorState && errorStateDiv(errorState)}
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default MosipBioDevice;
