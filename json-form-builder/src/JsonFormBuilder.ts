import {
  FormConfig,
  FormState,
  FormField,
  FormData,
  Label,
  AdditionalConfig,
  AdditionalSchema,
  FileUploadData,
} from "./types";

import {
  createSimpleTextbox,
  createStringField,
  createPasswordField,
  createDateField,
  createDropdownField,
  createCheckboxField,
  createPhoneField,
  createPhotoField,
  createTextareaField,
  createRadioField,
  createFileUploadField
} from "./components";

import {
  getLabelText,
  getMultiLangText,
  createInfoIcon,
  buildBidirectionalLanguageMap,
  validateForm,
} from "./utils/utils";

import { addResponsiveStyles, addRTLStyles } from "./utils/responsive-style";

import {
  addRecaptchaScript,
  enableRecaptcha,
  initializeRecaptcha,
  reInitializeRecaptcha,
  validateRecaptcha,
} from "./utils/recaptcha";

import { ControlType, InputType } from "./utils/constants";

// Add TypeScript declaration for grecaptcha
declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (response: string) => void;
          "expired-callback"?: () => void;
        }
      ) => number;
      getResponse: (widgetId?: number) => string;
      reset: (widgetId?: number) => void;
    };
    videoLocalStream: MediaStream | null;
  }
}

/**
 * This function creates a loading icon element.
 * @returns  {HTMLDivElement} A div element containing a loading spinner.
 */
const createLoadingIcon = (): HTMLDivElement => {
  const div = document.createElement("div");
  div.className = "flex justify-center items-center h-full";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add(
    "mr-2",
    "h-8",
    "w-8",
    "animate-spin",
    "fill-secondary",
    "text-primary",
    "rtl:ml-2",
    "dark:text-gray-600"
  );
  svg.setAttribute("viewBox", "0 0 100 101");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute(
    "d",
    "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
  );
  path1.setAttribute("fill", "currentColor");

  const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path2.setAttribute(
    "d",
    "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
  );
  path2.setAttribute("fill", "currentFill");

  svg.appendChild(path1);
  svg.appendChild(path2);

  div.appendChild(svg);
  return div;
};

/**
 * This function refresh placeholder and options of the given select element
 * @param {FormState} state The current form state containing schema, container, and other properties.
 * @param {HTMLSelectElement} selectElement The select element to refresh.
 * @param {string} fieldId The ID of the field associated with the dropdown.
 * @param {Label | Undefined} optionPlaceholder The placeholder text for the dropdown.
 */
const refreshDropdownPlaceholderOptions = (
  state: FormState,
  selectElement: HTMLSelectElement | null | undefined,
  fieldId: string,
  optionPlaceholder: Label | undefined
) => {
  if (!selectElement) {
    return;
  }
  const lang = state.currentLanguage;
  const defaultLang = state.defaultLanguage;
  const selectedValue = selectElement.value;
  selectElement.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent =
    getMultiLangText(state, optionPlaceholder, false, lang, defaultLang) ||
    "Select an Option";
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.hidden = true;
  selectElement.appendChild(placeholder);

  Object.entries(state.allowedValues[fieldId] || {}).forEach(
    ([value, labels]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = getMultiLangText(
        state,
        labels,
        false,
        lang,
        defaultLang
      );
      option.selected = value === selectedValue;
      selectElement.appendChild(option);
    }
  );
};

const updateSubmitButtonState = (state: FormState) => {
  const formButton: HTMLButtonElement | null = state.container.querySelector(
    'button[type="submit"]'
  );
  if (!formButton) return;

  // Check if form fields are valid (by checking for any errors in lastErrors)
  const isFormValid = validateForm(state);
  // Check if reCAPTCHA is valid (if enabled)
  const isRecaptchaValid = validateRecaptcha(state);

  // The button is disabled if it is in submitting state, form fields are not valid OR reCAPTCHA is not valid.
  const shouldBeDisabled = state.isSubmitting || !isFormValid || !isRecaptchaValid;

  formButton.disabled = shouldBeDisabled;
};

