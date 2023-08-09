import faceIcon from "../assets/face_sign_in.png";
import fingerIcon from "../assets/fingerprint_sign_in.png";
import irisIcon from "../assets/iris_sign_in.png";
import langDetail from "../assets/locales/default.json";

import "./sbd.css";

import {
  i18n,
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
} from "../utility";

import {
  states,
  DeviceState,
  DeviceStateStatus,
  DEFAULT_PROPS,
  ErrorCode,
} from "./standardConstant";

class SecureBiometricInterface {
  modalityIconPath = {
    Face: faceIcon,
    Finger: fingerIcon,
    Iris: irisIcon,
  };
  status = "";
  timer = "";
  errorState = null;
  modalityDevices = [];
  selectedDevice = null;
  host = "http://127.0.0.1";
  discoveryCancellationFlag = true;
  buffertTime = 4000; // 4 seconds
  defaultDiscTimeout = 15;

  /**
   * The class constructor object
   */
  constructor(container, props) {
    if (!container) {
      document.body.appendChild(
        div({ id: "secure-biometric-interface-integration" })
      );
      container = document.querySelector(
        "#secure-biometric-interface-integration"
      );
    }
    this.container = container;
    this.props = { ...DEFAULT_PROPS, ...props, buttonLabel: props.buttonLabel || DEFAULT_PROPS.buttonLabel};

    this.sbiService = new SbiService(props?.sbiEnv ?? undefined);

    i18n.changeLanguage(this.props.langCode);
    this.isRtl = langDetail.rtlLanguages.includes(this.props.langCode);

    this.scanDevices();
  }

  /**
   * Render the dropdown component and add it to the container
   */
  renderComponent() {
    this.container.replaceChildren(this.generateSekeleton());
  }

  /**
   * Open/Close the dropdown
   */
  selectBtnActive = () => {
    if (this.container.querySelectorAll(".sbd-dropdown__option")?.length) {
      this.container
        .querySelector(".sbd-dropdown__container")
        .classList.toggle("active");
    }
  };

  /**
   * Remove  the selected option
   */
  removeSelect = () => {
    const rEl = this.container.querySelector(".sbd-dropdown__option.selected");
    if (rEl) {
      rEl.classList.remove("selected");
    }
  };

  /**
   * Setting placeholder for the dropdown
   * @param {string | null} data string to be set as placeholder
   * @returns HTMLElement placeholder element
   */
  setPlaceholder(data = null) {
    if (data === null) {
      data = this.modalityDevices.length ? "Select your option" : "no_options";
    }
    const placeholder = this.container.querySelector(
      ".sbd-dropdown__single-value"
    );
    if (placeholder) {
      placeholder.innerHTML = i18n.t(data);
      return placeholder;
    }
    return div(
      {
        className: "sbd-dropdown__single-value",
      },
      i18n.t(data)
    );
  }

  /**
   * Calling loading indicator
   * @returns HTMLElement loading indicator with cancel button
   */
  generateLoadingIndicator = () => {
    const elemArray = [
      loadingIndicator(this.generateStatusMessage(), this.isRtl),
    ];
    if (this.status === states.DISCOVERING) {
      elemArray.push(
        div(
          {
            className: "sbd-mt-2",
          },
          button(
            {
              className:
                "sbd-cursor-pointer sbd-block sbd-w-full sbd-font-medium sbd-rounded-lg sbd-text-sm sbd-px-5 sbd-py-2 sbd-text-center sbd-border-2 sbd-border-gray sbd-bg-white sbd-hover:bg-gray-100 sbd-text-gray-900",
              onclick: () => this.cancelLoadingIndicator(),
            },
            i18n.t("cancel")
          )
        )
      );
    }
    return div({}, elemArray);
  };

  /**
   * Generate error state div
   * @param {string} msg error message to be shown
   * @returns HTMLElement error message div
   */
  generateErrorStateDiv = (msg, fullWidth = true) =>
    div(
      {
        className:
          (fullWidth ? "sbd-w-full " : "") +
          "sbd-p-2 sbd-mt-1 sbd-mb-2 sbd-text-center sbd-text-sm sbd-rounded-lg sbd-text-red-700 sbd-bg-red-100 ",
        role: "alert",
      },
      i18n.t(msg)
    );

