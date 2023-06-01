import faceIcon from "../assets/face_sign_in.png";
import fingerIcon from "../assets/fingerprint_sign_in.png";
import irisIcon from "../assets/iris_sign_in.png";

import "./mbd.css";

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
} from "./../utility";

import {
  states,
  DeviceState,
  DeviceStateStatus,
  DEFAULT_PROPS,
} from "./standardConstant";

class MosipBioDevice {
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

  /**
   * The class constructor object
   */
  constructor(container, props) {
    this.container = container;
    this.props = { ...DEFAULT_PROPS, ...props };

    this.sbiService = new SbiService(props?.biometricEnv ?? undefined);

    i18n.changeLanguage(this.props.langCode);
    this.isRtl = i18n.dir(this.props.langCode) === "rtl";

    this.scanDevices();
  }

  renderComponent() {
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

  setPlaceholder(data = null) {
    if (data === null) {
      data = this.modalityDevices.length
        ? "Select your option"
        : "device_not_found_msg";
    }
    const placeholder = this.container.querySelector(
      ".mbd-dropdown__single-value"
    );
    if (placeholder) {
      placeholder.innerHTML = i18n.t(data);
      return placeholder;
    }
    return div(
      {
        className: "mbd-dropdown__single-value",
      },
      i18n.t(data)
    );
  }

  generateLoadingIndicator = (msg) => loadingIndicator(msg, this.isRtl);

  generateErrorStateDiv = (msg) =>
    div(
      {
        className:
          "mbd-p-2 mbd-mt-1 mbd-mb-1 mbd-w-full mbd-text-center mbd-text-sm mbd-rounded-lg mbd-text-red-700 mbd-bg-red-100 ",
        role: "alert",
      },
      i18n.t(msg)
    );

  optionSelection = (deviceId = this.selectedDevice?.deviceId ?? "") => {
    const el = this.container.querySelector(
      "[id^='deviceOption" + deviceId + "']"
    );
    if (el === null || el === undefined) {
      return;
    }
    this.removeSelect();
    const mbdOption = el.closest(".mbd-dropdown__option");
    if (deviceId && deviceId !== this.selectedDevice.deviceId) {
      this.selectedDevice = this.modalityDevices.find(
        (_) => _.deviceId === deviceId
      );
    }
    mbdOption.classList.add("selected");
    this.setPlaceholder(mbdOption.innerHTML);
    this.container
      .querySelector(".mbd-dropdown__container")
      .classList.remove("active");
    if (this.selectedDevice.status !== DeviceStateStatus.Ready) {
      this.generateVerifyButtonDiv(
        i18n.t("invalid_state_msg", {
          deviceName: this.selectedDevice.text,
          deviceState: i18n.t(DeviceState[this.selectedDevice.status].name),
        })
      );
    }
  };

  handleScan = () => this.scanDevices(true);

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
      const optionStyle = {
        ...(this.props.customStyle?.selectBoxStyle?.panelBgColor && {
          "--mbd-dropdown__option_panelbg_normal":
            this.props.customStyle?.selectBoxStyle?.panelBgColor,
        }),
        ...(this.props.customStyle?.selectBoxStyle?.panelBgColorHover && {
          "--mbd-dropdown__option_panelbg_hover":
            this.props.customStyle?.selectBoxStyle?.panelBgColorHover,
        }),
        ...(this.props.customStyle?.selectBoxStyle?.panelBgColorActive && {
          "--mbd-dropdown__option_panelbg_selected":
            this.props.customStyle?.selectBoxStyle?.panelBgColorActive,
        }),
      };
      return arr.map((item) =>
        div(
          {
            id: "deviceOption" + item.deviceId,
            className: "mbd-dropdown__option",
            style: optionStyle,
            onclick: () => this.optionSelection(item.deviceId),
          },
          this.bioSelectOptionLabel(item)
        )
      );
    }
    this.setPlaceholder("device_not_found_msg");
    return div(
      { className: "mbd-dropdown__option disabled" },
      i18n.t("no_options")
    );
  }

  generateDropdownMenuList(optionElement = null) {
    if (optionElement === null) {
      optionElement = this.generateOptionElement(this.modalityDevices);
    }
    const dropdownMenuList = this.container.querySelector(
      ".mbd-dropdown__menu-list"
    );
    if (dropdownMenuList) {
      dropdownMenuList.innerHTML = "";
      if (Array.isArray(optionElement)) {
        appendArray(dropdownMenuList, optionElement);
      } else {
        dropdownMenuList.appendChild(optionElement);
      }
      return dropdownMenuList;
    }
    return div({ className: "mbd-dropdown__menu-list" }, optionElement);
  }

  generateDropdown() {
    const singleValue = this.setPlaceholder();
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
    const valueContainer = div(
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

    const controlStyle = {
      ...(this.props.customStyle?.selectBoxStyle?.borderColor && {
        "--mbd-dropdown__control_bordercolor_normal":
          this.props.customStyle?.selectBoxStyle?.borderColor,
      }),
      ...(this.props.customStyle?.selectBoxStyle?.borderColorHover && {
        "--mbd-dropdown__control_bordercolor_hover":
          this.props.customStyle?.selectBoxStyle?.borderColorHover,
      }),
      ...(this.props.customStyle?.selectBoxStyle?.borderColorActive && {
        "--mbd-dropdown__control_bordercolor_selected":
          this.props.customStyle?.selectBoxStyle?.borderColorActive,
      }),
    };

    const dropdownControl = div(
      {
        className: "mbd-dropdown__control",
        style: controlStyle,
      },
      [valueContainer, indicators]
    );

    const dropdownMenu = div(
      {
        className: "mbd-dropdown__menu",
      },
      this.generateDropdownMenuList()
    );

    return div(
      {
        className:
          "mbd-dropdown__container mbd-block rounded mbd-bg-white mbd-shadow mbd-w-full" +
          (this.isRtl ? " mbd-ml-2" : " mbd-mr-2"),
        name: "modality_device",
        id: "modality_device",
        "aria-label": "Modality Device Select",
      },
      [dropdownControl, dropdownMenu]
    );
  }

  generateVerifyButton() {
    const verifyButtonClass =
      "mbd-cursor-pointer mbd-block mbd-w-full mbd-font-medium mbd-rounded-lg mbd-text-sm mbd-px-5 mbd-py-2 mbd-text-center mbd-border mbd-border-2";

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
            ? " mbd-text-slate-400 mbd-cursor-disable"
            : " mbd-bg-gradient mbd-text-white"),
        style: this.props.disable ? null : buttonStyle,
        onclick: () => this.scanAndVerify(),
        disabled: this.props.disable,
      },
      i18n.t(this.props.buttonLabel)
    );
  }

  generateRefreshButton() {
    const refreshButtonClass =
      "mbd-cursor-pointer mbd-flex mbd-items-center mbd-ml-auto mbd-text-gray-900 mbd-bg-white mbd-shadow border mbd-border-gray-300 mbd-hover:bg-gray-100 mbd-font-medium mbd-rounded-lg mbd-text-lg mbd-px-3 mbd-py-1 mbd-ml-1";
    return button(
      {
        type: "button",
        className: refreshButtonClass,
        onclick: () => this.handleScan(),
      },
      this.props.customStyle?.refreshButtonStyle?.iconUniCode ?? "\u21bb"
    );
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
        i18n.t(`select_a_device`)
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

  generateVerifyButtonDiv(onlyErrorState = null) {
    const verifyButtonData =
      !onlyErrorState && this.errorState === null
        ? this.generateVerifyButton()
        : this.generateErrorStateDiv(
            onlyErrorState ? onlyErrorState : i18n.t(this.errorState)
          );
    const verifyButton = this.container.querySelector(".mbd-verify-button-div");

    if (verifyButton) {
      verifyButton.innerHTML = "";
      verifyButton.appendChild(verifyButtonData);
      return verifyButton;
    }
    return div(
      { className: "mbd-flex mbd-py-2 mbd-verify-button-div" },
      verifyButtonData
    );
  }

  generateMosipBioDeviceComponent() {
    return [this.generateDropdownDiv(), this.generateVerifyButtonDiv()];
  }

  generateStatusMessage = () => {
    let statusMsg = "";
    if (this.status === states.AUTHENTICATING) {
      statusMsg = i18n.t("capture_initiated_msg", {
        modality: i18n.t(this.selectedDevice.type),
        deviceModel: this.selectedDevice.model,
      });
    } else if (this.status === states.LOADING) {
      statusMsg = i18n.t("scanning_devices_msg");
    }
    return statusMsg;
  };

  generateSekeleton = () =>
    div(
      {
        className: "mbd-flex mbd-flex-col mbd-exosekeleton",
        dir: this.isRtl ? "rtl" : "ltr",
      },
      this.status === states.LOADED
        ? this.generateMosipBioDeviceComponent()
        : this.generateLoadingIndicator(this.generateStatusMessage())
    );

  statusChanged(status) {
    this.status = status;
    const exoskeleton = this.container.querySelector(".mbd-exosekeleton");
    if (exoskeleton) {
      exoskeleton.innerHTML = "";
      if (status === states.LOADED) {
        appendArray(exoskeleton, this.generateMosipBioDeviceComponent());
        if (this.selectedDevice) {
          this.optionSelection();
        }
      } else {
        exoskeleton.appendChild(
          this.generateLoadingIndicator(this.generateStatusMessage())
        );
      }
    }
  }

  errorStateChanged(error) {
    this.errorState = error;
    this.generateVerifyButtonDiv();
  }

  populateDropdownOption() {
    this.generateDropdownMenuList();
    this.optionSelection();
  }

  /**
   * to capture the biometric details
   */
  async startCapture() {
    this.errorState = null;
    const selectedDevice = this.selectedDevice;
    if (selectedDevice === null || selectedDevice === undefined) {
      this.errorStateChanged("device_not_found_msg");
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
    } catch (error) {
      this.errorStateChanged("biometric_capture_failed_msg");
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
      this.statusChanged(states.LOADING);
      this.discoverDeviceAsync(this.host);
    } catch (e) {
      this.errorStateChanged("device_disc_failed");
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
        this.errorState = "device_disc_failed";
        this.statusChanged(states.LOADED);
      } else if (
        localStorageService.getDeviceInfos() &&
        Object.keys(localStorageService.getDeviceInfos()).length > 0
      ) {
        this.errorState = null;
        clearInterval(intervalId);
        this.statusChanged(states.LOADED);
        this.refreshDeviceList();
      }
    }, 3000);

    this.timer = intervalId;
  }

  refreshDeviceList() {
    let deviceInfosPortsWise = localStorageService.getDeviceInfos();

    if (!deviceInfosPortsWise) {
      this.modalityDevices = [];
      this.errorStateChanged("device_not_found_msg");
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
      this.errorStateChanged("device_not_found_msg");
      return;
    }

    this.selectedDevice =
      modalityDevices?.find((_) => _.status === DeviceState.READY.value) ??
      modalityDevices[0];

    this.populateDropdownOption();
  }
}

let myDevice = null;

const allowedProperties = [
  "buttonLabel",
  "transactionId",
  "customStyle",
  "langCode",
  "disable",
  "onCapture",
  "onErrored",
];

const init = ({ container, ...args }) => {
  myDevice = new MosipBioDevice(container, { ...args });
  myDevice.renderComponent();
};

const propChange = (props) => {
  let flag = false;
  Object.keys(props).forEach((key) => {
    if (allowedProperties.includes(key)) {
      myDevice.props[key] = props[key];
      flag = true;

      if (key === "langCode" && props[key] !== i18n.language) {
        i18n.changeLanguage(props[key]);
        myDevice.isRtl = i18n.dir(props[key]) === "rtl";
      }
    }
  });
  if (!flag) return;

  myDevice.renderComponent();
  myDevice.optionSelection();
};

export { init, propChange };