/**
 * Refreshes all labels in the form based on the current language and schema.
 * It updates the labels for inputs, selects, and error messages according to the current language.
 * @param {FormState} state The current form state containing schema, container, and other properties.
 */
const refreshLabels = (state: FormState): void => {
  const lang = state.currentLanguage;
  const defaultLang = state.defaultLanguage;

  state.schema.forEach((field) => {
    const labelText = getLabelText(state, field);

    if (field.type === InputType.SIMPLE_TYPE) {
      const fieldGroup = state.container
        .querySelector(`.form-field-group input[data-field-id="${field.id}"]`)
        ?.closest(".form-field-group");
      const mainLabel = fieldGroup?.querySelector("label");
      if (mainLabel) {
        mainLabel.innerHTML = labelText;

        if (field.info) {
          const infoIcon = createInfoIcon(getMultiLangText(state, field.info));
          mainLabel.appendChild(infoIcon);
        }

        const capsLockText =
          mainLabel.parentElement?.querySelector(".caps-lock-text");
        if (field?.capsLockCheck && capsLockText) {
          capsLockText.textContent =
            getMultiLangText(state, state.fallbackErrors?.capsLock || {}) ||
            "Caps Lock is on";
        }
      }

      const inputs = state.container.querySelectorAll(
        `input[data-field-id="${field.id}"]`
      );
      inputs.forEach((input) => {
        const datasetLang = (input as HTMLInputElement).dataset.lang || "";
        const inputLang = datasetLang || lang;

        (input as HTMLInputElement).placeholder = getMultiLangText(
          state,
          field.placeholder,
          false,
          inputLang,
          defaultLang
        );
      });
    } else {
      // changing label text after language update
      const labelElement = state.container.querySelector(
        `label[for="${field.id}"]`
      );
      if (labelElement) {
        labelElement.innerHTML = labelText;

        if (field.info) {
          const infoIcon = createInfoIcon(getMultiLangText(state, field.info));
          labelElement.appendChild(infoIcon);
        }

        // changing caps lock text after language update
        const capsLockText =
          labelElement.parentElement?.querySelector(".caps-lock-text");
        if (field?.capsLockCheck && capsLockText) {
          capsLockText.textContent =
            getMultiLangText(state, state.fallbackErrors?.capsLock || {}) ||
            "Caps Lock is on";
        }
      }

      const inputOrTextarea = state.container.querySelector(
        `input#${field.id}, textarea#${field.id}`
      ) as HTMLInputElement | HTMLTextAreaElement | null;

      if (inputOrTextarea) {
        // Skip placeholder update entirely for date fields
        if (field.controlType !== ControlType.DATE) {
          inputOrTextarea.placeholder = getMultiLangText(
            state,
            field.placeholder,
            false,
            lang,
            state.defaultLanguage
          );
        }
      }

      if (field.controlType === ControlType.PASSWORD) {
        const confirmId = `${field.id}_confirm`;
        let confirmLabel: Label = {};
        let confirmPlaceholder: Label = {};
        // checking if additionalSchema has confirm field details
        // If it does, use those details; otherwise, build a default confirm label and placeholder
        if (state.labels && confirmId in state.labels) {
          confirmLabel = { ...state.labels[confirmId] };
        } else {
          // If no additionalSchema, take value from label & placeholder of password field
          for (const lang in field.labelName) {
            confirmLabel[lang] = `Confirm ${field.labelName[lang]}`;
          }
        }

        if (state.placeholders && confirmId in state.placeholders) {
          confirmPlaceholder = { ...state.placeholders[confirmId] };
        } else {
          const placeholdersToConfirm = field.placeholder || {};
          for (const lang in placeholdersToConfirm) {
            confirmPlaceholder[lang] = placeholdersToConfirm[lang]
              ? `Confirm ${placeholdersToConfirm[lang]}`
              : "";
          }
        }

        const confirmLabelElement = state.container.querySelector(
          `label[for="${field.id}_confirm"]`
        );
        if (confirmLabelElement) {
          confirmLabelElement.innerHTML = getLabelText(
            { ...state, schema: [{ ...field, labelName: confirmLabel }] },
            { ...field, labelName: confirmLabel },
            confirmLabel
          );

          // changing caps lock text after language update
          const confirmCapsTextSpan =
            confirmLabelElement.parentElement?.querySelector(".caps-lock-text");
          if (field?.capsLockCheck && confirmCapsTextSpan) {
            confirmCapsTextSpan.textContent =
              getMultiLangText(state, state.fallbackErrors?.capsLock || {}) ||
              "Caps Lock is on";
          }
        }

        const confirmInput = state.container.querySelector(
          `input#${field.id}_confirm`
        ) as HTMLInputElement;

        if (confirmInput) {
          confirmInput.placeholder =
            getMultiLangText(state, confirmPlaceholder) || "";
        }
      }
    }

    if (field.controlType === ControlType.DROPDOWN) {
      const select = state.container.querySelector(
        `select#${field.id}`
      ) as HTMLSelectElement;
      refreshDropdownPlaceholderOptions(
        state,
        select,
        field.id,
        field.placeholder
      );
    }

    if (field.controlType === ControlType.RADIO) {
      const mainLabel = state.container.querySelector(
        `.radio-container[data-field-id="${field.id}"] > .radio-group-label`
      ) as HTMLLabelElement | null;

      if (mainLabel) {
        mainLabel.innerHTML = getLabelText(state, field);
      }

      const radioElements = state.container.querySelectorAll(
        `input[type="radio"][name="${field.id}"]`
      ) as NodeListOf<HTMLInputElement>;

      const options = state.allowedValues?.[field.id];

      if (options && typeof options === "object") {
        radioElements.forEach((radio) => {
          const originalKey = radio.dataset.originalValue || radio.value;

          // store original key only once
          radio.dataset.originalValue = originalKey;

          const optionLabelRaw =
            (options as { [key: string]: Label })[originalKey];

          if (optionLabelRaw) {
            const translatedValue =
              getMultiLangText(state, optionLabelRaw) || originalKey;

            const labelElement = state.container.querySelector(
              `label[for="${radio.id}"]`
            ) as HTMLLabelElement | null;

            if (labelElement) {
              labelElement.textContent = translatedValue;
            }
          }
        });
      }
    }

    if (field.controlType === ControlType.PHOTO) {
      const mainContentDiv = state.container.querySelector(
        `#${field.id}-main-content`
      );
      const altDivPopup = mainContentDiv?.querySelector(
        `.alternate-icon-popup`
      );
      // updating alt text for camera icon
      if (altDivPopup) {
        altDivPopup.textContent =
          getMultiLangText(
            state,
            field.placeholder,
            false,
            lang,
            defaultLang
          ) || "Click to open camera";
      }
      const errorHeader: HTMLElement | undefined | null =
        mainContentDiv?.querySelector(`.camera-denied-header`);
      const errorDescription: HTMLElement | undefined | null =
        mainContentDiv?.querySelector(`.camera-denied-description`);
      // updating error header and description for camera permission denied
      if (errorHeader) {
        errorHeader.textContent =
          getMultiLangText(
            state,
            state.fallbackErrors?.[`${errorHeader.dataset.errorCode}_header`]
          ) || "";
      }
      if (errorDescription) {
        errorDescription.textContent =
          getMultiLangText(
            state,
            state.fallbackErrors?.[
            `${errorDescription.dataset.errorCode}_description`
            ]
          ) || "";
      }
    }

    const errorContainer = state.container.querySelector(
      `.form-field[data-field-id="${field.id}"] .error-container`
    );

    if (!state.lastErrors) state.lastErrors = {};

    let lastError: "required" | number | null = null;

    // Simple validation example for required and regex validators:
    if (field.required) {
      if (field.controlType === ControlType.PHOTO) {
        const photoData = state.formData[field.id] as FileUploadData;
        if ((photoData && photoData.value === "") || !photoData) {
          lastError = "required";
        }
      } else if (field.controlType === ControlType.CHECKBOX) {
        const checkboxElement = state.container.querySelector(
          `input#${field.id}[type="checkbox"]`
        ) as HTMLInputElement | null;

        if (checkboxElement && !checkboxElement.checked) {
          lastError = "required";
        }
      } else if (field.controlType === ControlType.RADIO) {
        // get all radio buttons for this field
        const radioElements = state.container.querySelectorAll(
          `input[type="radio"][name="${field.id}"]`
        ) as NodeListOf<HTMLInputElement>;

        let isChecked = false;

        // Clear any previous custom validity and check selection
        radioElements.forEach((radio) => {
          radio.setCustomValidity(""); // reset
          if (radio.checked) {
            isChecked = true;
            state.formData[field.id] = radio.value; // <-- populate formData
          }
        });

        // If none checked, mark error
        if (!isChecked) {
          lastError = "required";
          const firstRadio = radioElements[0];
          if (firstRadio) {
            firstRadio.setCustomValidity("This field is required.");
          }
        } else {
          // Do nothing; preserve existing formData value
        }
      } else {
        const inputElement = state.container.querySelector(
          `input[data-field-id="${field.id}"], textarea[data-field-id="${field.id}"]`
        ) as HTMLInputElement | HTMLTextAreaElement | null;

        if (inputElement && !inputElement.value.trim()) {
          lastError = "required";
        } else if (Array.isArray(field.validators) && inputElement) {
          for (let i = 0; i < field.validators.length; i++) {
            const validator = new RegExp(field.validators[i]?.regex || "");
            if (!validator.test(inputElement.value)) {
              lastError = i;
              break;
            }
          }
        }
      }
    }

    state.lastErrors[field.id] = lastError;

    // Show error messages if error container exists and error present
    if (errorContainer && lastError != null && state.isFormInitialized) {
      let errorText = "";

      if (lastError === "required") {
        const requiredErrors = state.fallbackErrors?.required || {};
        errorText = getMultiLangText(state, requiredErrors) || "Invalid value";
      } else if (
        typeof lastError === "number" &&
        Array.isArray(field.validators)
      ) {
        const validator = field.validators[lastError];
        if (validator && validator.error) {
          errorText =
            getMultiLangText(state, validator.error) || "Invalid value";
        }
      }

      errorContainer.textContent = errorText;
    } else if (errorContainer) {
      errorContainer.textContent = ""; // clear error if none
    }
  });

  const submitButton = state.container.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.textContent = state.submitLabel;
  }
  updateSubmitButtonState(state);
};

