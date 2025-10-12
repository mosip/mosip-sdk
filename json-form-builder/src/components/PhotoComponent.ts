import { FormState, FormField, FileUploadData } from "../types";
import {
  getLabelText,
  createErrorContainer,
  appendError,
  handleRequiredValidation,
  dataUrlToBlob,
} from "../utils/utils";

/**
 * Create camera flip icon.
 * @returns {SVGSVGElement} representing camera flip icon.
 */
const createCameraFlipIcon = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  svg.setAttribute("viewBox", "0 0 32 32");
  svg.setAttribute("width", "50");
  svg.setAttribute("height", "50");
  svg.setAttribute("fill", "white");

  path.setAttribute(
    "d",
    "M30 8.25h-7.539l-1.789-3.585c-0.126-0.248-0.379-0.415-0.672-0.415-0 0-0 0-0 0h-8c-0 0-0 0-0.001 0-0.292 0-0.545 0.167-0.668 0.411l-0.002 0.004-1.793 3.585h-7.536c-0.414 0-0.75 0.336-0.75 0.75v0 18c0 0.414 0.336 0.75 0.75 0.75h28c0.414-0 0.75-0.336 0.75-0.75v0-18c-0-0.414-0.336-0.75-0.75-0.75v0zM29.25 26.25h-26.5v-16.5h7.25c0 0 0 0 0.001 0 0.292 0 0.545-0.167 0.668-0.411l0.002-0.004 1.793-3.585h7.071l1.789 3.585c0.126 0.248 0.379 0.415 0.672 0.415 0 0 0 0 0 0h7.254zM20.145 17.235c-0.368 0.052-0.648 0.365-0.648 0.743 0 0.036 0.003 0.071 0.007 0.106l-0-0.004c0.019 0.139 0.031 0.299 0.031 0.462v0.001c-0.105 1.96-1.72 3.51-3.697 3.51-0.059 0-0.117-0.001-0.175-0.004l0.008 0c-0.759-0.004-1.469-0.213-2.079-0.573l0.019 0.011h0.435c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0h-2.331c-0.019 0-0.036 0.010-0.055 0.011-0.060 0.005-0.115 0.017-0.167 0.034l0.005-0.001c-0.051 0.015-0.095 0.034-0.136 0.056l0.004-0.002c-0.020 0.011-0.042 0.012-0.061 0.025-0.022 0.014-0.034 0.036-0.053 0.052-0.039 0.031-0.074 0.065-0.105 0.102l-0.001 0.001c-0.058 0.069-0.103 0.149-0.132 0.238l-0.001 0.005c-0.016 0.047-0.027 0.101-0.032 0.157l-0 0.003c-0.002 0.024-0.014 0.044-0.014 0.068v2.148c0 0.414 0.336 0.75 0.75 0.75s0.75-0.336 0.75-0.75v0-0.372c0.89 0.643 2.002 1.031 3.205 1.036h0.001c0.050 0.002 0.108 0.003 0.167 0.003 2.805 0 5.091-2.22 5.197-4.999l0-0.010c0-0.001 0-0.003 0-0.005 0-0.233-0.017-0.463-0.050-0.687l0.003 0.025c-0.045-0.368-0.356-0.65-0.733-0.65-0.039 0-0.078 0.003-0.115 0.009l0.004-0.001zM20.285 12.365c-0.414 0-0.75 0.336-0.75 0.75v0 0.372c-0.89-0.644-2.002-1.031-3.205-1.036h-0.001c-0.050-0.002-0.109-0.003-0.168-0.003-2.805 0-5.091 2.22-5.197 4.999l-0 0.010c0 0.001 0 0.001 0 0.002 0 0.237 0.018 0.47 0.052 0.697l-0.003-0.026c0.056 0.364 0.366 0.64 0.741 0.641h0c0.001 0 0.003 0 0.005 0 0.038 0 0.074-0.003 0.11-0.008l-0.004 0c0.364-0.056 0.64-0.367 0.64-0.742 0-0.039-0.003-0.077-0.009-0.115l0.001 0.004c-0.021-0.134-0.033-0.29-0.033-0.447 0-0.002 0-0.005 0-0.007v0c0.106-1.96 1.721-3.51 3.698-3.51 0.059 0 0.117 0.001 0.176 0.004l-0.008-0c0.76 0.004 1.47 0.213 2.079 0.574l-0.019-0.011h-0.435c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h2.331c0.023 0 0.042-0.011 0.064-0.013 0.106-0.012 0.202-0.042 0.29-0.087l-0.005 0.002c0.020-0.010 0.042-0.012 0.060-0.024 0.022-0.014 0.034-0.037 0.053-0.053 0.040-0.032 0.076-0.068 0.108-0.106l0.001-0.001c0.088-0.107 0.147-0.242 0.162-0.389l0-0.003c0.006-0.020 0.011-0.046 0.015-0.072l0-0.004v-2.149c-0-0.414-0.336-0.75-0.75-0.75v0z"
  );

  svg.appendChild(path);

  return svg;
};

