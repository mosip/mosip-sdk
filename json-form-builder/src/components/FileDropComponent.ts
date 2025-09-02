import { FormState, FormField, Validator, FileUploadData } from "../types";
import {
  getLabelText,
  disableField,
  createErrorContainer,
  appendError,
  handleRequiredValidation,
  createInfoIcon,
  getMultiLangText,
  getCapsLockSpan,
  enableCapsLockCheck,
  handleRegexValidation,
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
const createUploadIconSpan = (spanId: string): HTMLSpanElement => {
  const uploadIconSpan = document.createElement("span");
  uploadIconSpan.id = spanId;
  uploadIconSpan.className = "upload-icon";

  let uploadIconImg = createUploadIcon();
  uploadIconSpan.appendChild(uploadIconImg);

  return uploadIconSpan;
};

/**
 * Max file size validation handler.
 * Validates the uploaded files against the maximum file size defined in the form state.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FileList} files File uploaded by the user.
 * @param {HTMLDivElement} errorContainer Error container to display validation errors.
 * @returns { lastError: number | null; isValid: boolean } an object containing the last error and validation status.
 */
const handleMaxFileSizeValidation = (
  state: FormState,
  file: File,
  errorContainer: HTMLDivElement
): { lastError: number | null; isValid: boolean } => {
  let isValid = true;
  let lastError: number | null = null;

  if (file.size > state.maxUploadFileSize) {
    appendError(
      errorContainer,
      getMultiLangText(state, state.fallbackErrors.fileSizeExceeded || {}) || "File size exceeds limit"
    );
    return { lastError: 0, isValid: false };
  }

  return { lastError, isValid };
};

/**
 * Validates the file against the field configuration.
 * @param {FormState} state state containing form data and container.
 * @param {FormField} field field configuration object.
 * @param {File} file file to validate.
 * @param {HTMLDivElement} errorContainer error container to display validation errors.
 * @returns { lastError: number | null; isValid: boolean } an object containing the last error and validation status.
 */
const validateFile = (
  state: FormState,
  field: FormField,
  file: File,
  errorContainer: HTMLDivElement
): { lastError: number | null; isValid: boolean } => {
  let isValid = true;
  let lastError: number | null = null;

  // Check for max file size validation
  const maxFileSizeResult = handleMaxFileSizeValidation(
    state,
    file,
    errorContainer
  );

  if (!maxFileSizeResult.isValid) {
    lastError = maxFileSizeResult.lastError;
    isValid = false;
    // appendError(errorContainer, `Max file size exceeded: ${file.name}`);
  }

  const allowedTypes =
    field.acceptedFileTypes?.split(",").map((_) => _.trim()) || [];
  if (!allowedTypes.includes(file.type)) {
    const errorMessage = getMultiLangText(
      state,
      state.fallbackErrors.fileNotSupported || {}
    ) || `File type ${file.type} is not allowed.`;
    appendError(errorContainer, errorMessage);
    lastError = 0; // Assuming 0 is the index for file type validation error
    isValid = false;
  }

  return { lastError, isValid };
};

/**
 * Converts a file to Base64 and updates the form state.
 * @param {FormState} state The current form state containing form data.
 * @param {string} fieldId The ID of the field to update in the form data.
 * @param {File} file The file to convert to Base64.
 */
const convertFileToBase64 = (state: FormState, fieldId: string, file: File) => {
  const fileReader = new FileReader();

  fileReader.onload = (event: any) => {
    if (event.target?.result) {
      (state.formData[fieldId] as FileUploadData).value =
        event.target.result.toString();
      (state.formData[fieldId] as FileUploadData).format = file.type; // Reset docType
    }
  };

  fileReader.onerror = (event) => {
    console.error("FileReader error:", fileReader.error);
  };

  fileReader.readAsDataURL(file);
};

/**
 * Handles file drop event and processes the files.
 * @param {FormState} state The current form state containing form data and container.
 * @param {FormField} field The field configuration object for the file drop component.
 * @param {FileList} files The list of files dropped by the user.
 * @param {HTMLDivElement} fileListContainer The container to display the list of uploaded files.
 * @param {HTMLDivElement} errorContainer The container to display validation errors.
 * @param {boolean} trustedEvent flag to determine whether it is interacted by user or programmatically triggered
 */
const handleFiles = (
  state: FormState,
  field: FormField,
  files: FileList,
  fileListContainer: HTMLDivElement,
  errorContainer: HTMLDivElement,
  trustedEvent: boolean = false
): void => {
  appendError(errorContainer, ""); // Clear previous errors
  const file = files[0];
  if (!file) {
    return;
  }
  // Basic validation for allowed types (as per image text)
  const result = validateFile(state, field, file, errorContainer);
  if (!result.isValid) {
    // If validation fails, append error and skip file
    state.lastErrors = state.lastErrors || {};
    state.lastErrors[field.id] = result.lastError;
    return;
  }

  convertFileToBase64(state, field.id, file);

  // if the event is occurred due to interaction of a user
  // then simulate the upload and show the file
  if (trustedEvent) {
    const fileId = `file-${Date.now()}`;
    addFileItemToDOM(file, fileId, fileListContainer);
    simulateUpload(file, fileId);
  }
};

/**
 * Creates a file item element with file details and upload status.
 * @param {File} file file object containing file details.
 * @param {String} fileId file ID to uniquely identify the file item.
 * @param {HTMLDivElement} fileListContainer container to append the file item.
 */
const addFileItemToDOM = (
  file: File,
  fileId: string,
  fileListContainer: HTMLDivElement
): void => {
  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2); // Convert bytes to MB

  const fileItemHTML = `
      <div class="file-item uploading" id="${fileId}">
          <div class="file-info">
              <i class="far fa-file-alt file-icon"></i>
              <div class="file-details">
                  <span class="file-name">${file.name}</span>
                  <span class="file-size">${fileSizeMB} MB</span>
              </div>
              <i class="fas fa-trash-alt delete-icon" data-file-id="${fileId}"></i>
          </div>
          <div class="file-status">
              <div class="progress-bar-container">
                  <div class="progress-bar" style="width: 0%;"></div>
              </div>
              <span class="progress-percentage">0%</span>
              <span class="status-text">Try again</span> <!-- Hidden by default -->
              <!-- <i class="fas fa-check-circle status-icon success-icon"></i> --> <!-- Hidden by default -->
          </div>
      </div>
  `;
  fileListContainer.innerHTML = fileItemHTML;

  // Add event listener for the delete icon
  const deleteIcon = document.querySelector(`#${fileId} .delete-icon`);
  if (deleteIcon) {
    deleteIcon.addEventListener("click", (event) => {
      if (event.target) {
        const targetFileId = (event.target as any).dataset.fileId;
        const itemToRemove = document.getElementById(targetFileId);
        if (itemToRemove) {
          itemToRemove.remove();
        }
      }
    });
  }
};