/**
 * Triggers input and change events for all inputs in the form.
 * @param {FormState} state The current form state containing the container and form data.
 * @param {"touchedOnly" | "all"} mode If "touchedOnly", only triggers events for fields with existing error messages; if "all", triggers for all fields. Default is "all".
 */
const triggerAllEvents = (
  state: FormState,
  mode: "touchedOnly" | "all" = "all"
) => {
  const inputs = state.container.querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    // Error container selection:
    const errorContainer =
      // 1. Next sibling
      input.nextElementSibling &&
        input.nextElementSibling.classList.contains("error-message")
        ? (input.nextElementSibling as HTMLElement)
        : // 2. Parent's next sibling
        input.parentElement?.nextElementSibling &&
          input.parentElement.nextElementSibling.classList.contains(
            "error-message"
          )
          ? (input.parentElement.nextElementSibling as HTMLElement)
          : // 3. Closest .form-field with .error-message
          input.closest(".form-field")?.querySelector(".error-message") ||
          // 4. Closest .form-field-group with .error-message
          input
            .closest(".form-field-group")
            ?.querySelector(".error-message") ||
          // 5. Fallback: parent query
          input.parentElement?.querySelector(".error-message") ||
          null;

    // Only trigger if error message is present (for touchedOnly mode)
    if (
      mode === "touchedOnly" &&
      errorContainer &&
      !errorContainer.querySelector(".error-text")
    ) {
      return;
    }

    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
};

