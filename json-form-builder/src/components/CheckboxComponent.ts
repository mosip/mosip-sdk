import { FormField, FormState } from "../types";
import {
  appendError,
  createErrorContainer,
  disableField,
  emptyInvalidFn,
  getLabelText,
  handleRequiredValidation,
} from "../utils/utils";

/**
 * Creates a checkbox form element.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and checkbox input.
 */
export const createCheckboxField = (
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
  checkbox.oninvalid = emptyInvalidFn(checkbox);
  checkbox.dataset.fieldId = field.id;

  if (field.disabled || false) {
    disableField(checkbox);
  }

  if (
    state.prefilledValues && state.prefilledValues[field.id] &&
    typeof state.prefilledValues[field.id] === "boolean"
  ) {
    checkbox.checked = Boolean(state.prefilledValues?.[field.id] || false);
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
    state.formData[field.id] = this.checked;
  });

  const parentNode = document.createElement("div");
  parentNode.className = "form-field-group";

  parentNode.appendChild(wrapper);
  wrapper.appendChild(errorContainer);

  return parentNode;
};