/**
 * Simulates file upload progress and updates the UI.
 * @param {File} file The file being uploaded.
 * @param {string} fileId The ID of the file item in the DOM.
 */
const simulateUpload = (file: File, fileId: string): void => {
  const fileItem = document.getElementById(fileId);
  if (!fileItem) return; // Ensure the file item exists

  const progressBar = fileItem.querySelector(".progress-bar");
  if (!progressBar) return; // Ensure the progress bar exists

  const progressPercentage = fileItem.querySelector(".progress-percentage");
  if (!progressPercentage) return; // Ensure the progress percentage exists

  let progress = 0;
  const intervalTime = 50; // Update every 50ms
  const totalSteps = 100; // Simulate 100 steps to reach 100%
  const increment = 100 / totalSteps;

  // Simulate random success or failure (e.g., 80% chance of success)
  let uploadInterval: any;

  uploadInterval = setInterval(() => {
    if (progress < 100) {
      progress += increment;
      if (progress > 100) progress = 100; // Cap at 100
      (progressBar as any).style.width = `${progress}%`;
      progressPercentage.textContent = `${Math.floor(progress)}%`;
    }

    if (progress >= 100) {
      clearInterval(uploadInterval);
      fileItem.classList.remove("uploading"); // Remove uploading state

      fileItem.classList.add("success");
    }
  }, intervalTime);
};

/**
 * Creates a dropdown field for selecting document type.
 * @param {FormState} state state containing form data and container.
 * @param {FormField} field field configuration object.
 * @returns {HTMLDivElement} A div element containing the dropdown field.
 */
const createDropdownField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field ${field.cssClasses?.join(" ") || ""}`;

  const dropdownId = field.id + "-doc-type";

  const label = document.createElement("label");
  label.innerHTML = getLabelText(state, field, state?.labels?.docType);
  label.htmlFor = dropdownId;

  if (field.info) {
    const infoIcon = createInfoIcon(getMultiLangText(state, field.info));
    label.appendChild(infoIcon);
  }

  wrapper.appendChild(label);

  const select = document.createElement("select");
  select.className = "input_box select-input";
  select.id = dropdownId;
  select.name = dropdownId;
  select.required = Boolean(field.required);
  select.dataset.fieldId = dropdownId;

  // Placeholder
  const placeholder = document.createElement("option");
  placeholder.className = "select-placeholder";
  placeholder.value = "";
  placeholder.textContent =
    getMultiLangText(state, state?.placeholders?.docType) || "Select an Option";
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.hidden = true;
  select.appendChild(placeholder);

  // Options
  const docType = field.subType || "POI"
  Object.entries(state.allowedValues[docType] || {}).forEach(
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
    state.lastErrors[dropdownId] = lastError;

    select.setCustomValidity(isValid ? "" : "Invalid input");
    select.classList.toggle("error", !isValid);
  };

  select.addEventListener("change", (e) => {
    const target = e.target as HTMLSelectElement;
    (state.formData[field.id] as FileUploadData).docType = target.value;
    select.style.color = target.value ? "black" : "";
    validateSelect();
  });

  select.addEventListener("input", validateSelect);

  wrapper.appendChild(select);
  wrapper.appendChild(errorContainer);
  return wrapper;
};

/**
 * Creates a string field for entering reference ID.
 * @param {FormState} state state containing form data and container.
 * @param {FormField} field field configuration object.
 * @returns {HTMLDivElement} A div element containing the string field.
 */
const createStringField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field ${field.cssClasses?.join(" ") || ""}`;

  const textFieldId = field.id + "-doc-ref";

  const labelDiv = document.createElement("div");
  labelDiv.className = "label-div-display";

  const label = document.createElement("label");
  label.innerHTML = getLabelText(state, field, state?.labels?.docRef);
  label.htmlFor = textFieldId;

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
  input.id = textFieldId;
  input.name = textFieldId;
  input.dataset.fieldId = textFieldId;
  input.value = (state.allowedValues[textFieldId] as string) || "";
  input.placeholder = getMultiLangText(state, state?.placeholders?.docRef);

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
    state.lastErrors[textFieldId] = lastError;

    input.setCustomValidity(isValid ? "" : "Invalid input");
    input.classList.toggle("error", !isValid);
  });

  input.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    (state.formData[field.id] as FileUploadData).refId = target.value;
    input.dispatchEvent(new Event("input"));
  });

  wrapper.appendChild(input);
  wrapper.appendChild(errorContainer);

  return wrapper;
};