/**
 * Updates the current language of the form and refreshes all labels accordingly.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {string} newLanguage New language code to switch to.
 * @param {string} submitButtonLabel Optional label for the submit button in the new language.
 */
const updateLanguage = (
  state: FormState,
  newLanguage: string,
  submitButtonLabel?: string,
  additionalSchema?: AdditionalSchema
): void => {
  const normalizedLang = newLanguage || state.languageMap[newLanguage];
  state.currentLanguage = normalizedLang;
  state.isRTL = state.rtlLanguages.includes(normalizedLang);
  state.container.dir = state.isRTL ? "rtl" : "ltr";
  state.container.style.direction = state.isRTL ? "rtl" : "ltr";

  state.isSubmitting = false;

  if (additionalSchema) {
    state.additionalSchema = additionalSchema;
  }

  reInitializeRecaptcha(state);

  if (submitButtonLabel) {
    state.submitLabel = submitButtonLabel;
  }
  refreshLabels(state);
  triggerAllEvents(state, "touchedOnly");
};

/**
 * Creates a language switcher element that allows users to switch between available languages.
 * @param state Current form state containing schema, container, and other properties.
 * @returns {HTMLDivElement} A div element containing the language switcher with a label and select dropdown.
 */
const createLanguageSwitcher = (state: FormState): HTMLDivElement => {
  const container = document.createElement("div");
  container.className = "language-switcher";

  const label = document.createElement("label");
  label.textContent = "Language: ";

  const select = document.createElement("select");
  state.availableLanguages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = lang.toUpperCase();
    option.selected = lang === state.currentLanguage;
    select.appendChild(option);
  });

  select.addEventListener("change", (e) => {
    const target = e.target as HTMLSelectElement;
    updateLanguage(state, target.value);
  });

  container.appendChild(label);
  container.appendChild(select);
  return container;
};

