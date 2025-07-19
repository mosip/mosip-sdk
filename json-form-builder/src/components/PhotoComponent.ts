import { FormState, FormField } from "../types";
import {
  getLabelText,
  disableField,
  createErrorContainer,
  appendError,
  handleRequiredValidation,
} from "../utils/utils";

export const createPhotoField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field photo-container ${field.cssClasses?.join(" ") || ""}`;

  const label = document.createElement("label");
  label.htmlFor = field.id;
  label.innerHTML = getLabelText(state, field);

  const input = document.createElement("input");
  input.type = "file";
  input.id = field.id;
  input.name = field.id;
  input.required = Boolean(field.required);
  input.dataset.fieldId = field.id;
  input.accept = "image/*"; // Accept only image files

  if (field.disabled || false) {
    disableField(input);
  }

  const errorContainer = createErrorContainer();

  wrapper.appendChild(label);
  wrapper.appendChild(input);
  wrapper.appendChild(errorContainer);

  // Optional: Add an event listener to see it working
  input.addEventListener("change", function () {
    let isValid = true;
    let lastError: "required" | number | null = null;
    appendError(errorContainer, "");

    if (field.required && !this.files?.length) {
      const result = handleRequiredValidation(state, errorContainer);
      lastError = result.lastError;
      isValid = result.isValid;
    }

    state.lastErrors = state.lastErrors || {};
    state.lastErrors[field.id] = lastError;

    input.setCustomValidity(isValid ? "" : "Invalid input");
    input.classList.toggle("error", !isValid);
  });

  return wrapper;
};
