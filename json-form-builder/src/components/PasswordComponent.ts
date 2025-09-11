import { FormState, FormField, Label } from "../types";
import {
  getMultiLangText,
  createErrorContainer,
  appendError,
  handleRequiredValidation,
  handleRegexValidation,
  enableCapsLockCheck,
  createInfoIcon,
  getCapsLockSpan,
  getLabelText,
} from "../utils/utils";

import { ControlType } from "../utils/constants";

/**
 * Create password visibility icon based on the show parameter.
 * if false, it will show the "visibility" icon which can be used to show password,
 * otherwise it will show the "visibility_off" icon which can be used to hide password.
 * @param {boolean} show Boolean indicating whether to show the password or not.
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
 * Creates a span element containing the password visibility icon.
 * The icon toggles between showing and hiding the password when clicked.
 * @param {HTMLInputElement} input Input HTMLInputElement for which the password icon span is created
 * @param {string} spanId ID for the span element.
 * @returns {HTMLSpanElement} A span element containing the password visibility icon.
 */
const createPasswordIconSpan = (
  input: HTMLInputElement,
  spanId: string
): HTMLSpanElement => {
  const eyeIconSpan = document.createElement("span");
  eyeIconSpan.id = spanId;
  eyeIconSpan.className = "password-eye-icon";

  let eyeIconImg = createPasswordIcon(false);
  eyeIconSpan.appendChild(eyeIconImg);

  eyeIconSpan.addEventListener("click", () => {
    eyeIconSpan.innerHTML = "";
    if (input.type === ControlType.PASSWORD) {
      input.type = "text";
      eyeIconSpan.appendChild(createPasswordIcon(true));
    } else {
      input.type = ControlType.PASSWORD;
      eyeIconSpan.appendChild(createPasswordIcon(false));
    }
  });
  return eyeIconSpan;
};

/**
 * Creates a password form element.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and input.
 */
export const createPasswordField = (
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
  input.type = ControlType.PASSWORD;
  input.id = field.id;
  input.name = field.id;
  input.required = Boolean(field.required);
  input.dataset.fieldId = field.id;

  input.placeholder = getMultiLangText(state, field.placeholder);

  const eyeIconSpan = createPasswordIconSpan(input, `${field.id}_eye`);

  const errorContainer = createErrorContainer();

  enableCapsLockCheck(field, wrapper, input);

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

  let confirmLabel: Label = {};
  let confirmPlaceholder: Label = {};

  if (state.labels && confirmId in state.labels) {
    confirmLabel = { ...state.labels[confirmId] };
  } else {
    for (let lang in field.labelName) {
      confirmLabel[lang] = `Confirm ${field.labelName[lang]}`;
    }
  }

  if (state.placeholders && confirmId in state.placeholders) {
    confirmPlaceholder = { ...state.placeholders[confirmId] };
  } else {
    const placeholdersToConfirm = field.placeholder || {};
    for (const lang in placeholdersToConfirm) {
      confirmPlaceholder[lang] = placeholdersToConfirm[lang]
        ? `Confirm ${placeholdersToConfirm[lang]}`
        : "";
    }
  }

  const confirmField = document.createElement("div");
  confirmField.className = "form-field password-container";

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
  confirmInput.type = ControlType.PASSWORD;
  confirmInput.id = confirmId;
  confirmInput.name = confirmId;
  confirmInput.required = Boolean(field.required);
  confirmInput.placeholder = getMultiLangText(state, confirmPlaceholder);

  const confirmEyeIconSpan = createPasswordIconSpan(
    confirmInput,
    `${field.id}_confirm_eye`
  );

  enableCapsLockCheck(field, confirmField, confirmInput);

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