/**
 * Gets the form data from the current state, normalizing language codes to 3-letter codes.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @returns {FormData} The collected form data with normalized language codes.
 */
const JsonFormBuilder = (
  config: FormConfig,
  containerId: string,
  additionalConfig: AdditionalConfig
) => {
  const container =
    document.getElementById(containerId) ||
    document.querySelector(`#${containerId}`);
  if (!container) {
    throw new Error(`Container with id "${containerId}" not found`);
  }

  const state: FormState = {
    schema: config.schema,
    allowedValues: config.allowedValues || {},
    mandatoryLanguages: config.language.mandatory || ["eng"],
    optionalLanguages: config.language.optional || [],
    container: container as HTMLElement,
    formData: {},
    formElements: {},
    submitLabel: additionalConfig.submitButton.label,
    submitAction: additionalConfig.submitButton.action,
    currentLanguage: additionalConfig.language?.currentLanguage || "eng",
    defaultLanguage: additionalConfig.language?.defaultLanguage || "eng",
    showLanguageSwitcher:
      additionalConfig.language?.showLanguageSwitcher || false,
    languageSwitcherPosition:
      additionalConfig.language?.languageSwitcherPosition || "top",
    availableLanguages: additionalConfig.language?.availableLanguages || [
      ...(config.language.mandatory || ["eng"]),
      ...(config.language.optional || []),
    ],
    rtlLanguages: additionalConfig.language?.rtlLanguages || [
      "ara",
      "ar",
      "he",
      "fa",
      "ur",
    ],
    isRTL: false,
    recaptcha: additionalConfig.recaptcha,
    fallbackErrors: config.i18nValues?.errors || config.errors || {},
    lastErrors: {},
    languageMap: buildBidirectionalLanguageMap(
      config.language.langCodeMap || {}
    ),
    additionalSchema: additionalConfig.additionalSchema || {},
    isSubmitting: false,
    isFormInitialized: false,
    maxFileSizeMB: config.maxFileSizeMB || 5242880, // Default to 5MB given as bytes
    labels: config.i18nValues?.labels || {},
    placeholders: config.i18nValues?.placeholders || {},
  };

  /**
   * Adds styles for the language switcher to ensure it is displayed correctly.
   */
  const addLanguageSwitcherStyles = (): void => {
    const style = document.createElement("style");
    style.textContent = `
      .language-switcher {
        display: flex;
        gap: 0.5rem;
        margin: 1rem 0;
        justify-content: flex-end;
      }

      .language-switcher select {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.9rem;
      }

      .language-switcher label {
        display: flex;
        align-items: center;
        font-size: 0.9rem;
      }
    `;
    document.head.appendChild(style);
  };

  /**
   * Updates the RTL state of the form based on the current language.
   * @param {string} language The language code to check if it is an RTL language.
   */
  const updateRTLState = (language: string): void => {
    state.isRTL = state.rtlLanguages.includes(language);
    state.container.setAttribute("dir", state.isRTL ? "rtl" : "ltr");
    state.container.style.direction = state.isRTL ? "rtl" : "ltr";
  };

  // Initialize RTL state
  updateRTLState(state.currentLanguage);

  /**
   * Groups form fields by their alignment group.
   * @param {FormState} state Current form state containing schema, container, and other properties.
   * @returns {Record<string, FormField[]>} An object where keys are alignment group names and values are arrays of fields in that group.
   */
  const render = (state: FormState): void => {
    const form = document.createElement("form");
    form.className = "form";

    // Add language switcher if enabled
    if (state.showLanguageSwitcher) {
      const languageSwitcher = createLanguageSwitcher(state);
      form.appendChild(languageSwitcher);
    }

    // Group fields by alignment group
    const groupedFields = groupFields(state);

    // Render each group
    Object.entries(groupedFields).forEach(([_groupName, fields]) => {
      const group = document.createElement("div");
      group.className = "form-group";
      group.style.display = "flex";
      group.style.flexDirection = "row";

      fields.forEach((field) => {
        const fieldElement = createFormElement(state, field);
        group.appendChild(fieldElement);
      });

      form.appendChild(group);
    });

    // Add reCAPTCHA if enabled
    enableRecaptcha(state, form);

    // Add submit button
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "form-button";
    submitButton.id = "form-submit-button";
    submitButton.textContent = state.submitLabel;
    form.appendChild(submitButton);

    // Add form submit handler
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      validateAndSubmit(state);
    });

    // Clear container and append form
    state.container.innerHTML = "";
    state.container.appendChild(form);

    initializeRecaptcha(state);
    updateSubmitButtonState(state);
  };

  /**
   * Validates the form and submits the data if valid.
   * @param state Current form state containing schema, container, and other properties.
   */
  const validateAndSubmit = (state: FormState) => {
    if (state.isSubmitting) return; // Prevent multiple submissions

    const form = state.container.querySelector("form");
    if (!form) return;

    const formButton: HTMLButtonElement = form.querySelector('button[type="submit"]')!;
    if (!formButton) return;

    formButton.disabled = true;
    formButton.innerHTML = "";
    formButton.appendChild(createLoadingIcon());
    state.isSubmitting = true;

    // Validate reCAPTCHA if configured and enabled
    const isValid = validateRecaptcha(state);

    const isFormValid = validateForm(state);

    if (isValid && isFormValid) {
      const data = getFormData(state);
      if (typeof state.submitAction === "function") {
        state.submitAction(data);
      } else {
        state.isSubmitting = false;
        formButton.textContent = state.submitLabel;
        updateSubmitButtonState(state);
      }
    } else {
      state.isSubmitting = false;
      formButton.textContent = state.submitLabel;
      form.reportValidity();
      updateSubmitButtonState(state);
    }
  };

  const attachLiveValidationListeners = (state: FormState): void => {
    // Select all user-editable elements
    const inputs = state.container.querySelectorAll(
      "input, select, textarea"
    );

    inputs.forEach((input) => {
      // Use 'input' event for immediate feedback on text changes
      // Use 'change' event for elements like dropdowns, checkboxes, etc.
      input.addEventListener("input", () => {
        // 1. Update the state's formData (essential, but likely handled in your field-specific components)
        // 2. Refresh labels/errors for all fields
        refreshLabels(state);
      });

      // Add a 'change' listener as a fallback for elements that don't fire 'input' (like <select>)
      input.addEventListener("change", () => {
        refreshLabels(state);
      });
    });
  };

  return Object.freeze({
    render: async (): Promise<void> => {
      addResponsiveStyles();
      addRTLStyles();
      if (state.showLanguageSwitcher) {
        addLanguageSwitcherStyles();
      }
      await addRecaptchaScript(state);
      render(state);
      attachLiveValidationListeners(state);
      state.isFormInitialized = true;
    },
    getFormData: (): FormData => getFormData(state),
    updateLanguage: (
      newLanguage: string,
      submitButtonLabel?: string,
      additionalSchema?: AdditionalSchema
    ): void =>
      updateLanguage(state, newLanguage, submitButtonLabel, additionalSchema),
  });
};

