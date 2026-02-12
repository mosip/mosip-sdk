import { FormState, FormField, FileUploadData } from "../types";
import { CameraErrorCodes } from "../utils/constants";
import {
  getLabelText,
  createErrorContainer,
  appendError,
  handleRequiredValidation,
  dataUrlToBlob,
  emptyInvalidFn,
  getMultiLangText,
} from "../utils/utils";

/**
 * Create camera denied icon.
 * @returns {SVGSVGElement} representing camera denied icon.
 */
const createCameraDeniedIcon = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  svg.setAttribute("viewBox", "0 0 52.227 52.227");
  svg.setAttribute("width", "52.227");
  svg.setAttribute("height", "52.227");

  path.setAttribute(
    "d",
    "M102.542-825.2l-3.806-3.806v-24.986a.76.76,0,0,0-.22-.561.76.76,0,0,0-.561-.22H88.507l-4.656-5.075H73.018l-2.435,2.689-2.713-2.713,3.489-3.782H85.511l4.695,5.075h7.75a4.428,4.428,0,0,1,3.255,1.332,4.428,4.428,0,0,1,1.332,3.255V-825.2Zm-43.628,4.685a4.428,4.428,0,0,1-3.255-1.332,4.428,4.428,0,0,1-1.332-3.255v-28.89a4.428,4.428,0,0,1,1.332-3.255,4.428,4.428,0,0,1,3.255-1.332h3.065l3.806,3.806H58.914a.76.76,0,0,0-.561.22.76.76,0,0,0-.22.561v28.89a.76.76,0,0,0,.22.561.76.76,0,0,0,.561.22H96.237l3.806,3.806Zm28.075-13.054a10.764,10.764,0,0,1-3.648,3.25,10.008,10.008,0,0,1-4.907,1.215,10.077,10.077,0,0,1-7.406-3.038,10.077,10.077,0,0,1-3.038-7.406,10.008,10.008,0,0,1,1.215-4.907,10.764,10.764,0,0,1,3.25-3.648l2.752,2.752a6.576,6.576,0,0,0-2.479,2.369,6.435,6.435,0,0,0-.932,3.433,6.418,6.418,0,0,0,1.913,4.724,6.418,6.418,0,0,0,4.724,1.913,6.435,6.435,0,0,0,3.433-.932,6.575,6.575,0,0,0,2.369-2.479l2.752,2.752Zm-1.142-13.391a9.77,9.77,0,0,1,2.174,3.165,10.421,10.421,0,0,1,.832,3.931v.468a2.842,2.842,0,0,1-.039.468l-11-11a2.841,2.841,0,0,1,.468-.039h.468a10.422,10.422,0,0,1,3.931.832A9.769,9.769,0,0,1,85.847-846.963Zm14.9,32.575L51.233-863.9l2.713-2.713L103.46-817.1l-2.713,2.713ZM75.585-839.55ZM84.627-843.117Z"
  );

  path.setAttribute("transform", "translate(-51.233 866.615)");
  path.setAttribute("fill", "#afafaf");

  svg.appendChild(path);

  return svg;
};

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
 * Create a alternate icon div element for the photo component.
 * @returns {SVGSVGElement} A div element containing an alternate icon for the photo component.
 */