/**
 * Creates a photo input form element.
 * @param {String} fieldId The ID of the form field.
 * @returns {Object} An object containing the selected image div and delete button elements.
 */
const selectedImageDivElement = (
  fieldId: string
): { selectedImageDiv: HTMLDivElement; deleteButton: HTMLButtonElement } => {
  const selectedImageDiv = document.createElement("div");
  selectedImageDiv.className = "selected-image";

  const selectedImageComp = document.createElement("img");
  selectedImageComp.id = `${fieldId}-selected-image`;
  selectedImageComp.alt = "Uploaded";

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-image-button";
  deleteButton.innerHTML = "&#x2715;";

  selectedImageDiv.appendChild(selectedImageComp);
  selectedImageDiv.appendChild(deleteButton);

  return { selectedImageDiv, deleteButton };
};

/**
 * Creates a video element for capturing photos.
 * @param {String} fieldId The ID of the form field.
 * @returns {Object} An object containing the video div, capture button & flip camera button elements.
 */
const videoDivElement = (
  fieldId: string
): {
  videoDiv: HTMLDivElement;
  captureButton: HTMLButtonElement;
  flipCameraButton: HTMLButtonElement;
} => {
  const videoDiv = document.createElement("div");
  videoDiv.className = "camera-video-container";

  const videoElement = document.createElement("video");
  videoElement.id = `${fieldId}-video`;
  videoElement.className = "webcam-feed";
  videoElement.autoplay = true;
  videoElement.loop = true;
  videoElement.muted = true;
  videoElement.playsInline = true;

  const innerCircleDiv = document.createElement("div");
  innerCircleDiv.className = "inner-circle";

  const captureButton = document.createElement("button");
  captureButton.type = "button";
  captureButton.id = `${fieldId}-capture-button`;
  captureButton.className = "capture-button";
  captureButton.appendChild(innerCircleDiv);

  const flipCameraButton = document.createElement("button");
  flipCameraButton.type = "button";
  flipCameraButton.id = `${fieldId}-flip-camera-button`;
  flipCameraButton.className = "flip-camera-button";
  flipCameraButton.appendChild(createCameraFlipIcon());

  videoDiv.appendChild(videoElement);
  videoDiv.appendChild(captureButton);
  videoDiv.appendChild(flipCameraButton);
  return { videoDiv, captureButton, flipCameraButton };
};

/**
 * Creates an alternate icon div element for the photo component.
 * @returns {HTMLDivElement} A div element containing an alternate icon for the photo component.
 */
const alternateDivElement = (): HTMLDivElement => {
  const altDiv = document.createElement("div");
  altDiv.className = "alternate-icon-div";

  const altImage = document.createElement("img");
  altImage.alt = "user_icon";
  altImage.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // Placeholder icon for camera

  altDiv.appendChild(altImage);
  return altDiv;
};

/**
 * Handles the required field validation for the photo component.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @param {HTMLInputElement} hiddenInput The hidden input element to set validity.
 * @param {HTMLDivElement} errorContainer The error container to display validation errors.
 */
const requiredFieldCheck = (
  state: FormState,
  field: FormField,
  hiddenInput: HTMLInputElement,
  errorContainer: HTMLDivElement
) => {
  let isValid = true;
  let lastError: "required" | number | null = null;
  appendError(errorContainer, "");

  if (
    field.required &&
    (state.formData[field.id] as FileUploadData).value === ""
  ) {
    const result = handleRequiredValidation(state, errorContainer);
    lastError = result.lastError;
    isValid = result.isValid;
  }

  state.lastErrors = state.lastErrors || {};
  state.lastErrors[field.id] = lastError;

  hiddenInput.setCustomValidity(isValid ? "" : "Invalid input");
  hiddenInput.classList.toggle("error", !isValid);
};