  /**
   * Select the option from the dropdown by deviceId
   * @param {string} [deviceId] deviceId of the device to be selected, default is the current selected device
   */
  optionSelection = (deviceId = this.selectedDevice?.deviceId ?? "") => {
    const el = this.container.querySelector(
      "[id^='deviceOption" + deviceId + "']"
    );
    if (el === null || el === undefined) {
      return;
    }
    this.removeSelect();
    const sbdOption = el.closest(".sbd-dropdown__option");
    if (deviceId && deviceId !== this.selectedDevice.deviceId) {
      this.selectedDevice = this.modalityDevices.find(
        (_) => _.deviceId === deviceId
      );
    }
    sbdOption.classList.add("selected");
    this.setPlaceholder(sbdOption.innerHTML);
    this.container
      .querySelector(".sbd-dropdown__container")
      .classList.remove("active");
    if (this.selectedDevice.status !== DeviceStateStatus.Ready) {
      this.generateVerifyButtonDiv(
        i18n.t("invalid_state_msg", {
          deviceName: this.selectedDevice.text,
          deviceState: i18n.t(this.selectedDevice.status),
        })
      );
    }
  };

  /**
   * Call scanDevices method with true as a param
   */
  handleScan = () => this.scanDevices(true);

  /**
   * Call startCapture method
   */
  scanAndVerify = () => this.startCapture();

  /**
   * Array of option elements div
   * @param {json Object} e deviceInfo object
   * @returns HTMLElement option elements
   */
  bioSelectOptionLabel = (e) =>
    div(
      {
        className: "sbd-flex sbd-items-center h-7",
      },
      [
        img({
          className: "w-7",
          src: e.icon,
          alt: e.text,
        }),
        span(
          {
            className: "sbd-text-xs" + (this.isRtl ? " sbd-mr-2" : " sbd-ml-2"),
          },
          e.text
        ),
        span({
          className:
            DeviceState[e.status].class +
            (this.isRtl ? " sbd-mr-auto sbd-ml-2" : " sbd-ml-auto sbd-mr-2"),
        }),
      ]
    );

  /**
   * Generate the dropdown options div
   * @param {Array<Object>} arr array of deviceInfo objects
   * @returns HTMLElement array of dropdown options div
   */
  generateOptionElement(arr) {
    if (arr?.length) {
      const optionStyle = {
        ...(this.props.customStyle?.selectBoxStyle?.panelBgColor && {
          "--sbd-dropdown__option_panelbg_normal":
            this.props.customStyle?.selectBoxStyle?.panelBgColor,
        }),
        ...(this.props.customStyle?.selectBoxStyle?.panelBgColorHover && {
          "--sbd-dropdown__option_panelbg_hover":
            this.props.customStyle?.selectBoxStyle?.panelBgColorHover,
        }),
        ...(this.props.customStyle?.selectBoxStyle?.panelBgColorActive && {
          "--sbd-dropdown__option_panelbg_selected":
            this.props.customStyle?.selectBoxStyle?.panelBgColorActive,
        }),
      };
      return arr.map((item) =>
        div(
          {
            id: "deviceOption" + item.deviceId,
            className: "sbd-dropdown__option",
            style: optionStyle,
            onclick: () => this.optionSelection(item.deviceId),
          },
          this.bioSelectOptionLabel(item)
        )
      );
    }
    this.setPlaceholder("device_not_found_msg");
    return null;
  }

  /**
   * Generate the dropdown menu list (a div which contain all dropdown option)
   * @returns HTMLElement dropdown menu list container
   */
  generateDropdownMenuList() {
    return div({ className: "sbd-dropdown__menu-list" }, this.generateOptionElement(this.modalityDevices));
  }

