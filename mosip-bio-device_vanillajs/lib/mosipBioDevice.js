
import faceIcon from "../assets/face_sign_in.png";
import fingerIcon from "../assets/fingerprint_sign_in.png";
import irisIcon from "../assets/iris_sign_in.png";

import "./mbd.min.css";

import {
  loadingIndicator,
  localStorageService,
  SbiService,
  div,
  span,
  button,
  label,
  svg,
  path,
  input,
  img,
  appendArray,
} from "./../utility";

const states = {
  LOADING: "LOADING",
  LOADED: "LOADED",
  ERROR: "ERROR",
  AUTHENTICATING: "AUTHENTICATING",
};

const DeviceStateStatus = {
  Ready: "READY",
  "Not Ready": "NOTREADY",
  Busy: "BUSY",
  "Not Registered": "NOTREGISTERED",
};

const DeviceState = {
  READY: {
    value: "READY",
    name: "Ready",
    class: "ready",
    symbol: "\u25CF",
  },
  NOTREADY: {
    value: "NOTREADY",
    name: "Not Ready",
    class: "not-ready",
    symbol: "\u25CF",
  },
  BUSY: {
    value: "BUSY",
    name: "Busy",
    class: "busy",
    symbol: "\u25CF",
  },
  NOTREGISTERED: {
    value: "NOTREGISTERED",
    name: "Not Registered",
    class: "not-registered",
    symbol: "\u25CE",
  },
};

const DEFAULT_PROPS = {
  buttonLabel: "Scan & Verify",
  disable: false,
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
    portRange: "4501-4600",
    discTimeout: 15,
    dinfoTimeout: 30,
    domainUri: `${window.origin}`,
  },
  customStyle: {
    selectBoxStyle: {
      borderColor: "#cccccc",
      borderColorActive: "#2684ff",
      borderColorHover: "#b3b3b3",
      panelBgColor: "#fff",
      panelBgColorHover: "#deebff",
      panelBgColorActive: "#2684ff",
    },
    refreshButtonStyle: {
      iconUniCode: "\u21bb",
    },
  },
};
class MosipBioDevice {
  /**
   * The class constructor object
   */
  constructor(container, props) {
    this.container = container;
    this.props = { ...DEFAULT_PROPS, ...props };

    this.sbiService = new SbiService(props?.biometricEnv ?? undefined);
    this.modalityIconPath = {
      Face: faceIcon,
      Finger: fingerIcon,
      Iris: irisIcon,
    };
    this.isRtl = false;
    this.status = "";
    this.statusMsg = "";
    this.timer = "";
    this.errorState = null;
    this.modalityDevices = [];
    this.selectedDevice = null;
    this.host = "http://127.0.0.1";

    this.scanDevices();
  }

  start() {
    this.container.replaceChildren(this.generateSekeleton());
  }

  selectBtnActive = () =>
    this.container
      .querySelector(".mbd-dropdown__container")
      .classList.toggle("active");

  removeSelect = () => {
    const rEl = this.container.querySelector(".mbd-dropdown__option.selected");
    if (rEl) {
      rEl.classList.remove("selected");
    }
  };

  setPlaceholder(data) {
    if (this.container.querySelector(".mbd-dropdown__single-value")) {
      this.container.querySelector(".mbd-dropdown__single-value").innerHTML =
        data;
    }
  }

  optionSelection = (el) => {
    this.removeSelect();
    const mbdOption = el.closest(".mbd-dropdown__option");
    if (mbdOption.dataset.deviceid !== this.selectedDevice.deviceId) {
      this.selectedDevice = this.modalityDevices.find(
        (_) => _.deviceId === mbdOption.dataset.deviceid
      );
    }
    mbdOption.classList.add("selected");
    this.setPlaceholder(mbdOption.innerHTML);
    this.container
      .querySelector(".mbd-dropdown__container")
      .classList.remove("active");
    if (this.selectedDevice.status !== DeviceStateStatus.Ready) {
      this.verifyButton.innerHTML = "";
      this.verifyButton.appendChild(
        this.errorStateDiv(
          `${this.selectedDevice.text} device is ${
            DeviceState[this.selectedDevice.status].name
          }`
        )
      );
    }
  };

