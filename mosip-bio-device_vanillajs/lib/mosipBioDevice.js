import { ul, li, div, span, button, i, label } from "./../utility/elements";
import "./style.css";

class MosipBioDevice {
  /**
   * The class constructor object
   */
  constructor(container) {
    this.container = container;
    this.optionElementAr = [
      "Github",
      "Instagram",
      "LinkdIn",
      "Twitter",
      "Youtube",
    ];

    this.selectBtnActive = () =>
      document.querySelector(".select-menu").classList.toggle("active");

    this.optionSelection = (item) => {
      document.querySelector(".sBtn-text").innerText = item;
      document.querySelector(".select-menu").classList.remove("active");
    };

    this.handleScan = () => {
      console.log("************** Scan Button Clicked **************");
    };

    this.scanAndVerify = () => {
      console.log("************** Scan & Verify Button Clicked **************");
    };
  }

  start() {
    this.container.replaceChildren(this.generateSekeleton());
  }

  generateDropdown() {
    const optionElement = this.optionElementAr.map((item) =>
      li(
        { className: "option", onclick: () => this.optionSelection(item) },
        span({ className: "option-text" }, item)
      )
    );

    const allOptions = ul({ className: "options" }, optionElement);

    const selectDropdown = div(
      { className: "select-btn", onclick: () => this.selectBtnActive() },
      [
        span({ className: "sBtn-text" }, "Select your option"),
        i({ className: "bx bx-chevron-down" }),
      ]
    );

    const selectMenu = div(
      {
        className:
          "select-menu mdb-block rounded mdb-bg-white mdb-shadow mdb-w-full mdb-mr-2 ",
        name: "modality_device",
        id: "modality_device",
        "aria-label": "Modality Device Select",
      },
      [selectDropdown, allOptions]
    );

    return selectMenu;
  }

  generateVerifyButton() {
    const verifyButtonClass =
      "mdb-cursor-pointer mdb-block mdb-w-full mdb-font-medium mdb-rounded-lg mdb-text-sm mdb-px-5 mdb-py-2 mdb-text-center mdb-border mdb-border-2 mdb-bg-gradient mdb-text-white ";

    const verifyButton = button(
      { className: verifyButtonClass, onclick: () => this.scanAndVerify() },
      "Scan & Verify"
    );
    return verifyButton;
  }

  generateRefreshButton() {
    const refreshButtonClass =
      "mdb-cursor-pointer mdb-flex mdb-items-center mdb-ml-auto mdb-text-gray-900 mdb-bg-white mdb-shadow border mdb-border-gray-300 mdb-hover:bg-gray-100 mdb-font-medium mdb-rounded-lg mdb-text-lg mdb-px-3 mdb-py-1 mdb-ml-1";

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
      { className: "mdb-flex mdb-flex-col", dir: "ltr" },

      div(
        {
          className:
            "mdb-flex mdb-flex-col mdb-justify-center mdb-w-full mdb-mb-4",
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
            className: "mdb-flex mdb-items-stretch",
          },
          this.generateDropdown(),
          this.generateRefreshButton()
        )
      ),
      div({ className: "mdb-flex mdb-py-2" }, this.generateVerifyButton())
    );
  }
}

const mosipBioDeviceHelper = ({ container, ...args }) => {
  const myDevice = new MosipBioDevice(container);
  myDevice.start();
};

export { mosipBioDeviceHelper };