/**
 * Creates a form element based on the control type specified in the field.
 * It supports various control types such as textbox, password, date, and dropdown.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form element based on the control type.
 */
const createFormElement = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  // Set default type to 'string' if not specified
  const fieldType = field.type || InputType.STRING;

  switch (field.controlType) {
    case ControlType.TEXTBOX:
      return fieldType === InputType.SIMPLE_TYPE
        ? createSimpleTextbox(state, field)
        : createStringField(state, field);
    case ControlType.TEXTAREA:
      return createTextareaField(state, field);
    case ControlType.PASSWORD:
      return createPasswordField(state, field);
    case ControlType.DATE:
      return createDateField(state, field);
    case ControlType.DROPDOWN:
      return createDropdownField(state, field);
    case ControlType.CHECKBOX:
      return createCheckboxField(state, field);
    case ControlType.RADIO:
      return createRadioField(state, field);
    case ControlType.FILE:
      return createFileUploadField(state, field);
    case ControlType.PHONE:
      return createPhoneField(state, field);
    case ControlType.PHOTO:
      return createPhotoField(state, field);
    default:
      throw new Error(`Unsupported control type: ${field.controlType}`);
  }
};

/**
 * Groups form fields by their alignment group.
 * Each field can belong to a specific alignment group, or be assigned a solo group based on its ID.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @returns {[key: string]: FormField[]} An object where keys are alignment group names and values are arrays of fields in that group.
 */