  handleScan = () => {
    this.scanDevices(true);
  };

  scanAndVerify = () => this.startCapture();

  bioSelectOptionLabel = (e) =>
    div(
      {
        className: "mbd-flex mbd-items-center h-7",
      },
      [
        img({
          className: "w-7",
          src: e.icon,
          alt: e.text,
        }),
        span(
          {
            className: "mbd-text-xs" + (this.isRtl ? " mbd-mr-2" : " mbd-ml-2"),
          },
          e.text
        ),
        span({
          className:
            DeviceState[e.status].class +
            (this.isRtl ? " mbd-mr-auto mbd-ml-2" : " mbd-ml-auto mbd-mr-2"),
        }),
      ]
    );

  generateOptionElement(arr) {
    if (arr?.length) {
      return arr.map((item) =>
        div(
          {
            id: "deviceOption" + item.deviceId,
            "data-deviceid": item.deviceId,
            className: "mbd-dropdown__option",
            onclick: (e) => this.optionSelection(e.target),
          },
          this.bioSelectOptionLabel(item)
        )
      );
    }
    this.setPlaceholder("Device Not Found");
    return div({ className: "mbd-dropdown__option disabled" }, "No Options");
  }

  generateDropdown() {
    const optionElement = this.generateOptionElement(this.modalityDevices);

    const singleValue = div(
      {
        className: "mbd-dropdown__single-value",
      },
      this.modalityDevices.length ? "Select your option" : "Device Not Found"
    );
    const inputContainer = div(
      {
        className: "mbd-dropdown__input-container",
        "data-value": "",
      },
      input({
        className: "mbd-dropdown__input",
        autocapitalize: "none",
        autocomplete: "off",
        autocorrect: "off",
        id: "react-select-5-input",
        spellcheck: "false",
        tabindex: "0",
        type: "text",
        "aria-autocomplete": "list",
        "aria-expanded": "false",
        "aria-haspopup": "true",
        "aria-label": "Modality Device Select",
        role: "combobox",
        value: "",
      })
    );
    const valuContainer = div(
      {
        className: "mbd-dropdown__value-container",
      },
      singleValue,
      inputContainer
    );

    const indicators = div(
      {
        className: "mbd-dropdown__indicators",
        onclick: () => this.selectBtnActive(),
      },
      span({ className: "mbd-dropdown__indicator-separator" }),
      div(
        {
          className: "mbd-dropdown__indicator-container",
          "aria-hidden": "true",
        },
        svg(
          {
            className: "mbd-dropdown__indicator-svg",
            height: "20",
            width: "20",
            viewBox: "0 0 20 20",
            "aria-hidden": "true",
            focusable: "false",
          },
          path({
            d: "M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z",
          })
        )
      )
    );

    const dropdownControl = div(
      {
        className: "mbd-dropdown__control",
      },
      [valuContainer, indicators]
    );

    this.dropdownMenuList = div(
      { className: "mbd-dropdown__menu-list" },
      optionElement
    );

    const dropdownMenu = div(
      {
        className: "mbd-dropdown__menu",
      },
      this.dropdownMenuList
    );

    const dropdownContainer = div(
      {
        className:
          "mbd-dropdown__container mbd-block rounded mbd-bg-white mbd-shadow mbd-w-full mbd-mr-2 ",
        name: "modality_device",
        id: "modality_device",
        "aria-label": "Modality Device Select",
      },
      [dropdownControl, dropdownMenu]
    );

    return dropdownContainer;
  }

