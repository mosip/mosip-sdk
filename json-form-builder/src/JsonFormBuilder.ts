import {
  FormConfig,
  FormState,
  FormField,
  FormData,
  Label,
  AdditionalConfig,
  AdditionalSchema,
} from "./types";

// Add TypeScript declaration for grecaptcha
declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (response: string) => void;
          "expired-callback"?: () => void;
        }
      ) => number;
      getResponse: (widgetId?: number) => string;
      reset: (widgetId?: number) => void;
    };
  }
}

type LanguageMap = Record<string, string>;
type LabelObject = Record<string, string>;

/**
 * Converts a one-way language map into a two-way map.
 * This allows for bidirectional lookup where both keys and values are language codes.
 * @param {Record<string, string>}oneWayMap A map where keys are language codes and values are their corresponding labels.
 * @returns Two-way map where both keys and values are language codes, allowing for bidirectional lookup.
 */
function buildBidirectionalLanguageMap(
  oneWayMap: Record<string, string>
): Record<string, string> {
  const twoWayMap: Record<string, string> = { ...oneWayMap };

  for (const [key, value] of Object.entries(oneWayMap)) {
    if (!twoWayMap[value]) {
      twoWayMap[value] = key;
    }
  }
  return twoWayMap;
}

/**
 * This function creates a loading icon element.
 * @returns  {HTMLDivElement} A div element containing a loading spinner.
 */
const createLoadingIcon = (): HTMLDivElement => {
  const div = document.createElement("div");
  div.className = "flex justify-center items-center h-full";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add(
    "mr-2",
    "h-8",
    "w-8",
    "animate-spin",
    "fill-secondary",
    "text-primary",
    "rtl:ml-2",
    "dark:text-gray-600"
  );
  svg.setAttribute("viewBox", "0 0 100 101");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute(
    "d",
    "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
  );
  path1.setAttribute("fill", "currentColor");

  const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path2.setAttribute(
    "d",
    "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
  );
  path2.setAttribute("fill", "currentFill");

  svg.appendChild(path1);
  svg.appendChild(path2);

  div.appendChild(svg);
  return div;
};

/**
 * Create password visibility icon based on the show parameter.
 * if false, it will show the "visibility" icon which can be used to show password,
 * otherwise it will show the "visibility_off" icon which can be used to hide password.
 * @param show Boolean indicating whether to show the password or not.
 * @returns {SVGSVGElement} representing the password visibility icon.
 */
const createPasswordIcon = (show: boolean): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  svg.setAttribute("viewBox", "0 0 22.634 17");
  svg.setAttribute("width", "22.634");
  svg.setAttribute("height", "17");

  if (show) {
    path.setAttribute("id", "visibility_off_FILL0_wght400_GRAD0_opsz48");
    path.setAttribute("transform", "translate(-40 863)");
    path.setAttribute(
      "d",
      "M55.15-853.529l-1.132-1.132a2.552,2.552,0,0,0-.694-3.035,2.748,2.748,0,0,0-2.958-.617l-1.132-1.132a3.109,3.109,0,0,1,.977-.412,4.758,4.758,0,0,1,1.106-.129,4.218,4.218,0,0,1,3.1,1.273,4.218,4.218,0,0,1,1.273,3.1,4.5,4.5,0,0,1-.141,1.119A3.4,3.4,0,0,1,55.15-853.529Zm3.318,3.318-1.029-1.029a12.058,12.058,0,0,0,2.2-2.07,8.264,8.264,0,0,0,1.376-2.3,10.267,10.267,0,0,0-3.858-4.514,10.1,10.1,0,0,0-5.581-1.659,12.367,12.367,0,0,0-2.212.206,8.219,8.219,0,0,0-1.775.489L46.4-862.3a11.666,11.666,0,0,1,2.3-.72,12.727,12.727,0,0,1,2.739-.309,11.611,11.611,0,0,1,6.726,2.1,12.154,12.154,0,0,1,4.463,5.62,12.707,12.707,0,0,1-1.723,3.009A12.422,12.422,0,0,1,58.467-850.211Zm1.492,5.813-4.321-4.244a9.993,9.993,0,0,1-2.032.553,13.6,13.6,0,0,1-2.289.193,11.793,11.793,0,0,1-6.816-2.1,12.286,12.286,0,0,1-4.5-5.62,11.673,11.673,0,0,1,1.428-2.611,14.62,14.62,0,0,1,2.225-2.43l-3.241-3.241L41.492-865l19.471,19.471ZM44.707-859.573a9.469,9.469,0,0,0-1.839,1.826,8.465,8.465,0,0,0-1.273,2.135,10.3,10.3,0,0,0,3.948,4.514,10.991,10.991,0,0,0,5.98,1.659,13.487,13.487,0,0,0,1.672-.1,4,4,0,0,0,1.235-.309L52.783-851.5a2.693,2.693,0,0,1-.694.193,5.015,5.015,0,0,1-.772.064,4.253,4.253,0,0,1-3.086-1.26,4.185,4.185,0,0,1-1.286-3.112,4.686,4.686,0,0,1,.064-.772,3.15,3.15,0,0,1,.193-.694ZM52.552-855.921ZM49.568-854.429Z"
    );
  } else {
    path.setAttribute("id", "visibility_FILL0_wght400_GRAD0_opsz48");
    path.setAttribute("transform", "translate(-40 800)");
    path.setAttribute(
      "d",
      "M51.32-787.911a4.21,4.21,0,0,0,3.1-1.276,4.225,4.225,0,0,0,1.273-3.1,4.21,4.21,0,0,0-1.276-3.1,4.225,4.225,0,0,0-3.1-1.273,4.21,4.21,0,0,0-3.1,1.276,4.225,4.225,0,0,0-1.273,3.1,4.21,4.21,0,0,0,1.276,3.1A4.225,4.225,0,0,0,51.32-787.911Zm-.009-1.492a2.764,2.764,0,0,1-2.039-.842,2.794,2.794,0,0,1-.836-2.045,2.764,2.764,0,0,1,.842-2.039,2.794,2.794,0,0,1,2.045-.836,2.764,2.764,0,0,1,2.039.842,2.794,2.794,0,0,1,.836,2.045,2.764,2.764,0,0,1-.842,2.039A2.794,2.794,0,0,1,51.311-789.4Zm.006,4.836a11.528,11.528,0,0,1-6.79-2.135A13,13,0,0,1,40-792.284a13.006,13.006,0,0,1,4.527-5.582A11.529,11.529,0,0,1,51.317-800a11.529,11.529,0,0,1,6.79,2.135,13.006,13.006,0,0,1,4.527,5.582,13,13,0,0,1-4.527,5.581A11.528,11.528,0,0,1,51.317-784.568ZM51.317-792.284Zm0,6.173A10.351,10.351,0,0,0,57.04-787.8a10.932,10.932,0,0,0,3.974-4.488,10.943,10.943,0,0,0-3.97-4.488,10.33,10.33,0,0,0-5.723-1.685,10.351,10.351,0,0,0-5.727,1.685,11.116,11.116,0,0,0-4,4.488,11.127,11.127,0,0,0,4,4.488A10.33,10.33,0,0,0,51.313-786.111Z"
    );
  }

  svg.appendChild(path);

  return svg;
};

/**
 * Creates an SVG element representing an info icon.
 * @param {number | string} size size of the info icon in px
 * @returns {SVGSVGElement} returns an SVG element with the info icon.
 */
