import { FileUploadData, FormState, SubTypeField } from "../types";
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
 * @param {SubTypeField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and select dropdown.
 */
export const createDropdownField = (
  state: FormState,
  field: SubTypeField,
  isSubComponent = false
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
  select.dataset.fieldId = field.id;

  if (field.disabled) {
    select.disabled = true;
  }

  // Placeholder
  const placeholder = document.createElement("option");
  placeholder.className = "select-placeholder";
  placeholder.value = "";
  placeholder.textContent =
    getMultiLangText(state, field.placeholder) || "Select an Option";
  placeholder.disabled = false;
  select.appendChild(placeholder);

  // Options
  const optionSource =
    (state.allowedValues?.[field.subType] ??
      state.allowedValues?.[field.id]) || {};

  Object.entries(optionSource).forEach(([value, labels]) => {
    const option = document.createElement("option");
    option.className = "select-option";
    option.value = value;
    option.textContent = getMultiLangText(state, labels);
    select.appendChild(option);
  });

  if (
    state.prefilledValues &&
    typeof state.prefilledValues[field.id] === "string"
  ) {
    const prefill = (state.prefilledValues[field.id] as string).trim();

    let matchedKey = "";

    for (const [key, labels] of Object.entries(optionSource)) {
      if (
        key === prefill ||
        Object.values(labels as Record<string, string>).includes(prefill)
      ) {
        matchedKey = key;
        break;
      }
    }

    if (matchedKey) {
      select.value = matchedKey;
      state.formData[field.id] = matchedKey;
    } else {
      select.value = "";
    }
  }

  const errorContainer = createErrorContainer();

  const validateSelect = () => {
    let isValid = true;
    let lastError: "required" | null = null;
    appendError(errorContainer, "");

    const parentId = field.id.replace("_docType", "");

    const parentData = state.formData[parentId] as FileUploadData | undefined;
    const isFileUploaded = !!parentData?.value;
    const hasDocType = !!select.value;

    // If the dropdown is related to a file upload's docType, it should be required if a file is uploaded or a docType is selected
    // This ensures that if a user uploads a file, they must select a docType, and if they select a docType, they must upload a file
    // For other dropdowns, the required validation is based solely on the field's required property
    const shouldBeRequired = !!field.required || isFileUploaded || hasDocType;

    if (shouldBeRequired && !select.value) {
      const result = handleRequiredValidation(state, errorContainer);
      lastError = result.lastError;
      isValid = result.isValid;
    }

    state.lastErrors = state.lastErrors || {};
    state.lastErrors[field.id] = lastError;

    select.classList.toggle("error", !isValid);
  };

  select.addEventListener("change", (e) => {
    const target = e.target as HTMLSelectElement;
    const value = target.value || "";
    if (!isSubComponent) {
      state.formData[field.id] = value;
    }

    select.style.color = target.value ? "black" : "";
    validateSelect();
  });

  select.addEventListener("input", validateSelect);

  wrapper.appendChild(select);
  wrapper.appendChild(errorContainer);

  return wrapper;
};