const groupFields = (state: FormState): { [key: string]: FormField[] } =>
  state.schema.reduce(
    (acc, field) => {
      const group = field.alignmentGroup || `solo_${field.id}`;
      acc[group] = acc[group] || [];
      acc[group].push(field);
      return acc;
    },
    {} as { [key: string]: FormField[] }
  );

/**
 * Gets the current form data from the state.
 * This function returns a copy of the formData object to avoid direct mutations.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @returns {FormData} An object containing the current form data.
 */
const getFormData = (state: FormState): FormData => {
  const modifiedData = state.schema.reduce((pv: FormData, field: FormField) => {
    const stored = state.formData[field.id];

    // ---------- FILE & PHOTO HANDLING ----------
    if (field.controlType === ControlType.FILE) {
      const isPhoto =
        field.acceptedFileTypes?.some((t) => t.startsWith("image/")) ?? false;

      if (isPhoto) {
        // Photo: always single object
        pv[field.id] =
          stored && typeof stored === "object"
            ? stored
            : { value: "", docType: field.id, format: "" };
        return pv;
      }

      // Documents: always an array
      pv[field.id] = Array.isArray(stored)
        ? stored.filter((item) => item && typeof item === "object")
        : [];
      return pv;
    }

    // ---------- NON-FILE FIELDS ----------
    pv[field.id] = stored ?? "";
    return pv;
  }, {} as FormData);

  // ---------- Add reCAPTCHA if present ----------
  if (state.formData["recaptchaToken"]) {
    modifiedData["recaptchaToken"] = state.formData["recaptchaToken"];
  }

  return modifiedData;
};

/**
 * This function listens for click events on the window and closes any open prefix dropdowns
 * @param event event object from the click event
 */
window.onclick = function (event) {
  if (event.target && !(event.target as any).matches(".prefix-button")) {
    const dropdowns = Array.from(
      document.getElementsByClassName("prefix-dropdown")
    );
    // Loop through all dropdowns and remove the 'show' class
    // to close them if they are open
    dropdowns.forEach((dropdown) => {
      if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
      }
    });
  }
};

export { JsonFormBuilder };