const createInfoIconSvg = (size: number | string = 18.5): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  svg.setAttribute("viewBox", "0 0 18.5 18.5");
  svg.setAttribute("width", size.toString());
  svg.setAttribute("height", size.toString());

  g.setAttribute("id", "info_FILL0_wght400_GRAD0_opsz48");
  g.setAttribute("transform", "translate(0.25 0.25)");

  path.setAttribute("id", "info_FILL0_wght400_GRAD0_opsz48-2");
  path.setAttribute("data-name", "info_FILL0_wght400_GRAD0_opsz48");
  path.setAttribute("transform", "translate(-80 880)");
  path.setAttribute("fill", "currentColor");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "0.5");
  path.setAttribute(
    "d",
    "M88.393-866.5h1.35v-5.4h-1.35ZM89-873.565a.731.731,0,0,0,.529-.207.685.685,0,0,0,.214-.513.752.752,0,0,0-.213-.545.707.707,0,0,0-.529-.22.708.708,0,0,0-.529.22.751.751,0,0,0-.214.545.686.686,0,0,0,.213.513A.729.729,0,0,0,89-873.565ZM89.006-862a8.712,8.712,0,0,1-3.5-.709,9.145,9.145,0,0,1-2.863-1.935,9.14,9.14,0,0,1-1.935-2.865,8.728,8.728,0,0,1-.709-3.5,8.728,8.728,0,0,1,.709-3.5,9,9,0,0,1,1.935-2.854,9.237,9.237,0,0,1,2.865-1.924,8.728,8.728,0,0,1,3.5-.709,8.728,8.728,0,0,1,3.5.709,9.1,9.1,0,0,1,2.854,1.924,9.089,9.089,0,0,1,1.924,2.858,8.749,8.749,0,0,1,.709,3.5,8.712,8.712,0,0,1-.709,3.5,9.192,9.192,0,0,1-1.924,2.859,9.087,9.087,0,0,1-2.857,1.935A8.707,8.707,0,0,1,89.006-862Zm.005-1.35a7.348,7.348,0,0,0,5.411-2.239,7.4,7.4,0,0,0,2.228-5.422,7.374,7.374,0,0,0-2.223-5.411A7.376,7.376,0,0,0,89-878.65a7.4,7.4,0,0,0-5.411,2.223A7.357,7.357,0,0,0,81.35-871a7.372,7.372,0,0,0,2.239,5.411A7.385,7.385,0,0,0,89.011-863.35ZM89-871Z"
  );

  g.appendChild(path);
  svg.appendChild(g);

  return svg;
};

/**
 * Create Info icon for a form field
 */
const createInfoIcon = (infoMessage: string): HTMLSpanElement => {
  const infoContainer = document.createElement("span");
  infoContainer.className = "info-container";

  const infoSpan = document.createElement("span");
  infoSpan.className = "info-icon";
  infoSpan.appendChild(createInfoIconSvg());

  const infoDetail = document.createElement("div");
  infoDetail.className = "info-detail";
  infoDetail.setAttribute("aria-hidden", "true"); // Initially hidden

  const infoDetailArrow = document.createElement("span");
  infoDetailArrow.className = "info-detail-arrow";
  infoDetailArrow.innerHTML = `<svg class="fill-[#FFFFFF] stroke-[#BCBCBC]" width="10" height="5" viewBox="0 0 30 10" preserveAspectRatio="none" style="display: block;"><polygon points="0,0 30,0 15,10"></polygon></svg>`;

  const showInfo = () => {
    infoDetail.classList.add("active");
    infoDetail.setAttribute("aria-hidden", "false");
  };

  // Function to hide the info detail
  const hideInfo = () => {
    infoDetail.classList.remove("active");
    infoDetail.setAttribute("aria-hidden", "true");
  };

  const hideAllInfo = () => {
    const allInfoDetails = document.querySelectorAll(".info-detail.active");
    allInfoDetails.forEach((detail) => {
      (detail as HTMLDivElement).classList.remove("active");
      (detail as HTMLDivElement).setAttribute("aria-hidden", "true");
    });
  };

  infoSpan.addEventListener("click", (e) => {
    e.stopPropagation();
    const isActive = infoDetail.classList.contains("active");
    hideAllInfo(); // Hide all other info details
    if (!isActive) {
      showInfo();
    }
  });

  // Close when clicking outside the info detail box
  document.addEventListener("click", (event) => {
    // Check if the click was outside the current info container
    if (
      !document.contains(event.target as Node) &&
      infoDetail.classList.contains("active")
    ) {
      hideInfo();
    }
  });

  // Optional: Close with Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && infoDetail.classList.contains("active")) {
      hideInfo();
    }
  });

  infoDetail.append(infoMessage, infoDetailArrow);
  infoSpan.appendChild(infoDetail);
  infoContainer.appendChild(infoSpan);

  return infoContainer;
};

/**
 * Get caps lock span
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field form field object containing label and required properties
 * @returns {HTMLSpanElement} returns a span element for caps lock info
 */
const getCapsLockSpan = (
  state: FormState,
  field: FormField
): HTMLSpanElement => {
  const capsLockSpan = document.createElement("span");
  if (field?.capsLockCheck) {
    capsLockSpan.className = "caps-lock-span";
    const capsInfoIcon = document.createElement("span");
    capsInfoIcon.className = "caps-lock-icon";
    capsInfoIcon.appendChild(createInfoIconSvg(12));
    const capsTextSpan = document.createElement("span");
    capsTextSpan.className = "caps-lock-text";
    capsTextSpan.textContent =
      getMultiLangText(state, state.fallbackErrors?.capsLock || {}) ||
      "Caps Lock is on";
    capsLockSpan.appendChild(capsInfoIcon);
    capsLockSpan.appendChild(capsTextSpan);
  }
  capsLockSpan.style.display = "none";
  return capsLockSpan;
};

/**
 * Toggle caps lock info on click of caps lock button
 * @param {KeyboardEvent | MouseEvent} event event from click or keyup
 * @param {HTMLSpanElement} capsLockSpan span element of the caps lock span
 */
const checkCapsLock = (
  event: KeyboardEvent | MouseEvent,
  capsLockSpan: HTMLSpanElement
) =>
  (capsLockSpan.style.display = event.getModifierState("CapsLock")
    ? "inline-flex"
    : "none");

/**
 * Prevents the default action of an event.
 * @param {Event} e Event to prevent default action for.
 */
const preventDefaultFn = (e: Event): void => {
  e.preventDefault();
  return;
};

/**
 * Disables a form field by preventing user input and interaction.
 * @param {HTMLInputElement | HTMLSelectElement} field HTMLInputElement or HTMLSelectElement to disable.
 */
const disableField = (field: HTMLInputElement | HTMLSelectElement): void => {
  field.classList.add("disabled");
  field.disabled = true;
  field.addEventListener("keypress", preventDefaultFn);
  field.addEventListener("keydown", preventDefaultFn);
  field.addEventListener("cut", preventDefaultFn);
  field.addEventListener("paste", preventDefaultFn);
  field.addEventListener("click", preventDefaultFn);
};

/**
 * Gets the label text for a form field, including a required indicator if the field is marked as required.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {LabelObject | undefined} labels Labels object containing multilingual labels for the field.
 * @param {boolean} strictOnly Boolean flag to determine if strict fallback is required.
 * @param {string} currLang Current language code to use for fetching the label.
 * @param {string} defaultLang Default language code to use if no label is found in the current language.
 * @returns {string} The label text for the field, including a required indicator if applicable.
 */
const getMultiLangText = (
  state: FormState,
  labels: LabelObject | undefined,
  strictOnly: boolean = false,
  currLang?: string,
  defaultLang?: string
): string => {
  if (!currLang) {
    currLang =
      state.languageMap[state.currentLanguage] || state.currentLanguage;
  }

  if (!defaultLang) {
    defaultLang =
      state.languageMap[state.defaultLanguage] || state.defaultLanguage;
  }

  if (!labels || state.languageMap[currLang] === undefined) return "";

  const langVariants = [
    currLang,
    state.languageMap[currLang],
    defaultLang,
    state.languageMap[defaultLang],
  ].filter((v): v is string => typeof v === "string");

  for (const variant of langVariants) {
    if (variant in labels) return labels[variant];
  }
  // 🚫 Don't fallback to any label if strictOnly is true
  if (strictOnly) return "";

  // ✅ Otherwise, fallback to the first available label
  return Object.values(labels)[0] || "";
};

/**
 * Refreshes all labels in the form based on the current language and schema.
 * It updates the labels for inputs, selects, and error messages according to the current language.
 * @param {FormState} state The current form state containing schema, container, and other properties.
 */