  generateVerifyButton() {
    const verifyButtonClass =
      "mbd-cursor-pointer mbd-block mbd-w-full mbd-font-medium mbd-rounded-lg mbd-text-sm mbd-px-5 mbd-py-2 mbd-text-center mbd-border mbd-border-2";

    return button(
      {
        className:
          verifyButtonClass +
          (this.props.disable
            ? " mbd-text-slate-400 mbd-cursor-disable"
            : " mbd-bg-gradient mbd-text-white"),
        onclick: () => this.scanAndVerify(),
        disabled: this.props.disable,
      },
      this.props.buttonLabel
    );
  }

  generateRefreshButton() {
    const refreshButtonClass =
      "mbd-cursor-pointer mbd-flex mbd-items-center mbd-ml-auto mbd-text-gray-900 mbd-bg-white mbd-shadow border mbd-border-gray-300 mbd-hover:bg-gray-100 mbd-font-medium mbd-rounded-lg mbd-text-lg mbd-px-3 mbd-py-1 mbd-ml-1";

    const refreshButton = button(
      {
        type: "button",
        className: refreshButtonClass,
        onclick: () => this.handleScan(),
      },
      "\u21bb"
    );

    return refreshButton;
  }

  generateDropdownDiv() {
    return div(
      {
        className:
          "mbd-flex mbd-flex-col mbd-justify-center mbd-w-full mbd-mb-4",
      },
      label(
        {
          htmlFor: "modality_device",
          className:
            "block mb-2 text-xs font-medium text-gray-900 text-opacity-70",
        },
        "Select a Device"
      ),
      div(
        {
          className: "mbd-flex mbd-items-stretch",
        },
        this.generateDropdown(),
        this.generateRefreshButton()
      )
    );
  }

  generateVerifyButtonDiv() {
    this.verifyButton = div(
      { className: "mbd-flex mbd-py-2" },
      this.errorState === null
        ? this.generateVerifyButton()
        : this.errorStateDiv(this.errorState)
    );

    return this.verifyButton;
  }

  generateMosipBioDeviceComponent() {
    return [this.generateDropdownDiv(), this.generateVerifyButtonDiv()];
  }

  generateSekeleton() {
    this.exoskeleton = div(
      { className: "mbd-flex mbd-flex-col", dir: "ltr" },

      this.status === states.LOADED
        ? this.generateMosipBioDeviceComponent()
        : this.generateLoadingIndicator(this.statusMsg)
    );
    return this.exoskeleton;
  }

  generateLoadingIndicator(msg) {
    return loadingIndicator(msg);
  }

  errorStateDiv(msg) {
    return div(
      {
        className:
          "mbd-p-2 mbd-mt-1 mbd-mb-1 mbd-w-full mbd-text-center mbd-text-sm mbd-rounded-lg mbd-text-red-700 mbd-bg-red-100 ",
        role: "alert",
      },
      msg
    );
  }

  statusChanged({ status, msg }) {
    this.status = status;
    this.statusMsg = msg;
    if (this.exoskeleton) {
      this.exoskeleton.innerHTML = "";
      if (status === states.LOADED) {
        appendArray(this.exoskeleton, this.generateMosipBioDeviceComponent());
        if (this.selectedDevice) {
          this.optionSelection(
            this.container.querySelector(
              "#deviceOption" + this.selectedDevice.deviceId
            )
          );
        }
      } else {
        this.exoskeleton.appendChild(this.generateLoadingIndicator(msg));
      }
    }
  }

  errorStateChanged(error) {
    this.errorState = error;
    this.verifyButton.innerHTML =
      this.errorState === null
        ? this.generateVerifyButton()
        : this.errorStateDiv(this.errorState);
  }

  /**
   * to capture the biometric details
   */
  async startCapture() {
    this.errorState = null;
    const selectedDevice = this.selectedDevice;
    if (selectedDevice === null || selectedDevice === undefined) {
      this.errorStateChanged("Device Not Found");
      return;
    }

    let biometricResponse = null;

    try {
      this.statusChanged({
        status: states.AUTHENTICATING,
        msg: `${selectedDevice.type} capture initiated on ${selectedDevice.model}`,
      });

      biometricResponse = await this.sbiService.capture_Auth(
        this.host,
        selectedDevice.port,
        this.props.transactionId,
        selectedDevice.specVersion,
        selectedDevice.type,
        selectedDevice.deviceId
      );

      this.statusChanged({
        status: states.LOADED,
        msg: "",
      });
    } catch (error) {
      this.errorStateChanged("Biometric Capture Failed");
      return;
    }

    this.props.onCapture(biometricResponse);
  }

