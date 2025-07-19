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
 * @param {Validator[]} validators Current field validators.
 * @param {FileList} files File uploaded by the user.
 * @param {HTMLDivElement} errorContainer Error container to display validation errors.
 * @returns { lastError: number | null; isValid: boolean } an object containing the last error and validation status.
 */
const handleMaxFileSizeValidation = (
  state: FormState,
  validators: Validator[] | undefined,
  file: File,
  errorContainer: HTMLDivElement
): { lastError: number | null; isValid: boolean } => {
  let isValid = true;
  let lastError: number | null = null;

  if (validators?.length) {
    for (let i = 0; i < validators.length; i++) {
      const validator = validators[i];
      if (validator.maxFileSize && file) {
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
    field.validators,
    file,
    errorContainer
  );
  if (!maxFileSizeResult.isValid) {
    lastError = maxFileSizeResult.lastError;
    isValid = false;
    appendError(errorContainer, `Max file size exceeded: ${file.name}`);
  }

  const allowedTypes =
    field.acceptedFileTypes?.split(",").map((_) => _.trim()) || [];
  if (!allowedTypes.includes(file.type)) {
    appendError(errorContainer, `File type ${file.type} is not allowed.`);
    lastError = 0; // Assuming 0 is the index for file type validation error
    isValid = false;
  }

  return { lastError, isValid };
};

const convertFileToBase64 = (state: FormState, fieldId: string, file: File) => {
  const fileReader = new FileReader();

  fileReader.onload = (event: any) => {
    if (event.target?.result) {
      state.formData[fieldId] = event.target.result.toString();
    }
  };

  fileReader.onerror = (event) => {
    console.error("FileReader error:", fileReader.error);
  };

  fileReader.readAsDataURL(file);
};

const handleFiles = (
  state: FormState,
  field: FormField,
  files: FileList,
  fileListContainer: HTMLDivElement,
  errorContainer: HTMLDivElement
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
  
  state.formData[field.id] = {};

  convertFileToBase64(state, field.id, file);

  const fileId = `file-${Date.now()}`;
  addFileItemToDOM(file, fileId, fileListContainer);
  simulateUpload(file, fileId);
};

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
  fileListContainer.insertAdjacentHTML("beforeend", fileItemHTML);

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

const simulateUpload = (file: File, fileId: string): void => {
  const fileItem = document.getElementById(fileId);
  if (!fileItem) return; // Ensure the file item exists

  const progressBar = fileItem.querySelector(".progress-bar");
  if (!progressBar) return; // Ensure the progress bar exists

  const progressPercentage = fileItem.querySelector(".progress-percentage");
  if (!progressPercentage) return; // Ensure the progress percentage exists

  const statusText = fileItem.querySelector(".status-text");
  const successIcon = fileItem.querySelector(".success-icon");

  let progress = 0;
  const intervalTime = 50; // Update every 50ms
  const totalSteps = 100; // Simulate 100 steps to reach 100%
  const increment = 100 / totalSteps;

  // Simulate random success or failure (e.g., 80% chance of success)
  const isSuccess = Math.random() < 0.8;
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

      if (isSuccess) {
        fileItem.classList.add("success");
      } else {
        fileItem.classList.add("error");
      }
    }
  }, intervalTime);
};

export const createFileDropField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field file-upload-container ${field.cssClasses?.join(" ") || ""}`;

  const container = document.createElement("div");
  container.className = "drop-container";

  const dropZone = document.createElement("div");
  dropZone.className = "drop-zone";
  dropZone.id = field.id;

  const uploadIcon = document.createElement("i");
  uploadIcon.className = "fas fa-cloud-upload-alt upload-icon";
  const uploadText = document.createElement("p");
  uploadText.className = "upload-text";
  uploadText.innerHTML =
    getMultiLangText(state, field.placeholder) ||
    "Click to upload or drag and drop";

  const hiddenFileInput = document.createElement("input");
  hiddenFileInput.type = "file";
  hiddenFileInput.id = "fileInput";
  hiddenFileInput.className = "hidden-file-input";
  hiddenFileInput.accept = field.acceptedFileTypes || "*/*"; // Default to all file types if not specified

  dropZone.appendChild(createUploadIconSpan("upload-icon"));
  dropZone.appendChild(uploadText);
  dropZone.appendChild(hiddenFileInput);

  const fileListContainer = document.createElement("div");
  fileListContainer.className = "file-list-container";
  fileListContainer.id = "fileListContainer";

  const errorContainer = createErrorContainer();

  container.appendChild(dropZone);
  container.appendChild(errorContainer);
  container.appendChild(fileListContainer);

  wrapper.appendChild(container);

  hiddenFileInput.addEventListener("change", (event) => {
    if (hiddenFileInput.files) {
      handleFiles(
        state,
        field,
        hiddenFileInput.files,
        fileListContainer,
        errorContainer
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

  return wrapper;
};