const refreshLabels = (state: FormState): void => {
  const lang = state.currentLanguage;
  const defaultLang = state.defaultLanguage;

  state.schema.forEach((field) => {
    const labelText = getLabelText(state, field);

    if (field.type === "simpleType") {
      const fieldGroup = state.container
        .querySelector(`.form-field-group input[data-field-id="${field.id}"]`)
        ?.closest(".form-field-group");
      const mainLabel = fieldGroup?.querySelector("label");
      if (mainLabel) {
        mainLabel.innerHTML = labelText;

        if (field.info) {
          const infoIcon = createInfoIcon(getMultiLangText(state, field.info));
          mainLabel.appendChild(infoIcon);
        }

        const capsLockText =
          mainLabel.parentElement?.querySelector(".caps-lock-text");
        if (field?.capsLockCheck && capsLockText) {
          capsLockText.textContent =
            getMultiLangText(state, state.fallbackErrors?.capsLock || {}) ||
            "Caps Lock is on";
        }
      }

      const inputs = state.container.querySelectorAll(
        `input[data-field-id="${field.id}"]`
      );
      inputs.forEach((input) => {
        const datasetLang = (input as HTMLInputElement).dataset.lang || "";
        const inputLang = datasetLang || lang;

        (input as HTMLInputElement).placeholder = getMultiLangText(
          state,
          field.placeholder,
          false,
          inputLang,
          defaultLang
        );
      });
    } else {
      // changing label text after language update
      const labelElement = state.container.querySelector(
        `label[for="${field.id}"]`
      );
      if (labelElement) {
        labelElement.innerHTML = labelText;

        if (field.info) {
          const infoIcon = createInfoIcon(getMultiLangText(state, field.info));
          labelElement.appendChild(infoIcon);
        }

        // changing caps lock text after language update
        const capsLockText =
          labelElement.parentElement?.querySelector(".caps-lock-text");
        if (field?.capsLockCheck && capsLockText) {
          capsLockText.textContent =
            getMultiLangText(state, state.fallbackErrors?.capsLock || {}) ||
            "Caps Lock is on";
        }
      }

      const input = state.container.querySelector(
        `input#${field.id}`
      ) as HTMLInputElement;
      if (input) {
        input.placeholder = getMultiLangText(
          state,
          field.placeholder,
          false,
          lang,
          defaultLang
        );
      }

      if (field.controlType === "password") {
        const confirmId = `${field.id}_confirm`;
        let confirmLabel: Label = {};
        let confirmPlaceholder: Label = {};
        // checking if additionalSchema has confirm field details
        // If it does, use those details; otherwise, build a default confirm label and placeholder
        if (state.additionalSchema && state.additionalSchema[confirmId]) {
          confirmLabel = state.additionalSchema[confirmId].label;
          confirmPlaceholder = state.additionalSchema[confirmId].placeholder;
        } else {
          // If no additionalSchema, take value from label & placeholder of password field
          Object.keys(field.label || {}).forEach((code) => {
            const mapped = state.languageMap[code] || code;
            confirmLabel[mapped] = `Confirm ${field.label[code]}`;
          });

          Object.keys(field.placeholder || {}).forEach((code) => {
            const mapped = state.languageMap[code] || code;
            if (field.placeholder) {
              confirmPlaceholder[mapped] = `Confirm ${field.placeholder[code]}`;
            }
          });
        }

        const confirmLabelElement = state.container.querySelector(
          `label[for="${field.id}_confirm"]`
        );
        if (confirmLabelElement) {
          confirmLabelElement.innerHTML = getLabelText(
            { ...state, schema: [{ ...field, label: confirmLabel }] },
            { ...field, label: confirmLabel },
            confirmLabel
          );

          // changing caps lock text after language update
          const confirmCapsTextSpan =
            confirmLabelElement.parentElement?.querySelector(".caps-lock-text");
          if (field?.capsLockCheck && confirmCapsTextSpan) {
            confirmCapsTextSpan.textContent =
              getMultiLangText(state, state.fallbackErrors?.capsLock || {}) ||
              "Caps Lock is on";
          }
        }

        const confirmInput = state.container.querySelector(
          `input#${field.id}_confirm`
        ) as HTMLInputElement;

        if (confirmInput) {
          confirmInput.placeholder =
            getMultiLangText(state, confirmPlaceholder) || "";
        }
      }
    }

    if (field.controlType === "dropdown") {
      const select = state.container.querySelector(
        `select#${field.id}`
      ) as HTMLSelectElement;
      if (select) {
        const selectedValue = select.value;
        select.innerHTML = "";

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent =
          getMultiLangText(
            state,
            field.placeholder,
            false,
            lang,
            defaultLang
          ) || "Select an Option";
        placeholder.disabled = true;
        placeholder.selected = true;
        placeholder.hidden = true;
        select.appendChild(placeholder);

        Object.entries(state.allowedValues[field.id] || {}).forEach(
          ([value, labels]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = getMultiLangText(
              state,
              labels,
              false,
              lang,
              defaultLang
            );
            option.selected = value === selectedValue;
            select.appendChild(option);
          }
        );
      }
    }

    const errorContainer = state.container.querySelector(
      `.form-field[data-field-id="${field.id}"] .error-container`
    );

    if (!state.lastErrors) state.lastErrors = {};

    let lastError: "required" | number | null = null;

    // Simple validation example for required and regex validators:
    if (field.required) {
      // find the input(s) for this field (assuming first input for simplicity)
      const inputElement = state.container.querySelector(
        `input[data-field-id="${field.id}"]`
      ) as HTMLInputElement | null;
      if (inputElement && !inputElement.value.trim()) {
        lastError = "required";
      } else if (Array.isArray(field.validators) && inputElement) {
        for (let i = 0; i < field.validators.length; i++) {
          const validator = new RegExp(field.validators[i]?.regex || "");
          if (!validator.test(inputElement.value)) {
            lastError = i;
            break;
          }
        }
      }
    }

    state.lastErrors[field.id] = lastError;

    // Show error messages if error container exists and error present
    if (errorContainer && lastError != null) {
      let errorText = "";

      if (lastError === "required") {
        const requiredErrors = state.fallbackErrors?.required || {};
        errorText = getMultiLangText(state, requiredErrors) || "Invalid value";
      } else if (
        typeof lastError === "number" &&
        Array.isArray(field.validators)
      ) {
        const validator = field.validators[lastError];
        if (validator && validator.error) {
          errorText =
            getMultiLangText(state, validator.error) || "Invalid value";
        }
      }

      errorContainer.textContent = errorText;
    } else if (errorContainer) {
      errorContainer.textContent = ""; // clear error if none
    }
  });

  const submitButton = state.container.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.textContent = state.submitLabel;
  }
};

/**
 * Helps to get the label text for a form field, including a required indicator if the field is marked as required.
 * @param {FormState} state form state containing current language and default language
 * @param {FormField} field form field object containing label and required properties
 *  @param {LabelObject} additionalLabel Optional additional label object to use instead of the field's label.
 * @returns {string} The label text for the field, including a required indicator if applicable.
 */
const getLabelText = (
  state: FormState,
  field: FormField,
  additionalLabel?: LabelObject
): string => {
  const lang = state.currentLanguage;
  const defaultLang = state.defaultLanguage;

  const labels = additionalLabel || field.label;

  let labelText = getMultiLangText(state, labels, false, lang, defaultLang);

  if (field.required) {
    labelText += '<span class="required">*</span>';
  }

  return labelText;
};

/**
 * Triggers input and change events for all inputs in the form.
 * @param {FormState} state The current form state containing the container and form data.
 */
const triggerAllEvents = (state: FormState) => {
  const inputs = state.container.querySelectorAll("input, select");

  inputs.forEach((input) => {
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
};

/**
 * Updates the current language of the form and refreshes all labels accordingly.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {string} newLanguage New language code to switch to.
 * @param {string} submitButtonLabel Optional label for the submit button in the new language.
 */
const updateLanguage = (
  state: FormState,
  newLanguage: string,
  submitButtonLabel?: string,
  additionalSchema?: AdditionalSchema
): void => {
  const normalizedLang = newLanguage || state.languageMap[newLanguage];
  state.currentLanguage = normalizedLang;
  state.isRTL = state.rtlLanguages.includes(normalizedLang);
  state.container.dir = state.isRTL ? "rtl" : "ltr";
  state.container.style.direction = state.isRTL ? "rtl" : "ltr";

  state.isSubmitting = false;

  if (additionalSchema) {
    state.additionalSchema = additionalSchema;
  }

  if (
    state.recaptcha?.enabled !== false &&
    state.recaptcha?.siteKey &&
    window.grecaptcha
  ) {
    const recaptchaContainer = document.getElementById("recaptcha-container");
    if (recaptchaContainer) {
      const widgetId = recaptchaContainer.getAttribute("data-widget-id");
      if (widgetId) {
        try {
          window.grecaptcha.reset(Number(widgetId));

          const newContainer = document.createElement("div");
          newContainer.id = "recaptcha-container";
          newContainer.className = "recaptcha-container";

          recaptchaContainer.parentNode?.replaceChild(
            newContainer,
            recaptchaContainer
          );

          const newWidgetId = window.grecaptcha.render(newContainer, {
            sitekey: state.recaptcha.siteKey,
            callback: (response) => {
              state.formData.recaptchaToken = response;
            },
            "expired-callback": () => {
              delete state.formData.recaptchaToken;
            },
          });

          newContainer.setAttribute("data-widget-id", newWidgetId.toString());
        } catch (error) {
          console.error("Failed to update reCAPTCHA language:", error);
        }
      }
    }
  }

  if (submitButtonLabel) {
    state.submitLabel = submitButtonLabel;
  }
  refreshLabels(state);
  triggerAllEvents(state);
};

/**
 * Creates a language switcher element that allows users to switch between available languages.
 * @param state Current form state containing schema, container, and other properties.
 * @returns {HTMLDivElement} A div element containing the language switcher with a label and select dropdown.
 */
const createLanguageSwitcher = (state: FormState): HTMLDivElement => {
  const container = document.createElement("div");
  container.className = "language-switcher";

  const label = document.createElement("label");
  label.textContent = "Language: ";

  const select = document.createElement("select");
  state.availableLanguages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = lang.toUpperCase();
    option.selected = lang === state.currentLanguage;
    select.appendChild(option);
  });

  select.addEventListener("change", (e) => {
    const target = e.target as HTMLSelectElement;
    updateLanguage(state, target.value);
  });

  container.appendChild(label);
  container.appendChild(select);
  return container;
};