  /**
   * Generate the dropdown menu container
   * @returns HTMLElement dropdown menu container
   */
  generateDropdown() {
    const singleValue = this.setPlaceholder();
    const inputContainer = div(
      {
        className: "sbd-dropdown__input-container",
        "data-value": "",
      },
      input({
        className: "sbd-dropdown__input",
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
    const valueContainer = div(
      {
        className: "sbd-dropdown__value-container",
      },
      singleValue,
      inputContainer
    );

    const indicators = div(
      {
        className: "sbd-dropdown__indicators",
        onclick: () => this.selectBtnActive(),
      },
      span({ className: "sbd-dropdown__indicator-separator" }),
      div(
        {
          className: "sbd-dropdown__indicator-container",
          "aria-hidden": "true",
        },
        svg(
          {
            className: "sbd-dropdown__indicator-svg",
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

    const controlStyle = {
      ...(this.props.customStyle?.selectBoxStyle?.borderColor && {
        "--sbd-dropdown__control_bordercolor_normal":
          this.props.customStyle?.selectBoxStyle?.borderColor,
      }),
      ...(this.props.customStyle?.selectBoxStyle?.borderColorHover && {
        "--sbd-dropdown__control_bordercolor_hover":
          this.props.customStyle?.selectBoxStyle?.borderColorHover,
      }),
      ...(this.props.customStyle?.selectBoxStyle?.borderColorActive && {
        "--sbd-dropdown__control_bordercolor_selected":
          this.props.customStyle?.selectBoxStyle?.borderColorActive,
      }),
    };

    const dropdownControl = div(
      {
        className: "sbd-dropdown__control",
        style: controlStyle,
      },
      [valueContainer, indicators]
    );

    const dropdownMenu = div(
      {
        className: "sbd-dropdown__menu",
      },
      this.generateDropdownMenuList()
    );

    return div(
      {
        className:
          "sbd-dropdown__container sbd-block rounded sbd-bg-white sbd-shadow sbd-w-full" +
          (this.isRtl ? " sbd-ml-2" : " sbd-mr-2"),
        name: "modality_device",
        id: "modality_device",
        "aria-label": "Modality Device Select",
      },
      [dropdownControl, dropdownMenu]
    );
  }

  /**
   * Generate Verify button
   * @returns HTMLElement verify button
   */
  generateVerifyButton() {
    const verifyButtonClass =
      "sbd-cursor-pointer sbd-block sbd-w-full sbd-font-medium sbd-rounded-lg sbd-text-sm sbd-px-5 sbd-py-2 sbd-text-center sbd-border sbd-border-2";

    const buttonStyle = {
      ...(this.props.customStyle?.verifyButtonStyle?.background && {
        background: this.props.customStyle?.verifyButtonStyle?.background,
      }),
      ...(this.props.customStyle?.verifyButtonStyle?.color && {
        color: this.props.customStyle?.verifyButtonStyle?.color,
      }),
    };
    return button(
      {
        className:
          verifyButtonClass +
          (this.props.disable
            ? " sbd-text-slate-400 sbd-cursor-disable"
            : " sbd-bg-gradient sbd-text-white"),
        style: this.props.disable ? null : buttonStyle,
        onclick: () => this.scanAndVerify(),
        disabled: this.props.disable,
      },
      i18n.t(this.props.buttonLabel)
    );
  }

  /**
   * Generate Refresh button
   * @returns HTMLElement refresh button
   */
  generateRefreshButton() {
    const refreshButtonClass =
      "sbd-cursor-pointer sbd-flex sbd-items-center sbd-ml-auto sbd-text-gray-900 sbd-bg-white sbd-shadow border sbd-border-gray-300 sbd-hover:bg-gray-100 sbd-font-medium sbd-rounded-lg sbd-text-lg sbd-px-3 sbd-py-1 sbd-ml-1";
    return button(
      {
        type: "button",
        className: refreshButtonClass,
        onclick: () => this.handleScan(),
      },
      this.props.customStyle?.refreshButtonStyle?.iconUniCode ?? "\u21bb"
    );
  }

  /**
   * Generate whole dropdown div containing label, dropdown, verify and refresh button
   * @returns HTMLElement conatining label, dropdown, verify and refresh button
   */
  generateDropdownDiv() {
    return div(
      {
        className:
          "sbd-flex sbd-flex-col sbd-justify-center sbd-w-full sbd-mb-4",
      },
      label(
        {
          htmlFor: "modality_device",
          className:
            "block mb-2 text-xs font-medium text-gray-900 text-opacity-70",
        },
        i18n.t(`select_a_device`)
      ),
      div(
        {
          className: "sbd-flex sbd-items-stretch",
        },
        this.generateDropdown(),
        this.generateRefreshButton()
      )
    );
  }

  /**
   * Generate Verify Button/Error state div according to the error state
   * @param {json Object} [onlyErrorState=null] an error object with errorCode and errorMessage
   * @returns HTMLElement containing verify button or error state div according to the error state
   */
  generateVerifyButtonDiv(onlyErrorState = null) {
    const elemArray = [];
    if (onlyErrorState || this.errorState !== null) {
      elemArray.push(
        this.generateErrorStateDiv(
          onlyErrorState ??
            (i18n.exists(this.errorState.errorCode)
              ? i18n.t(this.errorState.errorCode)
              : this.errorState.defaultMsg),
          false
        )
      );
    }
    if (this.modalityDevices.length > 0) {
      elemArray.push(this.generateVerifyButton());
    }
    const verifyButtonData = div(
      { className: "sbd-flex sbd-flex-col sbd-w-full" },
      elemArray
    );
    const verifyButton = this.container.querySelector(".sbd-verify-button-div");

    if (verifyButton) {
      verifyButton.innerHTML = "";
      verifyButton.appendChild(verifyButtonData);
      return verifyButton;
    }
    return div(
      { className: "sbd-flex sbd-py-2 sbd-verify-button-div" },
      verifyButtonData
    );
  }

  /**
   * Generate dropdown div & verify button div
   * @returns HTMLElement containing the whole secure biometric device component
   */
  generateSecureBiometricInterfaceComponent() {
    return [this.generateDropdownDiv(), this.generateVerifyButtonDiv()];
  }

  /**
   * Generate status message according to the status
   * @returns status message according to the status
   */
  generateStatusMessage = () => {
    let statusMsg = "";
    if (this.status === states.AUTHENTICATING) {
      statusMsg = i18n.t("capture_initiated_msg", {
        modality: i18n.t(this.selectedDevice.type),
        deviceModel: this.selectedDevice.model,
      });
    } else if (this.status === states.DISCOVERING) {
      statusMsg = i18n.t("scanning_devices_msg");
    }
    return statusMsg;
  };

  /**
   * Generate the component or loading indicator
   * @returns HTMLElement having dropdown component or loading indicator
   */
  generateSekeleton = () =>
    div(
      {
        className: "sbd-flex sbd-flex-col sbd-exosekeleton",
        dir: this.isRtl ? "rtl" : "ltr",
      },
      this.status === states.LOADED
        ? this.generateSecureBiometricInterfaceComponent()
        : this.generateLoadingIndicator()
    );

  /**
   * Rerender the component according to status or show loading indicator
   * @param {string} status current status of the component
   */
  statusChanged(status) {
    this.status = status;
    const exoskeleton = this.container.querySelector(".sbd-exosekeleton");
    if (exoskeleton) {
      exoskeleton.innerHTML = "";
      if (status === states.LOADED) {
        appendArray(
          exoskeleton,
          this.generateSecureBiometricInterfaceComponent()
        );
        if (this.selectedDevice) {
          this.optionSelection();
        }
      } else {
        exoskeleton.appendChild(this.generateLoadingIndicator());
      }
    }
  }

  /**
   * Send error callback to the parent component
   * @param {json Object} error an error object with errorCode and errorMessage
   */
  sendErrorMsg(error) {
    if (this.props.onErrored && typeof this.props.onErrored === "function") {
      this.props.onErrored(error);
    }
  }

  /**
   * Cancel loading indicator
   */
  cancelLoadingIndicator() {
    this.discoveryCancellationFlag = true;
    this.errorStateChanged(
      {
        errorCode: ErrorCode.DEVICE_NOT_FOUND,
        defaultMsg: "Device not found",
      },
      false
    );
    this.statusChanged(states.LOADED);
  }

  /**
   * Change error state and rerender the verify button div if render is true
   * @param {json Object} error an error object with errorCode and errorMessage
   * @param {boolean} [render=true] if true it will render, otherwise it will not render
   */
  errorStateChanged(error, render = true) {
    this.errorState = error;
    if (error !== null) this.sendErrorMsg(error);
    if (error === null || !render) return;
    this.generateVerifyButtonDiv();
  }

  /**
   * Populate dropdown option according to the current device list
   */
  populateDropdownOption() {
    this.generateDropdownMenuList();
    this.optionSelection();
  }

  /**
   * Start capturing the biometric detail & send the response to the parent component if success
   * if error occur it will call errorStateChanged
   */
  async startCapture() {
    this.errorStateChanged(null);
    const selectedDevice = this.selectedDevice;
    if (selectedDevice === null || selectedDevice === undefined) {
      this.errorStateChanged({
        errorCode: ErrorCode.DEVICE_NOT_FOUND,
        defaultMsg: "Device not found",
      });
      return;
    }

    let biometricResponse = null;

    try {
      this.statusChanged(states.AUTHENTICATING);
      biometricResponse = await this.sbiService.capture_Auth(
        this.host,
        selectedDevice.port,
        this.props.transactionId,
        selectedDevice.specVersion,
        selectedDevice.type,
        selectedDevice.deviceId
      );
      this.statusChanged(states.LOADED);
      // checking if the response has error or not

      if (biometricResponse?.biometrics[0]?.error?.errorCode !== "0") {
        this.errorStateChanged({
          errorCode: biometricResponse.biometrics[0].error.errorCode,
          defaultMsg: biometricResponse.biometrics[0].error.errorInfo,
        });
        return;
      }
    } catch (error) {
      this.statusChanged(states.LOADED);
      this.errorStateChanged({
        errorCode: ErrorCode.BIOMETRIC_CAPTURE_FAILED,
        defaultMsg: "Biometric capture failed",
      });
      return;
    }

    this.props.onCapture(biometricResponse);
  }

  /**
   * Start scanning the device by calling dicoverDeviceAsync method, if error occur it will call errorStateChanged
   * @param {boolean} [forceScan=false] if true it will force scan the device, otherwise it will return previously scanned data
   */
  scanDevices(forceScan = false) {
    if (!forceScan && this.modalityDevices?.length && this.selectedDevice) {
      return;
    }

    this.errorStateChanged(null);
    this.discoveryCancellationFlag = false;
    try {
      this.statusChanged(states.DISCOVERING);
      this.discoverDeviceAsync(this.host);
    } catch (error) {
      this.errorStateChanged({
        errorCode: ErrorCode.DEVICE_DISCOVERY_FAILED,
        defaultMsg: "Device discovery failed",
      });
    }
  }

  /**
   * Discover the device through api and store it in modalityDevices, if error occur it will call errorStateChanged
   * @param {url} host host url from where it find the device
   */
  async discoverDeviceAsync(host) {
    this.modalityDevices = [];
    this.selectedDevice = null;

    const discTimeout = this.props.sbiEnv.discTimeout || this.defaultDiscTimeout;

    let discoverDeviceTill = new Date().setSeconds(
      new Date().getSeconds() + discTimeout
    );

    // discoverFlag for cancel ongoing api request call
    while (!this.discoveryCancellationFlag && discoverDeviceTill > new Date()) {
      await this.sbiService.mosipdisc_DiscoverDevicesAsync(host);
      if (
        localStorageService.getDeviceInfos() &&
        Object.keys(localStorageService.getDeviceInfos()).length > 0
      ) {
        break;
      }
      // delay added before the next fetch device api call
      await new Promise((r) => setTimeout(r, this.buffertTime));
    }

    this.discoveryCancellationFlag = false;
    if (
      localStorageService.getDeviceInfos() ||
      Object.keys(localStorageService.getDeviceInfos()).length > 0
    ) {
      this.errorStateChanged(null);
      this.refreshDeviceList();
      this.statusChanged(states.LOADED);
    } else {
      this.errorStateChanged(
        {
          errorCode: ErrorCode.DEVICE_NOT_FOUND,
          defaultMsg: "Device not found",
        },
        false
      );
      this.statusChanged(states.LOADED);
    }
  }

  /**
   * Modify the modality devices data, set selectedDevice and call populateDropdownOption (to populate dropdown option)
   */
  refreshDeviceList() {
    let deviceInfosPortsWise = localStorageService.getDeviceInfos();

    if (!deviceInfosPortsWise) {
      this.modalityDevices = [];
      this.errorStateChanged({
        errorCode: ErrorCode.DEVICE_NOT_FOUND,
        defaultMsg: "No devices found",
      });
      return;
    }

    let modalityDevices = [];

    Object.keys(deviceInfosPortsWise).forEach((port) => {
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
      this.errorStateChanged({
        errorCode: ErrorCode.DEVICE_NOT_FOUND,
        defaultMsg: "No devices found",
      });
      return;
    }

    this.selectedDevice =
      modalityDevices?.find((_) => _.status === DeviceState.READY.value) ??
      modalityDevices[0];

    this.populateDropdownOption();
  }
}

let myDevice = null;

/**
 * Allowed custom properties to be set by user/developer
 */
const allowedProperties = [
  "buttonLabel",
  "transactionId",
  "customStyle",
  "langCode",
  "disable",
  "onCapture",
  "onErrored",
];

/**
 * Initialization method, it will create the whole component and attach it with the html tag
 * @param {HTMLElement} param0 container in which the whole component has to be attached
 * @param {json Object} args other arguments containing {buttonLabel, sbiEnv, transactionId, disable, customStyle, langCode, onCapture, onErrored}
 * @returns SecureBiometricInterface object
 */
const init = ({ container, ...args }) => {
  myDevice = new SecureBiometricInterface(container, { ...args });
  myDevice.renderComponent();
  return myDevice.container;
};

/**
 * To change the property of the compoenent, to get the real time hanges
 * @param {json Object} props property of the component for any change {buttonLabel, transactionId, disable, langCode, onCapture, onErrored}
 */
const propChange = (props) => {
  let flag = false;
  Object.keys(props).forEach((key) => {
    if (allowedProperties.includes(key)) {
      myDevice.props[key] = props[key];
      flag = true;

      if (key === "langCode" && props[key] !== i18n.language) {
        i18n.changeLanguage(props[key]);
        myDevice.isRtl = langDetail.rtlLanguages.includes(props[key]);
      }
    }
  });
  if (!flag) return;

  myDevice.renderComponent();
  myDevice.optionSelection();
};

export { init, propChange };
