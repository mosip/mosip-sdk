import {
  // ul,
  // li,
  div,
  span,
  button,
  // i,
  label,
  svg,
  path,
  input,
  img,
} from "./../utility/elements";

import faceIcon from "../assets/face_sign_in.png";
import fingerIcon from "../assets/fingerprint_sign_in.png";
import irisIcon from "../assets/iris_sign_in.png";

import "./../mbd.min.css";
import "./style.css";
import "./select-dropdown.css";

class MosipBioDevice {
  /**
   * The class constructor object
   */
  constructor(container) {
    this.container = container;
    this.isRtl = false;

    this.optionElementAr = [
      { icon: faceIcon, text: "MOSIP-FACE01" },
      { icon: fingerIcon, text: "MOSIP-SINGLE01" },
      { icon: irisIcon, text: "MOSIP-IRIS02" },
    ];
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

  optionSelection = (el) => {
    this.removeSelect();
    const mbdOption = el.closest(".mbd-dropdown__option");
    mbdOption.classList.add("selected");
    this.container.querySelector(".mbd-dropdown__single-value").innerHTML =
      mbdOption.innerHTML;
    this.container
      .querySelector(".mbd-dropdown__container")
      .classList.remove("active");
  };

  handleScan = () => {
    console.log("************** Scan Button Clicked **************");
  };

  scanAndVerify = () => {
    console.log("************** Scan & Verify Button Clicked **************");
  };

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
            "ready" +
            (this.isRtl ? " mbd-mr-auto mbd-ml-2" : " mbd-ml-auto mbd-mr-2"),
        }),
      ]
    );

  selectOptionElement(i) {
    let j = i === null || i === undefined || i < 0 ? 0 : i;
    const allOptions = this.container.querySelectorAll(".mbd-dropdown__option");
    if (allOptions.length > 0) {
      j = allOptions.length > j ? j : 0;
      this.optionSelection(allOptions[j]);
    }
  }

  generateDropdown() {
    const optionElement = this.optionElementAr.map((item) =>
      div(
        {
          className: "mbd-dropdown__option",
          onclick: (e) => this.optionSelection(e.target),
        },
        this.bioSelectOptionLabel(item)
      )
    );

    const singleValue = div(
      {
        className: "mbd-dropdown__single-value",
      },
      "Select your option"
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
            class: "mbd-dropdown__indicator-svg",
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

    const dropdownMenu = div(
      {
        className: "mbd-dropdown__menu",
      },
      div({ className: "mbd-dropdown__menu-list" }, optionElement)
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
      "mbd-cursor-pointer mbd-block mbd-w-full mbd-font-medium mbd-rounded-lg mbd-text-sm mbd-px-5 mbd-py-2 mbd-text-center mbd-border mbd-border-2 mbd-bg-gradient mbd-text-white ";

    const verifyButton = button(
      { className: verifyButtonClass, onclick: () => this.scanAndVerify() },
      "Scan & Verify"
    );
    return verifyButton;
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

  generateSekeleton() {
    return div(
      { className: "mbd-flex mbd-flex-col", dir: "ltr" },

      div(
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
      ),
      div({ className: "mbd-flex mbd-py-2" }, this.generateVerifyButton())
    );
  }
}

const mosipBioDeviceHelper = ({ container, ...args }) => {
  const myDevice = new MosipBioDevice(container);
  myDevice.start();
  myDevice.selectOptionElement(0);
};

export { mosipBioDeviceHelper };