/**
 * Handles the required validation for a form field.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {string} normalizedLang Current language code normalized to a 3-letter code.
 * @param {string} normalizedDefault Default language code normalized to a 3-letter code.
 * @param {HTMLDivElement} errorContainer Error container element where error messages will be appended.
 * @returns { lastError: 'required'; isValid: false }
 */
const handleRequiredValidation = (
  state: FormState,
  errorContainer: HTMLDivElement,
  normalizedLang: string = "",
  normalizedDefault: string = ""
): { lastError: "required"; isValid: false } => {
  const requiredErrors = state.fallbackErrors?.required || {};
  const requiredError =
    getMultiLangText(
      state,
      requiredErrors,
      true,
      normalizedLang,
      normalizedDefault
    ) || "This field is required";

  appendError(errorContainer, requiredError);
  return { lastError: "required", isValid: false };
};

/**
 * Handles regex validation for a form field.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {HTMLDivElement} errorContainer Error container element where error messages will be appended.
 * @param {any[]} validators Validators array containing regex or validator functions.
 * @param {string} value Value to validate against the regex.
 * @param {boolean} useLangCode Language code usage flag to filter validators based on language.
 * @param {string} currentLang Current language code normalized to a 3-letter code.
 * @param {string} defaultLang Default language code normalized to a 3-letter code.
 * @returns { lastError: number | null; isValid: boolean }
 */
const handleRegexValidation = (
  state: FormState,
  errorContainer: HTMLDivElement,
  validators: any[],
  value: string,
  useLangCode: boolean,
  currentLang: string = "",
  defaultLang: string = ""
) => {
  const normalizeToThreeLetterCode = (
    lang: string,
    languageMap: Record<string, string>
  ) => {
    if (lang.length === 3) return lang;
    return languageMap[lang] || lang;
  };

  if (!currentLang) {
    currentLang =
      state.languageMap[state.currentLanguage] || state.currentLanguage;
  }
  if (!defaultLang) {
    defaultLang =
      state.languageMap[state.defaultLanguage] || state.defaultLanguage;
  }
  const normalizedLang = normalizeToThreeLetterCode(
    currentLang,
    state.languageMap
  );

  const filteredValidators = useLangCode
    ? validators.filter((v) => {
        if (!v.langCode) return true;
        const normalizedValidatorLang = normalizeToThreeLetterCode(
          v.langCode,
          state.languageMap
        );
        return normalizedValidatorLang === normalizedLang;
      })
    : validators;

  for (let i = 0; i < filteredValidators.length; i++) {
    const validator = filteredValidators[i];
    const regex = new RegExp(validator.regex || validator.validator);

    if (regex && !regex.test(value)) {
      let errorMsg =
        getMultiLangText(
          state,
          validator.error,
          true,
          currentLang,
          defaultLang
        ) || "Invalid input";

      appendError(errorContainer, errorMsg);
      return { lastError: i, isValid: false };
    }
  }

  return { lastError: null, isValid: true };
};

/**
 * Gets the form data from the current state, normalizing language codes to 3-letter codes.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @returns {FormData} The collected form data with normalized language codes.
 */