  scanDevices(forceScan = false) {
    if (!forceScan && this.modalityDevices?.length && this.selectedDevice) {
      return;
    }

    this.errorState = null;

    try {
      this.statusChanged({
        status: states.LOADING,
        msg: "Scanning Devices. Please Wait...",
      });
      this.discoverDeviceAsync(this.host);
    } catch (e) {
      this.errorState = "Device discovery failed";
      this.errorStateChanged("Device discovery failed");
    }
  }

  async discoverDeviceAsync(host) {
    if (this.timer) {
      clearInterval(this.timer);
    }

    let timePassed = 0;
    let dicoverTimeout = this.props.biometricEnv.discTimeout;

    this.modalityDevices = [];
    this.selectedDevice = null;
    const intervalId = setInterval(async () => {
      timePassed += 2;

      await this.sbiService.mosipdisc_DiscoverDevicesAsync(host);
      let timeLeft = dicoverTimeout - timePassed;
      if (timeLeft <= 0) {
        clearInterval(intervalId);
        this.errorState = "Device discovery failed";
        this.statusChanged({ status: states.LOADED, msg: "" });
      } else if (
        localStorageService.getDeviceInfos() &&
        Object.keys(localStorageService.getDeviceInfos()).length > 0
      ) {
        this.errorState = null;
        clearInterval(intervalId);
        this.statusChanged({ status: states.LOADED, msg: "" });
        this.refreshDeviceList();
      }
    }, 3000);

    this.timer = intervalId;
  }

  refreshDeviceList() {
    let deviceInfosPortsWise = localStorageService.getDeviceInfos();

    if (!deviceInfosPortsWise) {
      this.modalityDevices = [];
      this.errorState = "Device not found";
      this.errorStateChanged("Device not found");
      return;
    }

    let modalityDevices = [];

    Object.keys(deviceInfosPortsWise).map((port) => {
      let deviceInfos = deviceInfosPortsWise[port];

      deviceInfos?.forEach((deviceInfo) => {
        if (typeof deviceInfo.digitalId !== "string") {
          let deviceDetail = {
            port: port,
            specVersion: deviceInfo?.specVersion[0],
            type: deviceInfo?.digitalId.type,
            deviceId: deviceInfo?.deviceId,
            model: deviceInfo?.digitalId.model,
            serialNo: deviceInfo?.digitalId.serialNo,
            text:
              deviceInfo?.digitalId.make + "-" + deviceInfo?.digitalId.model,
            value: deviceInfo?.digitalId.serialNo,
            icon: this.modalityIconPath[deviceInfo?.digitalId.type],
            status: DeviceStateStatus[deviceInfo?.deviceStatus],
          };
          modalityDevices.push(deviceDetail);
        }
      });
    });

    this.modalityDevices = modalityDevices;

    if (modalityDevices.length === 0) {
      this.errorState = "Device not found";
      this.errorStateChanged("Device not found");
      return;
    }

    this.selectedDevice =
      modalityDevices?.find((_) => _.status === DeviceState.READY.value) ??
      modalityDevices[0];

    this.populateDropdownOption();
  }

  populateDropdownOption() {
    this.dropdownMenuList.innerHTML = "";
    appendArray(
      this.dropdownMenuList,
      this.generateOptionElement(this.modalityDevices)
    );
    this.optionSelection(
      this.container.querySelector(
        "#deviceOption" + this.selectedDevice.deviceId
      )
    );
  }
}

const mosipBioDeviceHelper = ({ container, ...args }) => {
  const myDevice = new MosipBioDevice(container, { ...args });
  myDevice.start();
};

export { mosipBioDeviceHelper };