/**
 * Creates file upload dropzone.
 * @param {FormState} state state containing form data and container.
 * @param {FormField} field field configuration object.
 * @returns {HTMLDivElement} A div element containing the string field.
 */
const fileUploadField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const container = document.createElement("div");
  container.className = "form-field drop-container";

  const uploadFieldId = field.id + '-doc-proof'

  const labelDiv = document.createElement("div");
  labelDiv.className = "label-div-display";

  const label = document.createElement("label");
  label.innerHTML = getLabelText(state, field, state?.labels?.proofOfDoc);
  label.htmlFor = uploadFieldId;

  labelDiv.appendChild(label);

  const dropZone = document.createElement("div");
  dropZone.className = "drop-zone";
  dropZone.id = uploadFieldId;

  const uploadIcon = document.createElement("i");
  uploadIcon.className = "fas fa-cloud-upload-alt upload-icon";
  const uploadText = document.createElement("p");
  uploadText.className = "upload-text";
  uploadText.innerHTML =
    getMultiLangText(state, state?.placeholders?.proofOfDoc) ||
    "Click to upload or drag and drop";

  const hiddenFileInput = document.createElement("input");
  hiddenFileInput.type = "file";
  hiddenFileInput.id = field.id + "-doc-file";
  hiddenFileInput.className = "hidden-file-input";
  hiddenFileInput.accept = field.acceptedFileTypes || "*/*";

  dropZone.appendChild(createUploadIconSpan("upload-icon"));
  dropZone.appendChild(uploadText);
  dropZone.appendChild(hiddenFileInput);

  const fileListContainer = document.createElement("div");
  fileListContainer.className = "file-list-container";
  fileListContainer.id = "fileListContainer";

  const errorContainer = createErrorContainer();

  container.appendChild(labelDiv);
  container.appendChild(dropZone);
  container.appendChild(errorContainer);
  container.appendChild(fileListContainer);

  hiddenFileInput.addEventListener("change", (event) => {
    if (hiddenFileInput.files) {
      handleFiles(
        state,
        field,
        hiddenFileInput.files,
        fileListContainer,
        errorContainer,
        event.isTrusted
      );
    }
  });

  // --- Handle Click to Upload ---
  dropZone.addEventListener("click", () => {
    hiddenFileInput.click(); // Trigger the hidden file input click
  });

  // --- Handle Drag and Drop ---
  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault(); // Prevent default to allow drop
    dropZone.classList.add("hover");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("hover");
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault(); // Prevent default file opening
    dropZone.classList.remove("hover");
    if (event.dataTransfer && event.dataTransfer.files) {
      // Handle the dropped files
      handleFiles(
        state,
        field,
        event.dataTransfer.files,
        fileListContainer,
        errorContainer
      );
    }
  });

  return container;
};

export const createFileDropField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  // Initialize form data for the file upload
  (state.formData[field.id] as FileUploadData) = {
    value: "",
    docType: "",
    format: "",
    refId: "",
  };
  // Create the wrapper for all fields
  const wrapper = document.createElement("div");
  wrapper.className = `form-field-group file-upload-section`;

  const label = document.createElement("label");
  label.innerHTML = getLabelText(state, field);

  wrapper.appendChild(label);

  // --- Dropdown field ---
  // with id appended with `-dropdown`
  // This is for the document type selection
  const dropdownDiv = createDropdownField(state, field);
  wrapper.appendChild(dropdownDiv);

  // --- Textbox field ---
  // with id appended with `-text`
  // This is for the reference ID input
  const textboxDiv = createStringField(state, field);
  wrapper.appendChild(textboxDiv);

  // --- File drop area (original logic, using field) ---
  const fileUploadDiv = fileUploadField(state, field);
  wrapper.appendChild(fileUploadDiv);

  return wrapper;
};