const JsonFormBuilder = (
  config: FormConfig,
  containerId: string,
  additionalConfig: AdditionalConfig
) => {
  const container =
    document.getElementById(containerId) ||
    document.querySelector(`#${containerId}`);
  if (!container) {
    throw new Error(`Container with id "${containerId}" not found`);
  }

  const state: FormState = {
    schema: config.schema,
    allowedValues: config.allowedValues || {},
    mandatoryLanguages: config.language.mandatory || ["eng"],
    optionalLanguages: config.language.optional || [],
    container: container as HTMLElement,
    formData: {},
    formElements: {},
    submitLabel: additionalConfig.submitButton.label,
    submitAction: additionalConfig.submitButton.action,
    currentLanguage: additionalConfig.language?.currentLanguage || "eng",
    defaultLanguage: additionalConfig.language?.defaultLanguage || "eng",
    showLanguageSwitcher:
      additionalConfig.language?.showLanguageSwitcher || false,
    languageSwitcherPosition:
      additionalConfig.language?.languageSwitcherPosition || "top",
    availableLanguages: additionalConfig.language?.availableLanguages || [
      ...(config.language.mandatory || ["eng"]),
      ...(config.language.optional || []),
    ],
    rtlLanguages: additionalConfig.language?.rtlLanguages || [
      "ara",
      "ar",
      "he",
      "fa",
      "ur",
    ],
    isRTL: false,
    recaptcha: additionalConfig.recaptcha,
    fallbackErrors: config.errors || {},
    lastErrors: {},
    languageMap: buildBidirectionalLanguageMap(
      config.language.langCodeMap || {}
    ),
    additionalSchema: additionalConfig.additionalSchema || {},
    isSubmitting: false,
  };

  /**
   * Loads the reCAPTCHA script asynchronously and checks if it is already loaded.
   * @returns {Promise<boolean>} A promise that resolves to true if reCAPTCHA script is loaded successfully, false otherwise.
   */
  const loadRecaptcha = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check if script is already loaded
      if (window.grecaptcha) {
        resolve(true);
        return;
      }

      // Check if script is already in the DOM
      if (document.querySelector('script[src*="recaptcha/api.js"]')) {
        // Wait for grecaptcha to be available
        const checkGrecaptcha = () => {
          if (
            window.grecaptcha &&
            typeof window.grecaptcha.render === "function"
          ) {
            resolve(true);
          } else {
            setTimeout(checkGrecaptcha, 100);
          }
        };
        checkGrecaptcha();
        return;
      }

      // Create script element
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?hl=${state.recaptcha?.language || state.currentLanguage}`;
      script.async = true;
      script.defer = true;

      // Add onload handler
      script.onload = () => {
        // Wait for grecaptcha to be available
        const checkGrecaptcha = () => {
          if (
            window.grecaptcha &&
            typeof window.grecaptcha.render === "function"
          ) {
            resolve(true);
          } else {
            setTimeout(checkGrecaptcha, 100);
          }
        };
        checkGrecaptcha();
      };

      // Add error handler
      script.onerror = () => {
        console.error("Failed to load reCAPTCHA script");
        resolve(false);
      };

      document.head.appendChild(script);
    });
  };

  /**
   * Adds the reCAPTCHA script to the document if reCAPTCHA is enabled and site key is provided.
   */
  const addRecaptchaScript = async (): Promise<void> => {
    if (state.recaptcha?.enabled !== false && state.recaptcha?.siteKey) {
      const success = await loadRecaptcha();
      if (!success) {
        console.error("Failed to initialize reCAPTCHA");
        state.recaptcha.enabled = false;
      }
    }
  };

  /**
   * Adds responsive styles to the form elements to ensure they are displayed correctly on different screen sizes.
   */
  const addResponsiveStyles = (): void => {
    const style = document.createElement("style");
    style.textContent = `
      .form-group {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 0rem;
      }

      .form-field {
        flex: 1;
        min-width: 250px;
        margin-bottom: 0.5rem;
      }

      .form-field label,
      .form-field-group label {
        font-size: 14px;
        line-height: 16px;
        font-weight: 600;
      }
        
      .form-field .input_box::placeholder,
      .form-field .input_box::-moz-placeholder,
      .form-field .input_box:-ms-input-placeholder,
      .form-field .input_box::-webkit-input-placeholder,
      .form-field input[type="date"]::-webkit-datetime-edit-text,
      .form-field select option:first-child {
        color: #a0a8ac;
        font: 500 14px/21px Inter,sans-serif;
      }

      .form-field .input_box.error {
        border-color: #fe6b6b;
      }

      .form-field .input_box.error:focus-visible,
      .form-field .input_box.error:focus,
      .form-field .input_box.error:focus-within {
        border-color: #fe6b6b !important;
      }

      .form-field-group {
        flex: 1;
        min-width: 250px;
        margin-bottom: 0.5rem;
      }

      .input_box {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.9rem;
      }

      .language-switcher label {
        display: flex;
        align-items: center;
        font-size: 0.9rem;
      }

      .recaptcha-container {
        margin: 1rem 0;
        display: flex;
        justify-content: center;
      }
      
      .password-container {
        position: relative;
      }

      .password-eye-icon {
        position: absolute;
        right: 0.75rem; /* Position from the right edge of the input */
        transform: translateY(230%); /* Adjust for perfect vertical centering */
        cursor: pointer;
        color: #6B7280; /* A neutral gray color */
        font-size: 1.25rem; /* Adjust icon size */
        line-height: 1; /* Ensure icon doesn't affect line height */
        user-select: none;
      }

      .checkbox-container {
        display: flex; /* Use flexbox to align checkbox and label */
        gap: 1rem; /* Space between checkbox and label (Tailwind gap-2) */
        align-items: center; /* Vertically center the checkbox and label */
      }

      .checkbox-container input[type="checkbox"] {
        width: 1.25rem; /* Tailwind w-5 */
        height: 1.25rem; /* Tailwind h-5 */
        border: 1px solid #d1d5db; /* Tailwind border-gray-300 */
        border-radius: 2px; /* Tailwind rounded */
        cursor: pointer;
        flex-shrink: 0; /* Prevent checkbox from shrinking */
      }

      .checkbox-container label {
        font-size: 14px; /* Tailwind text-base */
        font-weight: 500; /* Tailwind font-medium */
        line-height: 1; /* Tailwind leading-relaxed */
        color: #1f2937; /* Tailwind text-gray-900 */
        cursor: pointer;
        user-select: none; /* Prevent text selection when clicking label */
      }

      /* Info Icon Styling */
      .info-container {
          position: relative; /* Allows info-detail to be positioned relative to this */
          display: inline-block; /* So it doesn't take full width */
          vertical-align: middle; /* Align with text */
          margin-left: 5px;
      }

      .info-icon {
          cursor: pointer;
          font-weight: bold;
          display: inline-flex; /* For centering the 'i' */
          align-items: center;
          justify-content: center;
          vertical-align: text-top;
          height: 1rem;
          width: 1rem;
      }


      /* Info Detail Box Styling */
      .info-detail {
          font-size: 12px;
          line-height: 16px;
          font-weight: 400;
          display: none; /* Hidden by default */
          position: absolute;
          top: 100%; /* Position below the icon */
          left: 50%; /* Center horizontally relative to icon */
          transform: translate(10%, -60%); /* Adjust to true center */
          min-width: 250px;
          max-width: 350px;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 8px 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000; /* Ensure it's above other content */
          opacity: 0; /* For fade in/out effect */
          visibility: hidden; /* For proper hiding without taking up space */
          transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
      }

      .info-detail-arrow {
        position: absolute;
        left: 0px;
        transform-origin: 0px 0px;
        transform: translateY(50%) rotate(90deg) translateX(-50%);
        top: 50%;
      }
      
      @media screen and (max-width: 640px) {
        .info-detail {
          transform: translate(-40%, 5%); /* Adjust for smaller screens */
        }

        .info-detail-arrow {
          transform-origin: center 0px;
          transform: rotate(180deg);
          left: 94px;
          top: 0px;
        }
      }

      .info-detail.active {
          display: block; /* Show when active */
          opacity: 1;
          visibility: visible;
      }

      .label-div-display {
        display: flex;
        justify-content: space-between;
        align-items: end;
      }

      .caps-lock-span {
        font-size: small;
        color: #2D86BA;
        align-items: center;
      }
      
      .caps-lock-text {
        margin-left: 4px;
      }
    `;
    document.head.appendChild(style);
  };

  /**
   * Adds styles for the language switcher to ensure it is displayed correctly.
   */
  const addLanguageSwitcherStyles = (): void => {
    const style = document.createElement("style");
    style.textContent = `
      .language-switcher {
        display: flex;
        gap: 0.5rem;
        margin: 1rem 0;
        justify-content: flex-end;
      }

      .language-switcher select {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.9rem;
      }

      .language-switcher label {
        display: flex;
        align-items: center;
        font-size: 0.9rem;
      }
    `;
    document.head.appendChild(style);
  };

  /**
   * Adds styles for right-to-left (RTL) languages to ensure proper layout and alignment.
   */
  const addRTLStyles = (): void => {
    const style = document.createElement("style");
    style.textContent = `
      [dir="rtl"] .form-group {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .form-field-group {
        flex-direction: column-reverse;
      }

      [dir="rtl"] .language-switcher {
        justify-content: flex-start;
      }

      [dir="rtl"] .required {
        margin-left: 0;
        margin-right: 4px;
      }

      [dir="rtl"] .error-message {
        text-align: right;
      }

      [dir="rtl"] .form-field label {
        text-align: right;
      }

      [dir="rtl"] .input_box {
        text-align: right;
      }

      [dir="rtl"] .form-button {
        margin-right: auto;
        margin-left: 0;
      }

      @media (max-width: 768px) {
        [dir="rtl"] .form-group {
          flex-direction: column;
        }
      }

      [dir="rtl"] .password-eye-icon {
        left: 0.75rem;
        right: unset;
      }

      [dir="rtl"] .checkbox-container {
        flex-direction: row-reverse; /* Align checkbox and label in RTL */
      }

      [dir="rtl"] .info-container {
        margin-left: unset;
        margin-right: 5px;
      }

      [dir="rtl"] .info-detail {
        transform: translate(-110%, -60%);
      } 

      [dir="rtl"] .info-detail-arrow {
        left: unset;
        right: 0px;
        transform-origin: 3px -7px;
        transform: translateY(50%) rotate(-90deg) translateX(-50%);
      }

      @media screen and (max-width: 640px) {
        [dir="rtl"] .info-detail {
          transform: translate(-70%, 5%); /* Adjust for smaller screens */
        }

        [dir="rtl"] .info-detail-arrow {
          transform-origin: center 0px;
          transform: rotate(180deg);
          left: unset;
          right: 28%
        }
      }

      [dir="rtl"] .caps-lock-text {
        margin-right: 4px;
        margin-left: unset;
      }
    `;
    document.head.appendChild(style);
  };

  /**
   * Updates the RTL state of the form based on the current language.
   * @param {string} language The language code to check if it is an RTL language.
   */
  const updateRTLState = (language: string): void => {
    state.isRTL = state.rtlLanguages.includes(language);
    state.container.setAttribute("dir", state.isRTL ? "rtl" : "ltr");
    state.container.style.direction = state.isRTL ? "rtl" : "ltr";
  };

  // Initialize RTL state
  updateRTLState(state.currentLanguage);

  /**
   * Groups form fields by their alignment group.
   * @param {FormState} state Current form state containing schema, container, and other properties.
   * @returns {Record<string, FormField[]>} An object where keys are alignment group names and values are arrays of fields in that group.
   */
  const render = (state: FormState): void => {
    const form = document.createElement("form");
    form.className = "form";

    // Add language switcher if enabled
    if (state.showLanguageSwitcher) {
      const languageSwitcher = createLanguageSwitcher(state);
      form.appendChild(languageSwitcher);
    }

    // Group fields by alignment group
    const groupedFields = groupFields(state);

    // Render each group
    Object.entries(groupedFields).forEach(([groupName, fields]) => {
      const group = document.createElement("div");
      group.className = "form-group";
      group.style.display = "flex";
      group.style.flexDirection = "row";

      fields.forEach((field) => {
        const fieldElement = createFormElement(state, field);
        group.appendChild(fieldElement);
      });

      form.appendChild(group);
    });

    // Add reCAPTCHA if enabled
    if (state.recaptcha?.enabled !== false && state.recaptcha?.siteKey) {
      const recaptchaContainer = document.createElement("div");
      recaptchaContainer.id = "recaptcha-container";
      recaptchaContainer.className = "recaptcha-container";
      form.appendChild(recaptchaContainer);
    }

    // Add submit button
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "form-button";
    submitButton.textContent = state.submitLabel;
    form.appendChild(submitButton);

    // Add form submit handler
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      validateAndSubmit(state);
    });

    // Clear container and append form
    state.container.innerHTML = "";
    state.container.appendChild(form);

    // Initialize reCAPTCHA if enabled
    if (state.recaptcha?.enabled !== false && state.recaptcha?.siteKey) {
      const recaptchaContainer = document.getElementById("recaptcha-container");
      if (
        recaptchaContainer &&
        window.grecaptcha &&
        typeof window.grecaptcha.render === "function"
      ) {
        try {
          const widgetId = window.grecaptcha.render(recaptchaContainer, {
            sitekey: state.recaptcha.siteKey,
            callback: (response) => {
              // Store the response in form data
              state.formData.recaptchaToken = response;
            },
            "expired-callback": () => {
              // Clear the token when it expires
              delete state.formData.recaptchaToken;
            },
          });
          // Store the widget ID for later use
          recaptchaContainer.setAttribute(
            "data-widget-id",
            widgetId.toString()
          );
        } catch (error) {
          console.error("Failed to initialize reCAPTCHA:", error);
          // Disable reCAPTCHA if initialization fails
          state.recaptcha.enabled = false;
        }
      } else {
        console.warn("reCAPTCHA not available or not properly initialized");
        state.recaptcha.enabled = false;
      }
    }
  };

  /**
   * Validates the form and submits the data if valid.
   * @param state Current form state containing schema, container, and other properties.
   */
  const validateAndSubmit = (state: FormState) => {
    if (state.isSubmitting) return; // Prevent multiple submissions

    const form = state.container.querySelector("form");
    if (!form) return;

    const formButton = form.querySelector('button[type="submit"]');
    if (!formButton) return;

    formButton.innerHTML = "";
    formButton.appendChild(createLoadingIcon());
    state.isSubmitting = true;

    let isValid = true;

    // Trigger validation on all inputs
    triggerAllEvents(state);

    // Validate reCAPTCHA if configured and enabled
    if (state.recaptcha?.enabled !== false && state.recaptcha?.siteKey) {
      const recaptchaContainer = document.getElementById("recaptcha-container");
      if (
        recaptchaContainer &&
        window.grecaptcha &&
        typeof window.grecaptcha.getResponse === "function"
      ) {
        const widgetId = recaptchaContainer.getAttribute("data-widget-id");
        if (widgetId) {
          try {
            const recaptchaResponse = window.grecaptcha.getResponse(
              Number(widgetId)
            );
            if (!recaptchaResponse) {
              isValid = false;
              const errorMessage = document.createElement("div");
              errorMessage.className = "error-message";
              errorMessage.textContent = "Please complete the reCAPTCHA";
              recaptchaContainer.appendChild(errorMessage);
            }
          } catch (error) {
            console.error("Failed to validate reCAPTCHA:", error);
            isValid = false;
          }
        }
      }
    }

    if (isValid) {
      // Ensure all form data is up to date
      form.querySelectorAll("input").forEach((el) => {
        const input = el as HTMLInputElement;
        const fieldId = input.dataset.fieldId;
        const lang = input.dataset.lang;

        if (fieldId && lang) {
          // Always normalize to 3-letter code
          const normalizedLang = state.languageMap[lang];

          // Store only if normalization results in a valid 3-letter code
          if (normalizedLang && normalizedLang.length === 3) {
            if (!state.formData[fieldId]) {
              state.formData[fieldId] = {};
            }
            if (input.value) {
              (state.formData[fieldId] as { [key: string]: string })[
                normalizedLang
              ] = input.value;
            }
          }
        } else if (input.id) {
          // Handle regular fields
          if (input.value) {
            state.formData[input.id] = input.value;
          }
        }
      });

      const data = getFormData(state);
      if (typeof state.submitAction === "function") {
        state.submitAction(data);
      } else {
        state.isSubmitting = false;
        formButton.innerHTML = state.submitLabel;
        console.log("Form data:", data);
      }
    } else {
      state.isSubmitting = false;
      formButton.innerHTML = state.submitLabel;
      form.reportValidity();
    }
  };

  return Object.freeze({
    render: async (): Promise<void> => {
      addResponsiveStyles();
      addRTLStyles();
      if (state.showLanguageSwitcher) {
        addLanguageSwitcherStyles();
      }
      await addRecaptchaScript();
      render(state);
    },
    getFormData: (): FormData => getFormData(state),
    updateLanguage: (
      newLanguage: string,
      submitButtonLabel?: string,
      additionalSchema?: AdditionalSchema
    ): void =>
      updateLanguage(state, newLanguage, submitButtonLabel, additionalSchema),
  });
};

/**
 * Creates a new div element to be used as an error container.
 * @returns {HTMLDivElement} A new div element to be used as an error container.
 */
const createErrorContainer = (): HTMLDivElement => {
  const errorContainer = document.createElement("div");
  errorContainer.className = "error-message";
  return errorContainer;
};

/**
 * Appends an error message to the specified container.
 * It creates an error icon and a text node, and appends them to the container.
 * @param {HTMLDivElement} container Container element where the error message will be appended.
 * @param {Label|string} message Message to display in the error container, can be a string or a multilingual label object.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 */
const appendError = (
  container: HTMLDivElement,
  message: string | Label, // Label = { [langCode: string]: string }
  state?: FormState
): void => {
  container.innerHTML = "";

  if (message) {
    const icon = document.createElement("img");
    icon.src = "/images/error_icon.svg";
    icon.className = "error-icon";

    icon.onload = () => {
      icon.alt = "error-icon";
      icon.style.display = "inline";
    };

    icon.onerror = () => {
      icon.style.display = "none";
    };

    icon.style.display = "none";

    const textNode = document.createElement("span");
    // If message is object, get multilingual text
    if (typeof message === "object" && state) {
      textNode.textContent = getMultiLangText(state, message);
    } else {
      textNode.textContent = message as string;
    }
    textNode.className = "error-text";

    container.appendChild(icon);
    container.appendChild(textNode);
  }
};

/**
 * Creates a checkbox form element.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and checkbox input.
 */
const createCheckboxField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field checkbox-container ${field.cssClasses?.join(" ") || ""}`;

  const label = document.createElement("label");
  label.htmlFor = field.id;
  label.innerHTML = getLabelText(state, field);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = field.id;
  checkbox.className = "checkbox-input";
  checkbox.name = field.id;
  checkbox.required = Boolean(field.required);
  checkbox.dataset.fieldId = field.id;
  checkbox.checked = Boolean(state.allowedValues?.[field.id] || false);

  if (field.disabled || false) {
    disableField(checkbox);
  }

  const errorContainer = createErrorContainer();

  wrapper.appendChild(checkbox);
  wrapper.appendChild(label);
  // wrapper.appendChild(errorContainer);

  // Optional: Add an event listener to see it working
  checkbox.addEventListener("change", function () {
    let isValid = true;
    let lastError: "required" | number | null = null;
    appendError(errorContainer, "");

    if (field.required && !this.checked) {
      const result = handleRequiredValidation(state, errorContainer);
      lastError = result.lastError;
      isValid = result.isValid;
    }

    state.lastErrors = state.lastErrors || {};
    state.lastErrors[field.id] = lastError;

    checkbox.setCustomValidity(isValid ? "" : "Invalid input");
    checkbox.classList.toggle("error", !isValid);
  });

  const parentNode = document.createElement("div");
  parentNode.className = "form-field-group";

  parentNode.appendChild(wrapper);
  parentNode.appendChild(errorContainer);

  return parentNode;
};

/**
 * Creates a password form element.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and input.
 */
const createPasswordField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field password-container ${field.cssClasses?.join(" ") || ""}`;

  const labelDiv = document.createElement("div");
  labelDiv.className = "label-div-display";

  const label = document.createElement("label");
  label.innerHTML = getLabelText(state, field);
  label.htmlFor = field.id;

  const capsLockSpan = getCapsLockSpan(state, field);

  if (field.info) {
    const infoIcon = createInfoIcon(getMultiLangText(state, field.info));
    label.appendChild(infoIcon);
  }

  labelDiv.appendChild(label);
  labelDiv.appendChild(capsLockSpan);

  wrapper.appendChild(labelDiv);

  const input = document.createElement("input");
  input.className = "input_box password-input";
  input.type = "password";
  input.id = field.id;
  input.name = field.id;
  input.required = Boolean(field.required);
  input.dataset.fieldId = field.id;

  input.placeholder = getMultiLangText(state, field.placeholder);

  const eyeIconSpan = document.createElement("span");
  eyeIconSpan.id = `${field.id}_eye`;
  eyeIconSpan.className = "password-eye-icon";

  let eyeIconImg = createPasswordIcon(false);
  eyeIconSpan.appendChild(eyeIconImg);

  eyeIconSpan.addEventListener("click", () => {
    eyeIconSpan.innerHTML = "";
    if (input.type === "password") {
      input.type = "text";
      eyeIconSpan.appendChild(createPasswordIcon(true));
    } else {
      input.type = "password";
      eyeIconSpan.appendChild(createPasswordIcon(false));
    }
  });

  const errorContainer = createErrorContainer();

  if (field?.capsLockCheck) {
    input.addEventListener("click", (e) => checkCapsLock(e, capsLockSpan));
    input.addEventListener("keyup", (e) => checkCapsLock(e, capsLockSpan));
  }

  const validateInput = () => {
    let isValid = true;
    let lastError: "required" | number | null = null;

    appendError(errorContainer, "");

    const value = input.value.trim();

    // Required validation (multilingual)
    if (field.required && !value) {
      const result = handleRequiredValidation(state, errorContainer);
      lastError = result.lastError;
      isValid = result.isValid;
    }
    // Regex validations
    else if (value && Array.isArray(field.validators)) {
      const result = handleRegexValidation(
        state,
        errorContainer,
        field.validators,
        value,
        false
      );
      lastError = result.lastError;
      isValid = result.isValid;
    }

    state.lastErrors = state.lastErrors || {};
    state.lastErrors[field.id] = lastError;

    input.setCustomValidity(isValid ? "" : "Invalid input");
    input.classList.toggle("error", !isValid);

    validateConfirm();
  };

  input.addEventListener("input", validateInput);

  input.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    state.formData[field.id] = target.value;
    input.dispatchEvent(new Event("input"));
  });

  wrapper.appendChild(input);
  wrapper.appendChild(eyeIconSpan);
  wrapper.appendChild(errorContainer);

  // ---- Confirm Password Field ----

  const confirmId = `${field.id}_confirm`;

  const confirmField = document.createElement("div");
  confirmField.className = "form-field password-container";

  let confirmLabel: Label = {};
  let confirmPlaceholder: Label = {};
  // checking if additionalSchema has confirm field details
  // If it does, use those details; otherwise, build a default confirm label and placeholder
  if (state.additionalSchema && state.additionalSchema[confirmId]) {
    confirmLabel = state.additionalSchema[confirmId].label;
    confirmPlaceholder = state.additionalSchema[confirmId].placeholder;
  } else {
    // If no additionalSchema, take value from label & placeholder of password field
    Object.keys(field.label).forEach((lang) => {
      confirmLabel[lang] = `Confirm ${field.label[lang]}`;
    });

    Object.keys(field.placeholder || {}).forEach((lang) => {
      if (field.placeholder !== undefined) {
        confirmPlaceholder[lang] = `Confirm ${field.placeholder[lang]}`;
      }
    });
  }

  const confirmLabelDiv = document.createElement("div");
  confirmLabelDiv.className = "label-div-display";

  const confirmLabelElement = document.createElement("label");
  confirmLabelElement.htmlFor = confirmId;
  confirmLabelElement.innerHTML = getLabelText(state, field, confirmLabel);

  const confirmCapsLockSpan = getCapsLockSpan(state, field);

  confirmLabelDiv.appendChild(confirmLabelElement);
  confirmLabelDiv.appendChild(confirmCapsLockSpan);

  confirmField.appendChild(confirmLabelDiv);

  const confirmInput = document.createElement("input");
  confirmInput.className = "input_box";
  confirmInput.type = "password";
  confirmInput.id = confirmId;
  confirmInput.name = confirmId;
  confirmInput.required = Boolean(field.required);
  confirmInput.placeholder = getMultiLangText(state, confirmPlaceholder);

  const confirmEyeIconSpan = document.createElement("span");
  confirmEyeIconSpan.id = `${field.id}_confirm_eye`;
  confirmEyeIconSpan.className = "password-eye-icon";

  let confirmEyeIconImg = createPasswordIcon(false);
  confirmEyeIconSpan.appendChild(confirmEyeIconImg);

  confirmEyeIconSpan.addEventListener("click", () => {
    confirmEyeIconSpan.innerHTML = "";
    if (confirmInput.type === "password") {
      confirmInput.type = "text";
      confirmEyeIconSpan.appendChild(createPasswordIcon(true));
    } else {
      confirmInput.type = "password";
      confirmEyeIconSpan.appendChild(createPasswordIcon(false));
    }
  });

  if (field?.capsLockCheck) {
    confirmInput.addEventListener("click", (e) =>
      checkCapsLock(e, confirmCapsLockSpan)
    );
    confirmInput.addEventListener("keyup", (e) =>
      checkCapsLock(e, confirmCapsLockSpan)
    );
  }

  const confirmError = createErrorContainer();

  const validateConfirm = () => {
    appendError(confirmError, "");

    if (confirmInput.value !== input.value) {
      const mismatchErrors = state.fallbackErrors?.passwordMismatch || {};
      const mismatchError =
        getMultiLangText(state, mismatchErrors, true) ||
        "Passwords do not match";

      appendError(confirmError, mismatchError);
      confirmInput.setCustomValidity(mismatchError);
      confirmInput.classList.add("error");
    } else {
      confirmInput.setCustomValidity("");
      confirmInput.classList.remove("error");
    }
  };

  confirmInput.addEventListener("input", validateConfirm);

  confirmInput.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    state.formData[`${field.id}_confirm`] = target.value;
    confirmInput.dispatchEvent(new Event("input"));
  });

  confirmField.appendChild(confirmInput);
  confirmField.appendChild(confirmEyeIconSpan);
  confirmField.appendChild(confirmError);

  const parentNode = document.createElement("div");
  parentNode.className = "form-field-group";
  parentNode.appendChild(wrapper);
  parentNode.appendChild(confirmField);

  return parentNode;
};

/**
 * Creates a date input form element.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and input.
 */
const createDateField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field ${field.cssClasses?.join(" ") || ""}`;

  const label = document.createElement("label");
  label.innerHTML = getLabelText(state, field);
  label.htmlFor = field.id;

  if (field.info) {
    const infoIcon = createInfoIcon(getMultiLangText(state, field.info));
    label.appendChild(infoIcon);
  }

  wrapper.appendChild(label);

  const input = document.createElement("input");
  input.className = "input_box";
  input.type = "date";
  input.id = field.id;
  input.name = field.id;
  input.required = Boolean(field.required);
  input.dataset.fieldId = field.id;

  // Placeholder (optional for date input)
  input.placeholder = getMultiLangText(state, field.placeholder);

  const errorContainer = createErrorContainer();

  const validate = () => {
    let isValid = true;
    let lastError: "required" | null = null;

    appendError(errorContainer, "");

    if (field.required && !input.value) {
      const result = handleRequiredValidation(state, errorContainer);
      lastError = result.lastError;
      isValid = result.isValid;
    }

    state.lastErrors = state.lastErrors || {};
    state.lastErrors[field.id] = lastError;

    input.setCustomValidity(isValid ? "" : "Invalid input");
    input.classList.toggle("error", !isValid);
  };

  input.addEventListener("input", validate);
  input.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    state.formData[field.id] = target.value;
    input.dispatchEvent(new Event("input"));
  });

  wrapper.appendChild(input);
  wrapper.appendChild(errorContainer);

  return wrapper;
};

