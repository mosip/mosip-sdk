import { FormState, FormField } from "../types";
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
 * Creates a dropdown select form element.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and select dropdown.
 */
export const createDropdownField = (
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
  select.oninvalid = emptyInvalidFn(select);
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
      option.className = "select-option";
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
