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
  emptyInvalidFn,
} from "../utils/utils";

import { ControlType } from "../utils/constants";
import { eyeCrossedIconSvg, eyeIconSvg } from "../utils/icons";

/**
 * Creates a span element containing the password visibility icon.
 * The icon toggles between showing and hiding the password when clicked.
 */
const createPasswordIconSpan = (
  input: HTMLInputElement,
  spanId: string
): HTMLSpanElement => {
  const eyeIconSpan = document.createElement("span");
  eyeIconSpan.id = spanId;
  eyeIconSpan.className = "password-eye-icon";
  eyeIconSpan.innerHTML = eyeIconSvg;

  const toggleVisibility = () => {
    eyeIconSpan.style.display = input.value ? "flex" : "none";
  };

  eyeIconSpan.addEventListener("click", () => {
    eyeIconSpan.innerHTML = "";
    if (input.type === ControlType.PASSWORD) {
      input.type = "text";
      eyeIconSpan.innerHTML = eyeCrossedIconSvg;
    } else {
      input.type = ControlType.PASSWORD;
      eyeIconSpan.innerHTML = eyeIconSvg;
    }
  });

  input.addEventListener("input", toggleVisibility);

  // Initial state
  toggleVisibility();
  return eyeIconSpan;
};

/**
 * Creates a password form element.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 */
export const createPasswordField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field password-container ${field.cssClasses?.join(" ") || ""}`;

  // Label
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

  // Input + Eye Icon Wrapper
  const inputWrapper = document.createElement("div");
  inputWrapper.className = "password-input-wrapper";

  const input = document.createElement("input");
  input.className = "input_box password-input";
  input.type = ControlType.PASSWORD;
  input.id = field.id;
  input.name = field.id;
  input.oninvalid = emptyInvalidFn(input);
  input.dataset.fieldId = field.id;
  input.placeholder = getMultiLangText(state, field.placeholder);

  if (
    state.allowedValues[field.id] &&
    typeof state.allowedValues[field.id] === "string"
  ) {
    input.value = (state.allowedValues[field.id] as string).trim();
  }

  const eyeIconSpan = createPasswordIconSpan(input, `${field.id}_eye`);

  const errorContainer = createErrorContainer();

  inputWrapper.appendChild(input);
  inputWrapper.appendChild(eyeIconSpan);

  enableCapsLockCheck(field, wrapper, input);

  const validateInput = () => {
    let isValid = true;
    let lastError: "required" | number | null = null;

    appendError(errorContainer, "");
    const value = input.value.trim();

    if (field.required && !value) {
      const result = handleRequiredValidation(state, errorContainer);
      lastError = result.lastError;
      isValid = result.isValid;
    } else if (value && Array.isArray(field.validators)) {
      const result = handleRegexValidation(state, errorContainer, field.validators, value, false);
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

  wrapper.appendChild(inputWrapper);
  wrapper.appendChild(errorContainer);

  // ---- Confirm Password ----
  const confirmId = `${field.id}_confirm`;
  let confirmLabel: Label = {};
  let confirmPlaceholder: Label = {};

  if (state.labels && confirmId in state.labels) {
    confirmLabel = { ...state.labels[confirmId] };
  } else {
    for (const lang in field.labelName) {
      confirmLabel[lang] = `Confirm ${field.labelName[lang]}`;
    }
  }

  if (state.placeholders && confirmId in state.placeholders) {
    confirmPlaceholder = { ...state.placeholders[confirmId] };
  } else {
    const placeholdersToConfirm = field.placeholder || {};
    for (const lang in placeholdersToConfirm) {
      confirmPlaceholder[lang] = placeholdersToConfirm[lang] ? `Confirm ${placeholdersToConfirm[lang]}` : "";
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

  // Confirm Input + Eye Icon
  const confirmInputWrapper = document.createElement("div");
  confirmInputWrapper.className = "password-input-wrapper";

  const confirmInput = document.createElement("input");
  confirmInput.className = "input_box";
  confirmInput.type = ControlType.PASSWORD;
  confirmInput.id = confirmId;
  confirmInput.name = confirmId;
  confirmInput.oninvalid = emptyInvalidFn(confirmInput);
  confirmInput.placeholder = getMultiLangText(state, confirmPlaceholder);

  const confirmEyeIconSpan = createPasswordIconSpan(confirmInput, `${field.id}_confirm_eye`);

  confirmInputWrapper.appendChild(confirmInput);
  confirmInputWrapper.appendChild(confirmEyeIconSpan);

  enableCapsLockCheck(field, confirmField, confirmInput);

  const confirmError = createErrorContainer();

  const validateConfirm = () => {
    appendError(confirmError, "");
    const value = confirmInput.value.trim();
    let isValid = true;
    let lastError: "required" | "mismatch" | number | null = null;
    const touched = confirmInput.dataset.touched === "true";

    if (field.required && !value) {
      const prevError = state.lastErrors?.[confirmId];
      if (!touched && !state.isSubmitting && prevError == null) {
        confirmInput.setCustomValidity("");
        confirmInput.classList.remove("error");
        state.lastErrors = state.lastErrors || {};
        state.lastErrors[confirmId] = null;
        return;
      }
      const result = handleRequiredValidation(state, confirmError);
      lastError = result.lastError;
      isValid = result.isValid;
    } else if (value && value !== input.value) {
      const mismatchErrors = state.fallbackErrors?.passwordMismatch || {};
      const mismatchError = getMultiLangText(state, mismatchErrors, true) || "Passwords do not match";
      appendError(confirmError, mismatchError);
      confirmInput.setCustomValidity(mismatchError);
      confirmInput.classList.add("error");
      lastError = "mismatch";
      isValid = false;
    } else {
      confirmInput.setCustomValidity("");
      confirmInput.classList.remove("error");
    }

    state.lastErrors = state.lastErrors || {};
    state.lastErrors[confirmId] = lastError;
  };

  confirmInput.addEventListener("input", (ev: Event) => {
    if ((ev as Event).isTrusted) confirmInput.dataset.touched = "true";
    validateConfirm();
  });

  confirmInput.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    state.formData[`${field.id}_confirm`] = target.value;
    confirmInput.dispatchEvent(new Event("input", { bubbles: true }));
  });

  confirmField.appendChild(confirmInputWrapper);
  confirmField.appendChild(confirmError);

  // Parent
  const parentNode = document.createElement("div");
  parentNode.className = "form-field-group";
  parentNode.appendChild(wrapper);
  parentNode.appendChild(confirmField);

  return parentNode;
};
