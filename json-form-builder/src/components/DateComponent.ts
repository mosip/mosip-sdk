import { FormState, FormField } from "../types";
import { format } from "date-fns";

import {
  getMultiLangText,
  createErrorContainer,
  appendError,
  handleRequiredValidation,
  createInfoIcon,
  getLabelText,
  emptyInvalidFn,
} from "../utils/utils";

/**
 * Creates a date input form element.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and input.
 */
export const createDateField = (
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
  input.oninvalid = emptyInvalidFn(input);
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
    const rawValue = target.value; // e.g., "2025-11-03"

      if (rawValue) {
        const date = new Date(rawValue);
        state.formData[field.id] = format(date, field.format ?? "yyyy/MM/dd");
      } else {
        state.formData[field.id] = "";
      }
    input.dispatchEvent(new Event("input"));
  });

  wrapper.appendChild(input);
  wrapper.appendChild(errorContainer);

  return wrapper;
};
