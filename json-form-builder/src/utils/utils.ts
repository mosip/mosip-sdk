import {
  FormField,
  FormState,
  KeyValuePair,
  Label,
  FormData,
  FormValue,
} from "../types";
type LabelObject = Record<string, string>;

/**
 * Helps to get the label text for a form field, including a required indicator if the field is marked as required.
 * @param {FormState} state form state containing current language and default language
 * @param {FormField | null} field form field object containing label and required properties
 * @param {LabelObject} additionalLabel Optional additional label object to use instead of the field's label.
 * @returns {string} The label text for the field, including a required indicator if applicable.
 */
const getLabelText = (
  state: FormState,
  field: FormField | null,
  additionalLabel?: LabelObject
): string => {
  const lang = state.currentLanguage;
  const defaultLang = state.defaultLanguage;

  const labels = additionalLabel || field?.labelName;

  let labelText = getMultiLangText(state, labels, false, lang, defaultLang);

  if (field?.required) {
    labelText += '<span class="required">*</span>';
  }

  return labelText;
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
  currentLang?: string,
  defaultLang?: string 
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
      state.languageMap[state.currentLanguage] || state.currentLanguage;
  }

  const normalizedLang = normalizeToThreeLetterCode(
    currentLang,
    state.languageMap
  );
  const normalizedDefaultLang = normalizeToThreeLetterCode(
    defaultLang,
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
      const errorMsg =
        getMultiLangText(
          state,
          validator.error,
          true,
          normalizedDefaultLang,
          defaultLang
        ) || "Invalid input";

      appendError(errorContainer, errorMsg);
      return { lastError: i, isValid: false };
    }
  }

  return { lastError: null, isValid: true };
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
 * @param {string} infoMessage The message to display in the info icon tooltip.
 * @returns {HTMLSpanElement} Returns a span element containing the info icon and tooltip.
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
) => {
  if ("getModifierState" in event) {
    capsLockSpan.style.display = event.getModifierState("CapsLock")
      ? "inline-flex"
      : "none";
  }
};

/**
 * Enables caps lock check for a form field.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @param {HTMLDivElement} wrapper Wrapper HTMLDivElement that contains the form field.
 * @param {HTMLInputElement} input Input HTMLInputElement that will have the caps lock check enabled.
 */
const enableCapsLockCheck = (
  field: FormField,
  wrapper: HTMLDivElement,
  input: HTMLInputElement
) => {
  if (!field.disabled && field?.capsLockCheck) {
    const capsLockSpan = wrapper.querySelector(
      ".caps-lock-span"
    ) as HTMLSpanElement;
    if (capsLockSpan) {
      input.addEventListener("click", (e) => checkCapsLock(e, capsLockSpan));
      input.addEventListener("keyup", (e) => checkCapsLock(e, capsLockSpan));
    }
  }
};

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
 * Creates a new div element to be used as an error container.
 * @returns {HTMLDivElement} A new div element to be used as an error container.
 */
const createErrorContainer = (): HTMLDivElement => {
  const errorContainer = document.createElement("div");
  errorContainer.className = "error-message";
  return errorContainer;
};

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

