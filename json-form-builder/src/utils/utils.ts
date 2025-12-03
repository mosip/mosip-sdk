import { errorIconSvg, infoIconSvg } from "./icons";
import {
  FormField,
  FormState,
  KeyValuePair,
  Label,
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
    const icon = document.createElement("span");
    icon.innerHTML = errorIconSvg;
    icon.className = "error-icon";

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
 * Create Info icon for a form field
 * @param {string} infoMessage The message to display in the info icon tooltip.
 * @returns {HTMLSpanElement} Returns a span element containing the info icon and tooltip.
 */
const createInfoIcon = (infoMessage: string): HTMLSpanElement => {
  const infoContainer = document.createElement("span");
  infoContainer.className = "info-container";

  const infoSpan = document.createElement("span");
  infoSpan.className = "info-icon";
  infoSpan.tabIndex = 0; // allow keyboard focus
  infoSpan.innerHTML = infoIconSvg;

  const infoDetail = document.createElement("div");
  infoDetail.className = "info-detail";
  infoDetail.setAttribute("aria-hidden", "true");

  const infoDetailArrow = document.createElement("span");
  infoDetailArrow.className = "info-detail-arrow";
  infoDetailArrow.innerHTML = `<svg class="fill-[#FFFFFF] stroke-[#BCBCBC]" width="10" height="5" viewBox="0 0 30 10" preserveAspectRatio="none" style="display: block;"><polygon points="0,0 30,0 15,10"></polygon></svg>`;

  const showInfo = () => {
    hideAllInfo();
    infoDetail.classList.add("active");
    infoDetail.setAttribute("aria-hidden", "false");
  };

  const hideInfo = () => {
    infoDetail.classList.remove("active");
    infoDetail.setAttribute("aria-hidden", "true");
  };

  const hideAllInfo = () => {
    document.querySelectorAll(".info-detail.active").forEach((detail) => {
      detail.classList.remove("active");
      detail.setAttribute("aria-hidden", "true");
    });
  };

  // ---------------------------
  // Hover behavior
  // ---------------------------
  infoSpan.addEventListener("mouseenter", () => {
    showInfo();
  });

  infoSpan.addEventListener("mouseleave", () => {
    hideInfo();
  });

  // ---------------------------
  // Keyboard focus behavior
  // ---------------------------
  infoSpan.addEventListener("focus", () => {
    showInfo();
  });

  infoSpan.addEventListener("blur", () => {
    hideInfo();
  });

  // Optional: ESC key hides it
  infoSpan.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideInfo();
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
    capsInfoIcon.innerHTML = infoIconSvg;
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
  input: HTMLInputElement | HTMLTextAreaElement
) => {
  if (!field.disabled && field?.capsLockCheck) {
    const capsLockSpan = wrapper.querySelector(
      ".caps-lock-span"
    ) as HTMLSpanElement;
    if (capsLockSpan) {
      input.addEventListener("click", (e) => checkCapsLock(e as MouseEvent, capsLockSpan));
      input.addEventListener("keyup", (e) => checkCapsLock(e as KeyboardEvent, capsLockSpan));
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
const disableField = (field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): void => {
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
  const twoWayMap: Record<string, string> = {};

  for (const [key, value] of Object.entries(oneWayMap)) {
    // forward
    twoWayMap[key] = value;

    // backward (only if not already mapped)
    if (!(value in twoWayMap)) {
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
      switch (input.type) {
        case "checkbox":
          state.formData[input.id] = input.checked;
          break;
        case "radio": {
          if (!input.checked) break;

          const fieldId = input.name || input.id;
          if (!fieldId) break;

          const fieldDef = state.schema.find(f => f.id === fieldId);
          if (!fieldDef) break;

          const originalKey = input.dataset.originalValue || input.value;

          const allOptions = state.allowedValues?.[fieldId];

          // Narrow the union type
          if (!allOptions || typeof allOptions !== "object") {
            state.formData[fieldId] = originalKey;
            break;
          }

          const optionLabels = (allOptions as Record<string, Label>)[originalKey];

          if (fieldDef.type === "simpleType") {
            // SIMPLE TYPE = multilingual array
            state.formData[fieldId] = state.mandatoryLanguages.map((lng) => {
              const mappedLng = state.languageMap[lng] || lng;
              return {
                language: mappedLng.length === 3 ? mappedLng : lng,
                value: optionLabels?.[lng] || optionLabels?.[mappedLng] || ""
              };
            });
          } else {
            const mandatoryLangs: string[] = state?.mandatoryLanguages || [];
            const firstMandatory = mandatoryLangs[0];

            // fallback: use langMap if needed
            const mappedMandatory = (state.languageMap && state.languageMap[firstMandatory])
              ? state.languageMap[firstMandatory]
              : firstMandatory;

            // assign final value
            state.formData[fieldId] =
              optionLabels?.[firstMandatory] ||
              optionLabels?.[mappedMandatory] ||
              originalKey;
          }
          break;
        }
        case "date":
          break;
        default:
          if (input.value) {
            state.formData[input.id] =
              (state.formData[`${input.id}_prefix`] || "") + input.value;
          }
      }
    }
  });

  for (const field of state.schema) {
    if (
      field.required &&
      field.required === true &&
      hasFormData(field, state) === false
    ) {
      isFormValid = false;
      break;
    }
  }

  return isFormValid;
};

/**
 * Checks whether a form field contains valid user-entered data.
 *
 * Behavior varies based on the control type:
 * - For SIMPLE_TYPE (multilingual) fields: verifies that every mandatory language 
 *   contains a non-empty value.
 * - For all other field types: checks if the field contains a non-empty or valid value 
 *   depending on its control type (text, date, dropdown, radio, etc.).
 *
 * @param {FormField} formField 
 *        The form field definition containing id, type, required flag, and other metadata.
 *
 * @param {FormState} state 
 *        The current form state containing formData, mandatoryLanguages, and field configurations.
 *
 * @returns {boolean}
 *          Returns `true` when the field has data according to its type rules;
 *          returns `false` when the field is empty or missing required multilingual values.
 */

const hasFormData = (
  formField: FormField,
  state: FormState,
): boolean => {
  let hasFormData = true;
  const inputId = formField.id;
  const value = state.formData[inputId];
  const confirmId = `${inputId}_confirm`;
  const confirmPass = confirmId in state.formData ? state.formData[confirmId] : null;

  if (formField.type === "simpleType") {
    // For simpleType, value is expected to be an array of KeyValuePair
    if (!value || !Array.isArray(value) || value.length === 0) {
      return false;
    }

    const langMap = state.languageMap || {};

    // Normalize to 3-letter codes ALWAYS
    const normalize = (lng: string) => {
      lng = lng.toLowerCase();
      return (lng.length === 3 ? langMap[lng] : lng).toLowerCase();
    };

    // required languages in 3 letter form
    const required = state.mandatoryLanguages.map(normalize);

    // submitted languages in 3 letter form
    const submitted = value
      .filter(v => v.value && v.value.trim().length > 0)
      .map(v => normalize(v.language));

    // Check if all mandatory languages present
    return required.every(r => submitted.includes(r));
  }

  switch (formField.controlType) {
    case "textbox":
    case "textarea":
    case "date":
    case "dropdown":
    case "phone":
      if (checkNotAStringValue(value)) {
        hasFormData = false;
      }
      break;
    case "radio":
      if (!value || value === "") {
        hasFormData = false;
      }
      break;
    case "password":
      if (checkNotAStringValue(value) || checkNotAStringValue(confirmPass)) {
        hasFormData = false;
      }
      break;
    case "checkbox":
      if (value !== true) {
        hasFormData = false;
      }
      break;
    case "photo":
      if (!value || (typeof value === "object" && "value" in value && value.value === "")) {
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
  input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
): (() => void) => {
  return () => {
    input.setCustomValidity("");
  };
};

// Convert MIME → clean extension
const mimeToExtension = (mime: string): string => {
  const specialMap: Record<string, string> = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx"
  };

  // If special format → return readable extension
  if (specialMap[mime]) return specialMap[mime];

  // Generic fallback: image/png → png
  if (mime.includes("/")) {
    return mime
      .split("/")[1]
      .replace("+xml", "")
      .replace("xml", "");
  }

  return "";
};

// Create accept string (for file input)
const getAcceptString = (allowedTypes: string[]): string => {
  return allowedTypes
    .map(type => {
      const ext = mimeToExtension(type);
      return ext ? `.${ext}` : "";
    })
    .filter(Boolean)
    .join(",");
};

// Convert MIME → user-friendly label for info text
const mimeToLabel = (mime: string): string => {
  const ext = mimeToExtension(mime);
  return ext.toUpperCase();
};

export {
  getLabelText,
  getMultiLangText,
  appendError,
  handleRequiredValidation,
  handleRegexValidation,
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
  getAcceptString,
  mimeToLabel
};
