import { FormState, FormField, FileUploadData } from "../types";
import {
  getLabelText,
  createErrorContainer,
  appendError,
  handleRequiredValidation,
} from "../utils/utils";

/**
 * Creates a photo input form element.
 * @param {String} fieldId The ID of the form field.
 * @returns {HTMLDivElement} A div element containing the form field with its label and input.
 */
const selectedImageDivElement = (fieldId: string): HTMLDivElement => {
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

  return selectedImageDiv;
};

/**
 * Creates a video element for capturing photos.
 * @param {String} fieldId The ID of the form field.
 * @returns {HTMLDivElement} A div element containing the video element.
 */
const videoDivElement = (fieldId: string): HTMLDivElement => {
  const videoDiv = document.createElement("div");
  videoDiv.className = "camera-video-container";

  const videoElement = document.createElement("video");
  videoElement.id = `${fieldId}-video`;
  videoElement.autoplay = true;
  videoElement.loop = true;
  videoElement.muted = true;
  videoElement.playsInline = true;

  videoDiv.appendChild(videoElement);
  return videoDiv;
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

  const wrapper = document.createElement("div");
  wrapper.className = `form-field photo-container ${field.cssClasses?.join(" ") || ""}`;

  const label = document.createElement("label");
  label.htmlFor = field.id;
  label.innerHTML = getLabelText(state, field);

  const mainContentDiv = document.createElement("div");
  mainContentDiv.className = "main-image-container";

  /*----------- Selected Image Div ----------------------- */
  const selectedImageDiv = selectedImageDivElement(field.id);

  /*----------- Camera is on to take picture ----------------- */
  const videoDiv = videoDivElement(field.id);

  const buttonDiv = document.createElement("div");
  buttonDiv.className = "button-container";

  const captureButton = document.createElement("button");
  captureButton.type = "button";
  captureButton.className = "capture-button form-button blue-background";
  captureButton.innerHTML =
    getLabelText(state, null, state.labels?.clickToUpload) || "Click To Upload";
  buttonDiv.appendChild(captureButton);

  const errorContainer = createErrorContainer();

  const canvas = document.createElement("canvas");
  canvas.id = `${field.id}-canvas`;
  canvas.style.display = "none";
  canvas.width = 320; // Set canvas width
  canvas.height = 240; // Set canvas height

  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.id = field.id;
  hiddenInput.name = field.id;
  hiddenInput.dataset.fieldId = field.id;
  hiddenInput.required = Boolean(field.required);

  wrapper.appendChild(label);
  mainContentDiv.appendChild(alternateDivElement());
  wrapper.appendChild(mainContentDiv);
  wrapper.appendChild(hiddenInput);
  wrapper.appendChild(errorContainer);
  wrapper.appendChild(buttonDiv);
  wrapper.appendChild(canvas);

  hiddenInput.addEventListener("change", (event) => {
    event.preventDefault();
    requiredFieldCheck(state, field, hiddenInput, errorContainer);
  });

  // delete event button for clearing
  // the current captured photo
  selectedImageDiv
    .querySelector("button.delete-image-button")
    ?.addEventListener("click", () => {
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
      mainContentDiv.appendChild(alternateDivElement()); // Append the alternate icon div
      // deleting image from the state

      captureButton.innerHTML =
        getLabelText(state, null, state.labels?.clickToUpload) ||
        "Click To Upload";
      captureButton.classList.remove("green-background");
      captureButton.classList.add("blue-background");

      requiredFieldCheck(state, field, hiddenInput, errorContainer);
    });

  // click event button for multiple thing
  // for enabling camera, and for capture photo
  captureButton.addEventListener("click", async () => {
    const videoElement = videoDiv.querySelector(
      `video#${field.id}-video`
    ) as HTMLVideoElement;
    if (cameraOn) {
      if (!videoElement) {
        return;
      }
      const context = canvas.getContext("2d");
      if (!context) {
        console.error("Failed to get canvas context");
        return;
      }
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/png", 0.5);

      // setting the element to video div
      mainContentDiv.innerHTML = ""; // Clear the main content div
      mainContentDiv.appendChild(selectedImageDiv);

      (state.formData[field.id] as FileUploadData) = {
        value: imageData,
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
    } else {
      if (!videoElement) {
        return;
      }

      // setting the element to video div
      mainContentDiv.innerHTML = ""; // Clear the main content div
      mainContentDiv.appendChild(videoDiv);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
        },
      });
      videoElement.srcObject = stream;
      videoElement.muted = true;
      videoElement.play();
      cameraOn = true;
      captureButton.innerHTML =
        getLabelText(state, null, state.labels?.capturePhoto) ||
        "Capture Photo";
      captureButton.classList.remove("blue-background");
      captureButton.classList.add("green-background");
    }
  });

  return wrapper;
};
