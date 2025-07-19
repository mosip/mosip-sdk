import { FormState, FormField, Validator } from "../types";
import {
  getLabelText,
  disableField,
  createErrorContainer,
  appendError,
  handleRequiredValidation,
  createInfoIcon,
  getMultiLangText,
} from "../utils/utils";

/**
 * Create upload icon SVG element.
 * @returns {SVGSVGElement} representing the password visibility icon.
 */
const createUploadIcon = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  svg.setAttribute("viewBox", "0 0 20 18");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "18");
  svg.setAttribute("fill", "none");

  path.setAttribute("id", "upload_file_icon_path");
  path.setAttribute(
    "d",
    "M6.66675 12.3333L10.0001 9M10.0001 9L13.3334 12.3333M10.0001 9V16.5M16.6667 12.9524C17.6847 12.1117 18.3334 10.8399 18.3334 9.41667C18.3334 6.88536 16.2814 4.83333 13.7501 4.83333C13.568 4.83333 13.3976 4.73833 13.3052 4.58145C12.2185 2.73736 10.2121 1.5 7.91675 1.5C4.46497 1.5 1.66675 4.29822 1.66675 7.75C1.66675 9.47175 2.36295 11.0309 3.48921 12.1613"
  );

  path.setAttribute("stroke", "#344054");
  path.setAttribute("stroke-width", "1.66667");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");

  svg.appendChild(path);

  return svg;
};

/**
 * Creates a span element containing upload icon.
 * @param {string} spanId ID for the span element.
 * @param {HTMLInputElement} hiddenFileInput The hidden file input element.
 * @returns {HTMLSpanElement} A span element containing upload icon.
 */
const createUploadIconSpan = (
  spanId: string,
  hiddenFileInput: HTMLInputElement
): HTMLSpanElement => {
  const uploadIconSpan = document.createElement("span");
  uploadIconSpan.id = spanId;
  uploadIconSpan.className = "password-eye-icon";

  let uploadIconImg = createUploadIcon();
  uploadIconSpan.appendChild(uploadIconImg);

  uploadIconSpan.addEventListener("click", () => {
    hiddenFileInput.click();
  });

  return uploadIconSpan;
};

/**
 * Max file size validation handler.
 * Validates the uploaded files against the maximum file size defined in the form state.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {Validator[]} validators Current field validators.
 * @param {FileList} files File uploaded by the user.
 * @param {HTMLDivElement} errorContainer Error container to display validation errors.
 * @returns { lastError: number | null; isValid: boolean } an object containing the last error and validation status.
 */
const handleMaxFileSizeValidation = (
  state: FormState,
  validators: Validator[] | undefined,
  files: FileList,
  errorContainer: HTMLDivElement
): { lastError: number | null; isValid: boolean } => {
  let isValid = true;
  let lastError: number | null = null;

  if (validators?.length) {
    for (let i = 0; i < validators.length; i++) {
      const validator = validators[i];
      if (validator.maxFileSize && files.length > 0) {
        const file = files[0]; // Assuming single file upload
        const maxFileSize = validator.maxFileSize * 1024 * 1024;
        if (file.size > maxFileSize) {
          appendError(
            errorContainer,
            getMultiLangText(state, validator.error) ||
              "File size exceeds limit"
          );
          return { lastError: i, isValid: false };
        }
      }
    }
  }

  return { lastError, isValid };
};

export const createFileField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field file-upload-container ${field.cssClasses?.join(" ") || ""}`;

  const label = document.createElement("label");
  label.innerHTML = getLabelText(state, field);
  label.htmlFor = field.id;

  if (field.info) {
    const infoIcon = createInfoIcon(getMultiLangText(state, field.info));
    label.appendChild(infoIcon);
  }

  const input = document.createElement("input");
  input.className = "input_box file-input";
  input.type = "text";
  input.id = field.id;
  input.name = field.id;
  input.required = Boolean(field.required);
  input.dataset.fieldId = field.id;
  input.placeholder = getMultiLangText(state, field.placeholder);

  disableField(input);

  const hiddenFileInput = document.createElement("input");
  hiddenFileInput.type = "file";
  hiddenFileInput.className = "hidden-file-input";
  hiddenFileInput.accept = field.acceptedFileTypes || "*/*"; // Default to all file types if not specified

  const uploadIconSpan = createUploadIconSpan(
    `${field.id}_upload_icon`,
    hiddenFileInput
  );

  const errorContainer = createErrorContainer();

  wrapper.appendChild(label);
  wrapper.appendChild(input);
  wrapper.appendChild(uploadIconSpan);
  wrapper.appendChild(errorContainer);

  // Optional: Add an event listener to see it working
  input.addEventListener("change", function () {
    let isValid = true;
    let lastError: "required" | number | null = null;
    appendError(errorContainer, "");

    if (field.required && hiddenFileInput.files?.length === 0) {
      const result = handleRequiredValidation(state, errorContainer);
      lastError = result.lastError;
      isValid = result.isValid;
    }

    state.lastErrors = state.lastErrors || {};
    state.lastErrors[field.id] = lastError;

    input.setCustomValidity(isValid ? "" : "Invalid input");
    input.classList.toggle("error", !isValid);
  });

  hiddenFileInput.addEventListener("change", (event) => {
    if (hiddenFileInput.files && hiddenFileInput.files.length > 0) {
      appendError(errorContainer, "");

      // Update the file name display
      const result = handleMaxFileSizeValidation(
        state,
        field.validators,
        hiddenFileInput.files,
        errorContainer
      );

      state.lastErrors = state.lastErrors || {};
      state.lastErrors[field.id] = result.lastError;
      input.classList.toggle("error", !result.isValid);

      input.value = hiddenFileInput.files[0].name;
      state.formData[field.id] = hiddenFileInput.files[0].name; // Store the file name in formData
      state.formData[`${field.id}_file`] = hiddenFileInput.files[0]; // Store the file in formData
    } else {
      input.value = "No file chosen";
    }
  });

  return wrapper;
};