/**
 * Creates a dropdown select form element.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and select dropdown.
 */
const createDropdownField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field ${field.cssClasses?.join(" ") || ""}`;

  const label = document.createElement("label");
  label.innerHTML = getLabelText(state, field);
  label.htmlFor = field.id;

  if (field.info) {
    const infoIcon = createInfoIcon(getMultiLangText(state, field.info));
    label.appendChild(infoIcon);
  }

  wrapper.appendChild(label);

  const select = document.createElement("select");
  select.className = "input_box select-input";
  select.id = field.id;
  select.name = field.id;
  select.required = Boolean(field.required);
  select.dataset.fieldId = field.id;

  // Placeholder
  const placeholder = document.createElement("option");
  placeholder.className = "select-placeholder";
  placeholder.value = "";
  placeholder.textContent =
    getMultiLangText(state, field.placeholder) || "Select an Option";
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.hidden = true;
  select.appendChild(placeholder);

  // Options
  Object.entries(state.allowedValues[field.id] || {}).forEach(
    ([value, labels]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = getMultiLangText(state, labels);
      select.appendChild(option);
    }
  );

  const errorContainer = createErrorContainer();

  const validateSelect = () => {
    let isValid = true;
    let lastError: "required" | null = null;
    appendError(errorContainer, "");

    if (field.required && !select.value) {
      const result = handleRequiredValidation(state, errorContainer);
      lastError = result.lastError;
      isValid = result.isValid;
    }

    state.lastErrors = state.lastErrors || {};
    state.lastErrors[field.id] = lastError;

    select.setCustomValidity(isValid ? "" : "Invalid input");
    select.classList.toggle("error", !isValid);
  };

  select.addEventListener("change", (e) => {
    const target = e.target as HTMLSelectElement;
    state.formData[field.id] = target.value;
    select.style.color = target.value ? "black" : "";
    validateSelect();
  });

  select.addEventListener("input", validateSelect);

  wrapper.appendChild(select);
  wrapper.appendChild(errorContainer);

  return wrapper;
};

/**
 * This function creates a simple textbox form element that supports multilingual labels and validation.
 * It handles multiple languages, required validation, and regex validation.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and input.
 */
const createSimpleTextbox = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field-group ${field.cssClasses?.join(" ") || ""}`;

  const labelDiv = document.createElement("div");
  labelDiv.className = "label-div-display";

  const mainLabel = document.createElement("label");
  mainLabel.innerHTML = getLabelText(state, field);

  const capsLockSpan = getCapsLockSpan(state, field);

  if (field.info) {
    const infoIcon = createInfoIcon(getMultiLangText(state, field.info));
    mainLabel.appendChild(infoIcon);
  }

  labelDiv.appendChild(mainLabel);
  labelDiv.appendChild(capsLockSpan);

  wrapper.appendChild(labelDiv);

  if (!state.formData[field.id]) {
    state.formData[field.id] = {};
  }

  const languages = Object.keys(field.label || {});

  // Helper to normalize any lang code to 3-letter code if possible
  const normalizeToThreeLetterCode = (
    lang: string,
    languageMap: Record<string, string>
  ) => {
    if (lang.length === 3) return lang; // already 3-letter
    return languageMap[lang] || lang; // map 2-letter → 3-letter, or fallback
  };

  // Normalize mandatory languages once outside the loop
  const normalizedMandatoryLangs = (state.mandatoryLanguages || []).map((l) =>
    normalizeToThreeLetterCode(l, state.languageMap)
  );

  languages.forEach((lang) => {
    const normalizedLang = normalizeToThreeLetterCode(lang, state.languageMap);

    const langWrapper = document.createElement("div");
    langWrapper.className = `form-field lang-${lang}`;

    const input = document.createElement("input");
    input.className = "input_box";
    input.type = "text";
    input.id = `${field.id}_${lang}`;
    input.name = `${field.id}_${lang}`;
    input.dataset.lang = lang;
    input.dataset.fieldId = field.id;

    input.placeholder = getMultiLangText(
      state,
      field.placeholder,
      false,
      normalizedLang,
      state.defaultLanguage
    );

    const errorContainer = createErrorContainer();
    langWrapper.appendChild(input);
    langWrapper.appendChild(errorContainer);
    wrapper.appendChild(langWrapper);

    const validate = () => {
      let isValid = true;
      let lastError: "required" | number | null = null;
      const value = input.value.trim();

      const currentLang = normalizedLang;
      const defaultLang = normalizeToThreeLetterCode(
        state.languageMap[state.defaultLanguage] || state.defaultLanguage,
        state.languageMap
      );

      errorContainer.innerHTML = ""; // Clear previous errors

      // Check if this language is mandatory (normalized)
      const isMandatoryLang = normalizedMandatoryLangs.includes(currentLang);

      // Required validation only for mandatory languages
      if (isMandatoryLang && field.required && !value) {
        const result = handleRequiredValidation(state, errorContainer);
        lastError = result.lastError;
        isValid = result.isValid;
      }
      // Regex validations
      else if (value && isValid && Array.isArray(field.validators)) {
        const result = handleRegexValidation(
          state,
          errorContainer,
          field.validators,
          value,
          true,
          currentLang,
          defaultLang
        );
        lastError = result.lastError;
        isValid = result.isValid;
      }

      // Store value in form state
      (state.formData[field.id] as Record<string, string>)[normalizedLang] =
        input.value;

      // Store last error type
      state.lastErrors = state.lastErrors || {};
      state.lastErrors[`${field.id}_${lang}`] = lastError;

      input.setCustomValidity(isValid ? "" : "Invalid input");
      input.classList.toggle("error", !isValid);
    };

    input.addEventListener("input", validate);
    input.addEventListener("change", validate);
    if (field?.capsLockCheck) {
      input.addEventListener("keyup", (e) => checkCapsLock(e, capsLockSpan));
      input.addEventListener("click", (e) => checkCapsLock(e, capsLockSpan));
    }
  });

  return wrapper;
};