export const createPhotoField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  (state.formData[field.id] as FileUploadData) = {
    value: "",
    docType: "",
    format: "",
    refId: "",
  };

  let cameraOn = false;
  let facingUserMode: boolean = true;

  // click event button for enabling camera
  const openCamera = async (
    videoDiv: HTMLElement,
    mainContentDiv: HTMLElement,
    facingUserMode: boolean
  ) => {
    const videoElement = videoDiv.querySelector(
      `video#${field.id}-video`
    ) as HTMLVideoElement;

    if (!videoElement) {
      return;
    }

    // setting the element to video div
    mainContentDiv.innerHTML = ""; // Clear the main content div
    mainContentDiv.appendChild(videoDiv);

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: facingUserMode ? "user" : "environment",
      },
    });
    videoElement.srcObject = stream;
    videoElement.muted = true;
    videoElement.play();
    cameraOn = true;
  };

  const wrapper = document.createElement("div");
  wrapper.className = `form-field photo-container ${field.cssClasses?.join(" ") || ""}`;

  const label = document.createElement("label");
  label.htmlFor = field.id;
  label.innerHTML = getLabelText(state, field);

  const mainContentDiv = document.createElement("div");
  mainContentDiv.className = "main-image-container";

  /*----------- Selected Image Div ----------------------- */
  const { selectedImageDiv, deleteButton } = selectedImageDivElement(field.id);

  /*----------- Camera is on to take picture ----------------- */
  const { videoDiv, captureButton, flipCameraButton } = videoDivElement(
    field.id
  );

  const errorContainer = createErrorContainer();

  const canvas = document.createElement("canvas");
  canvas.id = `${field.id}-canvas`;
  canvas.style.display = "none";
  canvas.width = 430; // Set canvas width
  canvas.height = 500; // Set canvas height

  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.id = field.id;
  hiddenInput.name = field.id;
  hiddenInput.dataset.fieldId = field.id;
  hiddenInput.required = Boolean(field.required);

  wrapper.appendChild(label);

  let alternateDiv = alternateDivElement();
  alternateDiv.addEventListener("click", async () =>
    openCamera(videoDiv, mainContentDiv, facingUserMode)
  );
  mainContentDiv.appendChild(alternateDiv);
  wrapper.appendChild(mainContentDiv);
  wrapper.appendChild(hiddenInput);
  wrapper.appendChild(errorContainer);
  wrapper.appendChild(canvas);

  hiddenInput.addEventListener("change", (event) => {
    event.preventDefault();
    requiredFieldCheck(state, field, hiddenInput, errorContainer);
  });

  // delete event button for clearing
  // the current captured photo
  deleteButton.addEventListener("click", () => {
    const imgDiv = selectedImageDiv.querySelector(
      `img.${field.id}-selected-image`
    ) as HTMLImageElement;
    if (imgDiv) {
      imgDiv.src = ""; // Clear the image source
    }
    hiddenInput.value = ""; // Clear the hidden input value
    (state.formData[field.id] as FileUploadData) = {
      value: "",
      docType: "",
      format: "",
      refId: "",
    };
    cameraOn = false;

    mainContentDiv.innerHTML = ""; // Clear the main content div
    alternateDiv = alternateDivElement();
    alternateDiv.addEventListener("click", async () =>
      openCamera(videoDiv, mainContentDiv, facingUserMode)
    );
    mainContentDiv.appendChild(alternateDiv); // Append the alternate icon div
    // deleting image from the state

    requiredFieldCheck(state, field, hiddenInput, errorContainer);
  });

  // capture button event for capturing the photo
  captureButton.addEventListener("click", async () => {
    const videoElement = videoDiv.querySelector(
      `video#${field.id}-video`
    ) as HTMLVideoElement;
    if (!videoElement) {
      return;
    }
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      console.error("Failed to get canvas context");
      return;
    }

    // Draw the video frame to the canvas
    // const sy = videoElement.videoHeight / 2 - canvas.height / 2;
    const sx = videoElement.videoWidth / 2 - canvas.width / 2;

    context.drawImage(
      videoElement,
      sx,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const imageData = canvas.toDataURL("image/png", 0.5);

    // setting the element to video div
    mainContentDiv.innerHTML = ""; // Clear the main content div
    mainContentDiv.appendChild(selectedImageDiv);

    (state.formData[field.id] as FileUploadData) = {
      value: dataUrlToBlob(imageData),
      docType: "photo",
      format: "image/png",
      refId: "photo-" + Date.now(),
    };
    hiddenInput.value = "true"; // Set the hidden input value
    const imgDiv = selectedImageDiv.querySelector(
      `img#${field.id}-selected-image`
    ) as HTMLImageElement;

    if (imgDiv) {
      imgDiv.src = imageData;
    }

    // stopping the camera stream
    const stream = videoElement.srcObject as MediaStream;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    videoElement.srcObject = null; // Stop the video stream
    cameraOn = false;

    requiredFieldCheck(state, field, hiddenInput, errorContainer);
  });

  // flipping camera button event for changing
  flipCameraButton.addEventListener("click", async () => {
    facingUserMode = !facingUserMode;
    alternateDiv.click();
  });

  const parentNode = document.createElement("div");
  parentNode.className = "form-field-group";

  parentNode.appendChild(wrapper);

  return parentNode;
};