const dataUrlToBlob = (dataUrl: string): Blob => {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

/**
 * Validate Form
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @returns {boolean}  Returns true if the form is valid, false otherwise.
 */
const validateForm = (state: FormState): boolean => {
  let isFormValid = true;
  const form = state.container.querySelector("form") as HTMLFormElement;

  const errorList = form.querySelectorAll(
    ".form-field .error-message .error-text"
  );

  if (errorList && errorList.length > 0) {
    return false;
  }

  form.querySelectorAll("input:not([type='hidden'])").forEach((el) => {
    const input = el as HTMLInputElement;
    const fieldId = input.dataset.fieldId;
    const lang = input.dataset.lang;

    if (fieldId && lang) {
      // Always normalize to 3-letter code
      const normalizedLang = state.languageMap[lang];

      // Store only if normalization results in a valid 3-letter code
      if (normalizedLang && normalizedLang.length === 3) {
        if (!state.formData[fieldId]) {
          state.formData[fieldId] = [];
        }
        if (input.value) {
          (state.formData[fieldId] as KeyValuePair[]).push({
            language: normalizedLang,
            value: input.value,
          });
        }
      }
    } else if (input.id) {
      // Handle regular fields
      if (input.type === "checkbox") {
        state.formData[input.id] = input.checked;
      } else if (input.type === "date") {
         //TODO
      } else if (input.value) {
               state.formData[input.id] =
                 (state.formData[`${input.id}_prefix`] || "") + input.value;
      }
    }
  });

  for (const field of state.schema) {
    if (
      field.required &&
      field.required === true &&
      hasFormData(field, state.formData, state.mandatoryLanguages) === false
    ) {
      isFormValid = false;
      break;
    }
  }

  return isFormValid;
};

/**
 * Checks if the form field has data based on its control type and mandatory languages.
 * @param {FormField} formField form field object containing type, id, label, required, and other properties.
 * @param {FormData} formData Current form data containing values for each form field.
 * @param {string[]} mandatoryLanguages  List of mandatory language codes.
 * @returns {boolean}  Returns true if the form field has data, false otherwise.
 */
const hasFormData = (
  formField: FormField,
  formData: FormData,
  mandatoryLanguages: string[]
): boolean => {
  let hasFormData = true;
  const inputId = formField.id;
  const value = formData[inputId];
  const confirmId = `${inputId}_confirm`;
  const confirmPass = confirmId in formData ? formData[confirmId] : null;
  const mandatoryLangs = mandatoryLanguages.map((lang) => lang.toLowerCase());
  if (formField.type === "simpleType") {
    // For simpleType, value is expected to be an array of KeyValuePair
    if (value && Array.isArray(value) && value.length > 0) {
      // Check if all mandatory languages are present
      for (const val of value) {
        const indexLangCode = mandatoryLangs.indexOf(
          val.language.toLowerCase()
        );
        // If language code is found and value is non-empty, remove it from mandatoryLangs
        if (indexLangCode > -1 && val.value && val.value.trim().length > 0) {
          mandatoryLangs.splice(indexLangCode, 1);
        }
      }
      // If all mandatory languages are present
      // then will be removed from mandatoryLangs array
      if (mandatoryLangs.length === 0) {
        return true;
      }
    }
    return false;
  }

  switch (formField.controlType) {
    case "textbox":
    case "date":
    case "dropdown":
    case "phone":
      if (checkNotAStringValue(value)) {
        hasFormData = false;
      }
      break;
    case "password":
      if (checkNotAStringValue(value)) {
        hasFormData = false;
      }
      if (checkNotAStringValue(confirmPass)) {
        hasFormData = false;
      }
      break;
    case "checkbox":
      if (value !== true) {
        hasFormData = false;
      }
      break;
    case "photo":
      if (
        !value ||
        (value &&
          typeof value === "object" &&
          "value" in value &&
          value.value === "")
      ) {
        hasFormData = false;
      }
      break;
  }
  return hasFormData;
};

/**
 * Checks if a value is not a valid string.
 * @param {string | null | undefined} val - The value to check.
 * @returns {boolean} - Returns true if the value is not a valid string, false otherwise.
 */
const checkNotAStringValue = (val: FormValue | null | undefined): boolean => {
  return (
    val === null ||
    val === undefined ||
    (typeof val === "string" && val.trim().length === 0)
  );
};

const emptyInvalidFn = (
  input: HTMLInputElement | HTMLSelectElement
): (() => void) => {
  return () => {
    input.setCustomValidity("");
  };
};

export {
  getLabelText,
  getMultiLangText,
  appendError,
  handleRequiredValidation,
  handleRegexValidation,
  createInfoIconSvg,
  createInfoIcon,
  getCapsLockSpan,
  checkCapsLock,
  disableField,
  preventDefaultFn,
  createErrorContainer,
  buildBidirectionalLanguageMap,
  enableCapsLockCheck,
  dataUrlToBlob,
  validateForm,
  emptyInvalidFn,
};