const alternativeIcon = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");

  path.setAttribute("fillRule", "evenodd");
  path.setAttribute("clipRule", "evenodd");
  path.setAttribute(
    "d",
    "M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
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
 * @param {FormState} state The current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing an alternate icon for the photo component.
 */
const alternateDivElement = (state: FormState, field: FormField): HTMLDivElement => {
  const altDiv = document.createElement("div");
  altDiv.className = "alternate-icon-div";

  const altImage = document.createElement("img");
  altImage.alt = "user_icon";

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(alternativeIcon());
  const svgUrl = "data:image/svg+xml;base64," + btoa(svgString);
  altImage.src = svgUrl;

  const popupDiv = document.createElement("div");
  popupDiv.className = "alternate-icon-popup";
  popupDiv.innerText = getMultiLangText(state, field.placeholder);

  altDiv.appendChild(altImage);
  altDiv.appendChild(popupDiv);
  return altDiv;
};

/**
 * Creates a camera error div element for the photo component.
 * @param {FormState} state The current form state containing schema, container, and other properties.
 * @param {string} permissionErrorCode The permission error code to display.
 * @returns {HTMLDivElement} A div element containing a camera error icon for the photo component.
 */
const cameraErrorElement = (
  state: FormState,
  permissionErrorCode: string
): HTMLDivElement => {
  const errorDiv = document.createElement("div");
  errorDiv.className = "camera-denied-container";

  const svgElement = createCameraDeniedIcon();
  errorDiv.appendChild(svgElement);

  const headerDiv = document.createElement("div");
  headerDiv.className = "camera-denied-header";
  headerDiv.dataset.errorCode = permissionErrorCode;
  headerDiv.textContent =
    getMultiLangText(
      state,
      state.fallbackErrors?.[`${permissionErrorCode}_header`]
    ) || "";

  const descriptionDiv = document.createElement("div");
  descriptionDiv.className = "camera-denied-description";
  descriptionDiv.dataset.errorCode = permissionErrorCode;
  descriptionDiv.textContent =
    getMultiLangText(
      state,
      state.fallbackErrors?.[`${permissionErrorCode}_description`]
    ) || "";

  errorDiv.appendChild(headerDiv);
  errorDiv.appendChild(descriptionDiv);
  return errorDiv;
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
  let currentStream: MediaStream | null = null;
  let cameraOn = false;

  const stopCurrentStream = () => {
    if (!currentStream) return;

    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
    cameraOn = false;
  };

  (state.formData[field.id] as FileUploadData) = {
    value: "",
    docType: "",
    format: "",
    refId: "",
  };

  let facingUserMode: boolean = true;
  let permissionGranted: boolean = false;
  let permissionErrorCode: string = CameraErrorCodes.PERMISSION_DENIED;

  navigator.permissions
    .query({ name: "camera" as PermissionName })
    .then((permissionStatus) => {
      // Listen for changes in the permission state
      permissionStatus.onchange = () => {
        cameraPermissionCheck();
      };
    });

  const cameraPermissionCheck = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(cameraPermissionAllowed)
      .catch(cameraPermissionDenied)
      .finally(() => cameraOn && alternateDiv.click());
  };

  // if camera permission granted then set the state
  const cameraPermissionAllowed = (stream: MediaStream) => {
    if (cameraOn) {
      window.videoLocalStream = stream;
    } else {
      stopCameraStream(stream);
    }
    permissionGranted = true;
  };

  // if camera permission denied then set the state
  const cameraPermissionDenied = (error: Error) => {
    permissionGranted = false;

    // doing this type of setting the state
    // so that it not re render anything
    // it will only render when state is  actually changed
    permissionErrorCode =
      error.name === CameraErrorCodes.NOT_READABLE
        ? CameraErrorCodes.NOT_ACCESSIBLE
        : CameraErrorCodes.PERMISSION_DENIED;
  };

  /**
   * Method to stop camera stream when not in use
   * @param {MediaStream} stream Stream of the camera
   */
  const stopCameraStream = (stream: MediaStream) => {
    let tracks = null;
    if (stream) {
      tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    window.videoLocalStream = null; // stop the video stream
  };

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

    stopCurrentStream();

    await navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: facingUserMode ? "user" : "environment",
        },
      })
      .then((stream) => {
        currentStream = stream;
        cameraOn = true;

        // setting the element to video div
        mainContentDiv.innerHTML = ""; // Clear the main content div
        mainContentDiv.appendChild(videoDiv);

        videoElement.srcObject = stream;
        videoElement.muted = true;
        videoElement.play();
      })
      .catch((_error) => {
        const errorDiv = cameraErrorElement(state, permissionErrorCode);
        mainContentDiv.innerHTML = ""; // Clear the main content div
        mainContentDiv.appendChild(errorDiv);
      });
  };

  const wrapper = document.createElement("div");
  wrapper.className = `form-field photo-container ${field.cssClasses?.join(" ") || ""}`;

  const label = document.createElement("label");
  label.htmlFor = field.id;
  label.innerHTML = getLabelText(state, field);

  const mainContentDiv = document.createElement("div");
  mainContentDiv.className = "main-image-container";
  mainContentDiv.id = `${field.id}-main-content`;

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
  canvas.height = 350; // Set canvas height

  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.id = field.id;
  hiddenInput.name = field.id;
  hiddenInput.dataset.fieldId = field.id;
  hiddenInput.oninvalid = emptyInvalidFn(hiddenInput);

  wrapper.appendChild(label);

  let alternateDiv = alternateDivElement(state, field);
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
    stopCurrentStream();

    mainContentDiv.innerHTML = ""; // Clear the main content div
    alternateDiv = alternateDivElement(state, field);
    alternateDiv.addEventListener("click", async () =>
      openCamera(videoDiv, mainContentDiv, facingUserMode)
    );
    mainContentDiv.appendChild(alternateDiv); // Append the alternate icon div
    // deleting image from the state

    requiredFieldCheck(state, field, hiddenInput, errorContainer);

    hiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
    hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
  });

  // capture button event for capturing the photo
  captureButton.addEventListener("click", async () => {
    const video = videoDiv.querySelector(
      `video#${field.id}-video`
    ) as HTMLVideoElement;
    if (!video || video.readyState < 2) return;

    const rect = video.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Match CSS size
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Match device pixels
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // --- MATCH PREVIEW ---
    const videoAR = video.videoWidth / video.videoHeight;
    const viewAR = rect.width / rect.height;

    let sx = 0, sy = 0, sWidth = video.videoWidth, sHeight = video.videoHeight;

    if (videoAR > viewAR) {
      // crop left/right
      sWidth = video.videoHeight * viewAR;
      sx = (video.videoWidth - sWidth) / 2;
    } else {
      // crop top/bottom
      sHeight = video.videoWidth / viewAR;
      sy = (video.videoHeight - sHeight) / 2;
    }

    ctx.drawImage(
      video,
      sx,
      sy,
      sWidth,
      sHeight,
      0,
      0,
      rect.width,
      rect.height
    );

    const imageData = canvas.toDataURL("image/jpeg", 0.5);

    // setting the element to video div
    mainContentDiv.innerHTML = ""; // Clear the main content div
    mainContentDiv.appendChild(selectedImageDiv);

    (state.formData[field.id] as FileUploadData) = {
      value: dataUrlToBlob(imageData),
      docType: "photo",
      format: "image/jpeg",
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
    stopCurrentStream();
    video.srcObject = null; // Stop the video stream

    requiredFieldCheck(state, field, hiddenInput, errorContainer);

    // trigger global form validation like real input
    hiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
    hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
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
