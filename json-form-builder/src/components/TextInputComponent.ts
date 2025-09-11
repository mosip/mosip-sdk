import { FormState, FormField } from "../types";
import {
  getMultiLangText,
  disableField,
  createErrorContainer,
  appendError,
  handleRequiredValidation,
  handleRegexValidation,
  enableCapsLockCheck,
  createInfoIcon,
  getCapsLockSpan,
  getLabelText,
} from "../utils/utils";

/**
 * Creates a string input form element.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and input.
 */
export const createStringField = (
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

  enableCapsLockCheck(field, wrapper, input);

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

  const parentNode = document.createElement("div");
  parentNode.className = "form-field-group";

  parentNode.appendChild(wrapper);
  
  return parentNode;
};