/**
 * Creates a string input form element.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and input.
 */
const createStringField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field ${field.cssClasses?.join(" ") || ""}`;

  const labelDiv = document.createElement("div");
  labelDiv.className = "label-div-display";

  const label = document.createElement("label");
  label.innerHTML = getLabelText(state, field);
  label.htmlFor = field.id;

  const capsLockSpan = getCapsLockSpan(state, field);

  if (field.info) {
    const infoIcon = createInfoIcon(getMultiLangText(state, field.info));
    label.appendChild(infoIcon);
  }

  labelDiv.appendChild(label);
  labelDiv.appendChild(capsLockSpan);

  wrapper.appendChild(labelDiv);

  const input = document.createElement("input");
  input.className = "input_box";
  input.type = "text";
  input.id = field.id;
  input.name = field.id;
  input.required = Boolean(field.required);
  input.dataset.fieldId = field.id;
  input.value = (state.allowedValues[field.id] as string) || "";
  input.placeholder = getMultiLangText(state, field.placeholder);

  if (field.disabled || false) {
    disableField(input);
  }

  const errorContainer = createErrorContainer();

  if (!field.disabled && field?.capsLockCheck) {
    input.addEventListener("click", (e) => checkCapsLock(e, capsLockSpan));
    input.addEventListener("keyup", (e) => checkCapsLock(e, capsLockSpan));
  }

  input.addEventListener("input", () => {
    let isValid = true;
    let lastError: "required" | number | null = null;
    appendError(errorContainer, "");

    const value = input.value.trim();

    if (field.required && !value) {
      const result = handleRequiredValidation(state, errorContainer);
      lastError = result.lastError;
      isValid = result.isValid;
    } else if (value && Array.isArray(field.validators)) {
      const result = handleRegexValidation(
        state,
        errorContainer,
        field.validators,
        value,
        false
      );
      lastError = result.lastError;
      isValid = result.isValid;
    }

    state.lastErrors = state.lastErrors || {};
    state.lastErrors[field.id] = lastError;

    input.setCustomValidity(isValid ? "" : "Invalid input");
    input.classList.toggle("error", !isValid);
  });

  input.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    state.formData[field.id] = target.value;
    input.dispatchEvent(new Event("input"));
  });

  wrapper.appendChild(input);
  wrapper.appendChild(errorContainer);

  return wrapper;
};

/**
 * Creates a form element based on the control type specified in the field.
 * It supports various control types such as textbox, password, date, and dropdown.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form element based on the control type.
 */
const createFormElement = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  // Set default type to 'string' if not specified
  const fieldType = field.type || "string";

  switch (field.controlType) {
    case "textbox":
      return fieldType === "simpleType"
        ? createSimpleTextbox(state, field)
        : createStringField(state, field);
    case "password":
      return createPasswordField(state, field);
    case "date":
      return createDateField(state, field);
    case "dropdown":
      return createDropdownField(state, field);
    case "checkbox":
      return createCheckboxField(state, field);
    default:
      throw new Error(`Unsupported control type: ${field.controlType}`);
  }
};

/**
 * Groups form fields by their alignment group.
 * Each field can belong to a specific alignment group, or be assigned a solo group based on its ID.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @returns {[key: string]: FormField[]} An object where keys are alignment group names and values are arrays of fields in that group.
 */
const groupFields = (state: FormState): { [key: string]: FormField[] } =>
  state.schema.reduce(
    (acc, field) => {
      const group = field.alignmentGroup || `solo_${field.id}`;
      acc[group] = acc[group] || [];
      acc[group].push(field);
      return acc;
    },
    {} as { [key: string]: FormField[] }
  );

/**
 * Gets the current form data from the state.
 * This function returns a copy of the formData object to avoid direct mutations.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @returns {FormData} An object containing the current form data.
 */
const getFormData = (state: FormState): FormData => ({ ...state.formData });

export { JsonFormBuilder };
