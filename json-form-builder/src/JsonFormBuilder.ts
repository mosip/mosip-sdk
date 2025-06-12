import {
  FormConfig,
  FormState,
  FormField,
  FormData,
  Label,
  AdditionalConfig,
} from "./types";

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
  }
}

type LanguageMap = Record<string, string>;
type LabelObject = Record<string, string>;

/**
 * Converts a one-way language map into a two-way map.
 * This allows for bidirectional lookup where both keys and values are language codes.
 * @param {Record<string, string>}oneWayMap A map where keys are language codes and values are their corresponding labels.
 * @returns Two-way map where both keys and values are language codes, allowing for bidirectional lookup.
 */
function buildBidirectionalLanguageMap(
  oneWayMap: Record<string, string>
): Record<string, string> {
  const twoWayMap: Record<string, string> = { ...oneWayMap };

  for (const [key, value] of Object.entries(oneWayMap)) {
    if (!twoWayMap[value]) {
      twoWayMap[value] = key;
    }
  }
  return twoWayMap;
}

/**
 * Create password visibility icon based on the show parameter.
 * if false, it will show the "visibility" icon which can be used to show password,
 * otherwise it will show the "visibility_off" icon which can be used to hide password.
 * @param show Boolean indicating whether to show the password or not.
 * @returns {SVGSVGElement} representing the password visibility icon.
 */
const createPasswordIcon = (show: boolean): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  svg.setAttribute("viewBox", "0 0 22.634 17");
  svg.setAttribute("width", "22.634");
  svg.setAttribute("height", "17");

  if (show) {
    path.setAttribute("id", "visibility_off_FILL0_wght400_GRAD0_opsz48");
    path.setAttribute("transform", "translate(-40 863)");
    path.setAttribute(
      "d",
      "M55.15-853.529l-1.132-1.132a2.552,2.552,0,0,0-.694-3.035,2.748,2.748,0,0,0-2.958-.617l-1.132-1.132a3.109,3.109,0,0,1,.977-.412,4.758,4.758,0,0,1,1.106-.129,4.218,4.218,0,0,1,3.1,1.273,4.218,4.218,0,0,1,1.273,3.1,4.5,4.5,0,0,1-.141,1.119A3.4,3.4,0,0,1,55.15-853.529Zm3.318,3.318-1.029-1.029a12.058,12.058,0,0,0,2.2-2.07,8.264,8.264,0,0,0,1.376-2.3,10.267,10.267,0,0,0-3.858-4.514,10.1,10.1,0,0,0-5.581-1.659,12.367,12.367,0,0,0-2.212.206,8.219,8.219,0,0,0-1.775.489L46.4-862.3a11.666,11.666,0,0,1,2.3-.72,12.727,12.727,0,0,1,2.739-.309,11.611,11.611,0,0,1,6.726,2.1,12.154,12.154,0,0,1,4.463,5.62,12.707,12.707,0,0,1-1.723,3.009A12.422,12.422,0,0,1,58.467-850.211Zm1.492,5.813-4.321-4.244a9.993,9.993,0,0,1-2.032.553,13.6,13.6,0,0,1-2.289.193,11.793,11.793,0,0,1-6.816-2.1,12.286,12.286,0,0,1-4.5-5.62,11.673,11.673,0,0,1,1.428-2.611,14.62,14.62,0,0,1,2.225-2.43l-3.241-3.241L41.492-865l19.471,19.471ZM44.707-859.573a9.469,9.469,0,0,0-1.839,1.826,8.465,8.465,0,0,0-1.273,2.135,10.3,10.3,0,0,0,3.948,4.514,10.991,10.991,0,0,0,5.98,1.659,13.487,13.487,0,0,0,1.672-.1,4,4,0,0,0,1.235-.309L52.783-851.5a2.693,2.693,0,0,1-.694.193,5.015,5.015,0,0,1-.772.064,4.253,4.253,0,0,1-3.086-1.26,4.185,4.185,0,0,1-1.286-3.112,4.686,4.686,0,0,1,.064-.772,3.15,3.15,0,0,1,.193-.694ZM52.552-855.921ZM49.568-854.429Z"
    );
  } else {
    path.setAttribute("id", "visibility_FILL0_wght400_GRAD0_opsz48");
    path.setAttribute("transform", "translate(-40 800)");
    path.setAttribute(
      "d",
      "M51.32-787.911a4.21,4.21,0,0,0,3.1-1.276,4.225,4.225,0,0,0,1.273-3.1,4.21,4.21,0,0,0-1.276-3.1,4.225,4.225,0,0,0-3.1-1.273,4.21,4.21,0,0,0-3.1,1.276,4.225,4.225,0,0,0-1.273,3.1,4.21,4.21,0,0,0,1.276,3.1A4.225,4.225,0,0,0,51.32-787.911Zm-.009-1.492a2.764,2.764,0,0,1-2.039-.842,2.794,2.794,0,0,1-.836-2.045,2.764,2.764,0,0,1,.842-2.039,2.794,2.794,0,0,1,2.045-.836,2.764,2.764,0,0,1,2.039.842,2.794,2.794,0,0,1,.836,2.045,2.764,2.764,0,0,1-.842,2.039A2.794,2.794,0,0,1,51.311-789.4Zm.006,4.836a11.528,11.528,0,0,1-6.79-2.135A13,13,0,0,1,40-792.284a13.006,13.006,0,0,1,4.527-5.582A11.529,11.529,0,0,1,51.317-800a11.529,11.529,0,0,1,6.79,2.135,13.006,13.006,0,0,1,4.527,5.582,13,13,0,0,1-4.527,5.581A11.528,11.528,0,0,1,51.317-784.568ZM51.317-792.284Zm0,6.173A10.351,10.351,0,0,0,57.04-787.8a10.932,10.932,0,0,0,3.974-4.488,10.943,10.943,0,0,0-3.97-4.488,10.33,10.33,0,0,0-5.723-1.685,10.351,10.351,0,0,0-5.727,1.685,11.116,11.116,0,0,0-4,4.488,11.127,11.127,0,0,0,4,4.488A10.33,10.33,0,0,0,51.313-786.111Z"
    );
  }

  svg.appendChild(path);

  return svg;
};

/**
 * Prevents the default action of an event.
 * @param {Event} e Event to prevent default action for.
 */
const preventDefaultFn = (e: Event): void => {
  e.preventDefault();
  return;
};

/**
 * Disables a form field by preventing user input and interaction.
 * @param {HTMLInputElement | HTMLSelectElement} field HTMLInputElement or HTMLSelectElement to disable.
 */
const disableField = (field: HTMLInputElement | HTMLSelectElement): void => {
  field.classList.add("disabled");
  field.disabled = true;
  field.addEventListener("keypress", preventDefaultFn);
  field.addEventListener("keydown", preventDefaultFn);
  field.addEventListener("cut", preventDefaultFn);
  field.addEventListener("paste", preventDefaultFn);
  field.addEventListener("click", preventDefaultFn);
};

/**
 * Gets the label text for a form field, including a required indicator if the field is marked as required.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {LabelObject | undefined} labels Labels object containing multilingual labels for the field.
 * @param {boolean} strictOnly Boolean flag to determine if strict fallback is required.
 * @param {string} currLang Current language code to use for fetching the label.
 * @param {string} defaultLang Default language code to use if no label is found in the current language.
 * @returns {string} The label text for the field, including a required indicator if applicable.
 */
const getMultiLangText = (
  state: FormState,
  labels: LabelObject | undefined,
  strictOnly: boolean = false,
  currLang?: string,
  defaultLang?: string
): string => {
  if (!currLang) {
    currLang =
      state.languageMap[state.currentLanguage] || state.currentLanguage;
  }

  if (!defaultLang) {
    defaultLang =
      state.languageMap[state.defaultLanguage] || state.defaultLanguage;
  }

  if (!labels || state.languageMap[currLang] === undefined) return "";

  const langVariants = [
    currLang,
    state.languageMap[currLang],
    defaultLang,
    state.languageMap[defaultLang],
  ].filter((v): v is string => typeof v === "string");

  for (const variant of langVariants) {
    if (variant in labels) return labels[variant];
  }
  // 🚫 Don't fallback to any label if strictOnly is true
  if (strictOnly) return "";

  // ✅ Otherwise, fallback to the first available label
  return Object.values(labels)[0] || "";
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

    if (field.type === "simpleType") {
      const fieldGroup = state.container
        .querySelector(`.form-field-group input[data-field-id="${field.id}"]`)
        ?.closest(".form-field-group");
      const mainLabel = fieldGroup?.querySelector("label");
      if (mainLabel) {
        mainLabel.innerHTML = labelText;
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
      const labelElement = state.container.querySelector(
        `label[for="${field.id}"]`
      );
      if (labelElement) {
        labelElement.innerHTML = labelText;
      }

      const input = state.container.querySelector(
        `input#${field.id}`
      ) as HTMLInputElement;
      if (input) {
        input.placeholder = getMultiLangText(
          state,
          field.placeholder,
          false,
          lang,
          defaultLang
        );
      }

      if (field.controlType === "password") {
        const confirmLabel: Label = {};
        Object.keys(field.label || {}).forEach((code) => {
          const mapped = state.languageMap[code] || code;
          confirmLabel[mapped] = `Confirm ${field.label[code]}`;
        });

        const confirmLabelElement = state.container.querySelector(
          `label[for="${field.id}_confirm"]`
        );
        if (confirmLabelElement) {
          confirmLabelElement.innerHTML = getLabelText(
            { ...state, schema: [{ ...field, label: confirmLabel }] },
            { ...field, label: confirmLabel }
          );
        }

        const confirmPlaceholder: Label = {};
        Object.keys(field.placeholder || {}).forEach((code) => {
          const mapped = state.languageMap[code] || code;
          if (field.placeholder) {
            confirmPlaceholder[mapped] = `Confirm ${field.placeholder[code]}`;
          }
        });
        const confirmInput = state.container.querySelector(
          `input#${field.id}_confirm`
        ) as HTMLInputElement;
        
        if (confirmInput) {
          confirmInput.placeholder = confirmPlaceholder[lang] || confirmPlaceholder[state.languageMap[lang]] || "";
        }
      }
    }

    if (field.controlType === "dropdown") {
      const select = state.container.querySelector(
        `select#${field.id}`
      ) as HTMLSelectElement;
      if (select) {
        const selectedValue = select.value;
        select.innerHTML = "";

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent =
          getMultiLangText(
            state,
            field.placeholder,
            false,
            lang,
            defaultLang
          ) || "Select an Option";
        placeholder.disabled = true;
        placeholder.selected = true;
        placeholder.hidden = true;
        select.appendChild(placeholder);

        Object.entries(state.allowedValues[field.id] || {}).forEach(
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
            select.appendChild(option);
          }
        );
      }
    }

    const errorContainer = state.container.querySelector(
      `.form-field[data-field-id="${field.id}"] .error-container`
    );

    if (!state.lastErrors) state.lastErrors = {};

    let lastError: "required" | number | null = null;

    // Simple validation example for required and regex validators:
    if (field.required) {
      // find the input(s) for this field (assuming first input for simplicity)
      const inputElement = state.container.querySelector(
        `input[data-field-id="${field.id}"]`
      ) as HTMLInputElement | null;
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

    state.lastErrors[field.id] = lastError;

    // Show error messages if error container exists and error present
    if (errorContainer && lastError != null) {
      let errorText = "";

      if (lastError === "required") {
        const requiredErrors = state.fallbackErrors?.required || {};
        errorText =
          getMultiLangText(state, requiredErrors) || "Invalid value";
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
};

/**
 * Helps to get the label text for a form field, including a required indicator if the field is marked as required.
 * @param {FormState} state form state containing current language and default language
 * @param {FormField} field form field object containing label and required properties
 * @returns {string} The label text for the field, including a required indicator if applicable.
 */
const getLabelText = (state: FormState, field: FormField): string => {
  const lang = state.currentLanguage;
  const defaultLang = state.defaultLanguage;

  let labelText = getMultiLangText(
    state,
    field.label,
    false,
    lang,
    defaultLang
  );

  if (field.required) {
    labelText += '<span class="required">*</span>';
  }

  return labelText;
};

/**
 * Triggers input and change events for all inputs in the form.
 * @param {FormState} state The current form state containing the container and form data.
 */
const triggerAllEvents = (state: FormState) => {
  const inputs = state.container.querySelectorAll("input, select");

  inputs.forEach((input) => {
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
  submitButtonLabel?: string
): void => {
  const normalizedLang = newLanguage || state.languageMap[newLanguage];
  state.currentLanguage = normalizedLang;
  state.isRTL = state.rtlLanguages.includes(normalizedLang);
  state.container.dir = state.isRTL ? "rtl" : "ltr";
  state.container.style.direction = state.isRTL ? "rtl" : "ltr";

  if (
    state.recaptcha?.enabled !== false &&
    state.recaptcha?.siteKey &&
    window.grecaptcha
  ) {
    const recaptchaContainer = document.getElementById("recaptcha-container");
    if (recaptchaContainer) {
      const widgetId = recaptchaContainer.getAttribute("data-widget-id");
      if (widgetId) {
        try {
          window.grecaptcha.reset(Number(widgetId));

          const newContainer = document.createElement("div");
          newContainer.id = "recaptcha-container";
          newContainer.className = "recaptcha-container";

          recaptchaContainer.parentNode?.replaceChild(
            newContainer,
            recaptchaContainer
          );

          const newWidgetId = window.grecaptcha.render(newContainer, {
            sitekey: state.recaptcha.siteKey,
            callback: (response) => {
              state.formData.recaptchaToken = response;
            },
            "expired-callback": () => {
              delete state.formData.recaptchaToken;
            },
          });

          newContainer.setAttribute("data-widget-id", newWidgetId.toString());
        } catch (error) {
          console.error("Failed to update reCAPTCHA language:", error);
        }
      }
    }
  }

  if (submitButtonLabel) {
    state.submitLabel = submitButtonLabel;
  }
  refreshLabels(state);
  triggerAllEvents(state);
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
 * Handles the required validation for a form field.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {string} normalizedLang Current language code normalized to a 3-letter code.
 * @param {string} normalizedDefault Default language code normalized to a 3-letter code.
 * @param {HTMLDivElement} errorContainer Error container element where error messages will be appended.
 * @returns { lastError: 'required'; isValid: false }
 */
const handleRequiredValidation = (
  state: FormState,
  errorContainer: HTMLDivElement,
  normalizedLang: string = "",
  normalizedDefault: string = ""
): { lastError: "required"; isValid: false } => {
  const requiredErrors = state.fallbackErrors?.required || {};
  const requiredError =
    getMultiLangText(
      state,
      requiredErrors,
      true,
      normalizedLang,
      normalizedDefault
    ) || "This field is required";

  appendError(errorContainer, requiredError);
  return { lastError: "required", isValid: false };
};

/**
 * Handles regex validation for a form field.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {HTMLDivElement} errorContainer Error container element where error messages will be appended.
 * @param {any[]} validators Validators array containing regex or validator functions.
 * @param {string} value Value to validate against the regex.
 * @param {boolean} useLangCode Language code usage flag to filter validators based on language.
 * @param {string} currentLang Current language code normalized to a 3-letter code.
 * @param {string} defaultLang Default language code normalized to a 3-letter code.
 * @returns { lastError: number | null; isValid: boolean }
 */
const handleRegexValidation = (
  state: FormState,
  errorContainer: HTMLDivElement,
  validators: any[],
  value: string,
  useLangCode: boolean,
  currentLang: string = "",
  defaultLang: string = ""
) => {
  const normalizeToThreeLetterCode = (
    lang: string,
    languageMap: Record<string, string>
  ) => {
    if (lang.length === 3) return lang;
    return languageMap[lang] || lang;
  };

  if (!currentLang) {
    currentLang =
      state.languageMap[state.currentLanguage] || state.currentLanguage;
  }
  if (!defaultLang) {
    defaultLang =
      state.languageMap[state.defaultLanguage] || state.defaultLanguage;
  }
  const normalizedLang = normalizeToThreeLetterCode(
    currentLang,
    state.languageMap
  );

  const filteredValidators = useLangCode
    ? validators.filter((v) => {
        if (!v.langCode) return true;
        const normalizedValidatorLang = normalizeToThreeLetterCode(
          v.langCode,
          state.languageMap
        );
        return normalizedValidatorLang === normalizedLang;
      })
    : validators;

  for (let i = 0; i < filteredValidators.length; i++) {
    const validator = filteredValidators[i];
    const regex = new RegExp(validator.regex || validator.validator);

    if (regex && !regex.test(value)) {
      let errorMsg =
        getMultiLangText(
          state,
          validator.error,
          true,
          currentLang,
          defaultLang
        ) || "Invalid input";

      appendError(errorContainer, errorMsg);
      return { lastError: i, isValid: false };
    }
  }

  return { lastError: null, isValid: true };
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
    fallbackErrors: config.errors || {},
    lastErrors: {},
    languageMap: buildBidirectionalLanguageMap(
      config.language.langCodeMap || {}
    ),
  };

  /**
   * Loads the reCAPTCHA script asynchronously and checks if it is already loaded.
   * @returns {Promise<boolean>} A promise that resolves to true if reCAPTCHA script is loaded successfully, false otherwise.
   */
  const loadRecaptcha = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check if script is already loaded
      if (window.grecaptcha) {
        resolve(true);
        return;
      }

      // Check if script is already in the DOM
      if (document.querySelector('script[src*="recaptcha/api.js"]')) {
        // Wait for grecaptcha to be available
        const checkGrecaptcha = () => {
          if (
            window.grecaptcha &&
            typeof window.grecaptcha.render === "function"
          ) {
            resolve(true);
          } else {
            setTimeout(checkGrecaptcha, 100);
          }
        };
        checkGrecaptcha();
        return;
      }

      // Create script element
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?hl=${state.recaptcha?.language || state.currentLanguage}`;
      script.async = true;
      script.defer = true;

      // Add onload handler
      script.onload = () => {
        // Wait for grecaptcha to be available
        const checkGrecaptcha = () => {
          if (
            window.grecaptcha &&
            typeof window.grecaptcha.render === "function"
          ) {
            resolve(true);
          } else {
            setTimeout(checkGrecaptcha, 100);
          }
        };
        checkGrecaptcha();
      };

      // Add error handler
      script.onerror = () => {
        console.error("Failed to load reCAPTCHA script");
        resolve(false);
      };

      document.head.appendChild(script);
    });
  };

  /**
   * Adds the reCAPTCHA script to the document if reCAPTCHA is enabled and site key is provided.
   */
  const addRecaptchaScript = async (): Promise<void> => {
    if (state.recaptcha?.enabled !== false && state.recaptcha?.siteKey) {
      const success = await loadRecaptcha();
      if (!success) {
        console.error("Failed to initialize reCAPTCHA");
        state.recaptcha.enabled = false;
      }
    }
  };

  /**
   * Adds responsive styles to the form elements to ensure they are displayed correctly on different screen sizes.
   */
  const addResponsiveStyles = (): void => {
    const style = document.createElement("style");
    style.textContent = `
      .form-group {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 0rem;
      }

      .form-field {
        flex: 1;
        min-width: 250px;
        margin-bottom: 0.5rem;
      }

      .form-field-group {
        flex: 1;
        min-width: 250px;
        margin-bottom: 0.5rem;
      }

      .input_box {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.9rem;
      }

      .language-switcher label {
        display: flex;
        align-items: center;
        font-size: 0.9rem;
      }

      .recaptcha-container {
        margin: 1rem 0;
        display: flex;
        justify-content: center;
      }
      
      .password-container {
        position: relative;
      }

      .password-eye-icon {
        position: absolute;
        right: 0.75rem; /* Position from the right edge of the input */
        transform: translateY(120%); /* Adjust for perfect vertical centering */
        cursor: pointer;
        color: #6B7280; /* A neutral gray color */
        font-size: 1.25rem; /* Adjust icon size */
        line-height: 1; /* Ensure icon doesn't affect line height */
        user-select: none;
      }

      .checkbox-container {
        display: flex; /* Use flexbox to align checkbox and label */
        gap: 1rem; /* Space between checkbox and label (Tailwind gap-2) */
        align-items: center; /* Vertically center the checkbox and label */
      }

      .checkbox-container input[type="checkbox"] {
        width: 1.25rem; /* Tailwind w-5 */
        height: 1.25rem; /* Tailwind h-5 */
        border: 1px solid #d1d5db; /* Tailwind border-gray-300 */
        border-radius: 2px; /* Tailwind rounded */
        cursor: pointer;
        flex-shrink: 0; /* Prevent checkbox from shrinking */
      }

      .checkbox-container label {
        font-size: 14px; /* Tailwind text-base */
        font-weight: 500; /* Tailwind font-medium */
        line-height: 1; /* Tailwind leading-relaxed */
        color: #1f2937; /* Tailwind text-gray-900 */
        cursor: pointer;
        user-select: none; /* Prevent text selection when clicking label */
      }
    `;
    document.head.appendChild(style);
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
   * Adds styles for right-to-left (RTL) languages to ensure proper layout and alignment.
   */
  const addRTLStyles = (): void => {
    const style = document.createElement("style");
    style.textContent = `
      [dir="rtl"] .form-group {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .form-field-group {
        flex-direction: column-reverse;
      }

      [dir="rtl"] .language-switcher {
        justify-content: flex-start;
      }

      [dir="rtl"] .required {
        margin-left: 0;
        margin-right: 4px;
      }

      [dir="rtl"] .error-message {
        text-align: right;
      }

      [dir="rtl"] .form-field label {
        text-align: right;
      }

      [dir="rtl"] .input_box {
        text-align: right;
      }

      [dir="rtl"] .form-button {
        margin-right: auto;
        margin-left: 0;
      }

      @media (max-width: 768px) {
        [dir="rtl"] .form-group {
          flex-direction: column;
        }
      }

      [dir="rtl"] .password-eye-icon {
        left: 0.75rem;
        right: unset;
      }

      [dir="rtl"] .checkbox-container {
        flex-direction: row-reverse; /* Align checkbox and label in RTL */
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
    Object.entries(groupedFields).forEach(([groupName, fields]) => {
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
    if (state.recaptcha?.enabled !== false && state.recaptcha?.siteKey) {
      const recaptchaContainer = document.createElement("div");
      recaptchaContainer.id = "recaptcha-container";
      recaptchaContainer.className = "recaptcha-container";
      form.appendChild(recaptchaContainer);
    }

    // Add submit button
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "form-button";
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

    // Initialize reCAPTCHA if enabled
    if (state.recaptcha?.enabled !== false && state.recaptcha?.siteKey) {
      const recaptchaContainer = document.getElementById("recaptcha-container");
      if (
        recaptchaContainer &&
        window.grecaptcha &&
        typeof window.grecaptcha.render === "function"
      ) {
        try {
          const widgetId = window.grecaptcha.render(recaptchaContainer, {
            sitekey: state.recaptcha.siteKey,
            callback: (response) => {
              // Store the response in form data
              state.formData.recaptchaToken = response;
            },
            "expired-callback": () => {
              // Clear the token when it expires
              delete state.formData.recaptchaToken;
            },
          });
          // Store the widget ID for later use
          recaptchaContainer.setAttribute(
            "data-widget-id",
            widgetId.toString()
          );
        } catch (error) {
          console.error("Failed to initialize reCAPTCHA:", error);
          // Disable reCAPTCHA if initialization fails
          state.recaptcha.enabled = false;
        }
      } else {
        console.warn("reCAPTCHA not available or not properly initialized");
        state.recaptcha.enabled = false;
      }
    }
  };

  /**
   * Validates the form and submits the data if valid.
   * @param state Current form state containing schema, container, and other properties.
   */
  const validateAndSubmit = (state: FormState): void => {
    const form = state.container.querySelector("form");
    if (!form) return;

    let isValid = true;

    // Trigger validation on all inputs
    triggerAllEvents(state);

    // Validate reCAPTCHA if configured and enabled
    if (state.recaptcha?.enabled !== false && state.recaptcha?.siteKey) {
      const recaptchaContainer = document.getElementById("recaptcha-container");
      if (
        recaptchaContainer &&
        window.grecaptcha &&
        typeof window.grecaptcha.getResponse === "function"
      ) {
        const widgetId = recaptchaContainer.getAttribute("data-widget-id");
        if (widgetId) {
          try {
            const recaptchaResponse = window.grecaptcha.getResponse(
              Number(widgetId)
            );
            if (!recaptchaResponse) {
              isValid = false;
              const errorMessage = document.createElement("div");
              errorMessage.className = "error-message";
              errorMessage.textContent = "Please complete the reCAPTCHA";
              recaptchaContainer.appendChild(errorMessage);
            }
          } catch (error) {
            console.error("Failed to validate reCAPTCHA:", error);
            isValid = false;
          }
        }
      }
    }

    if (isValid) {
      // Ensure all form data is up to date
      form.querySelectorAll("input").forEach((el) => {
        const input = el as HTMLInputElement;
        const fieldId = input.dataset.fieldId;
        const lang = input.dataset.lang;

        if (fieldId && lang) {
          // Always normalize to 3-letter code
          const normalizedLang = state.languageMap[lang];

          // Store only if normalization results in a valid 3-letter code
          if (normalizedLang && normalizedLang.length === 3) {
            if (!state.formData[fieldId]) {
              state.formData[fieldId] = {};
            }
            if (input.value) {
              (state.formData[fieldId] as { [key: string]: string })[
                normalizedLang
              ] = input.value;
            }
          }
        } else if (input.id) {
          // Handle regular fields
          if (input.value) {
            state.formData[input.id] = input.value;
          }
        }
      });

      const data = getFormData(state);
      if (typeof state.submitAction === "function") {
        state.submitAction(data);
      } else {
        console.log("Form data:", data);
      }
    } else {
      form.reportValidity();
    }
  };

  return Object.freeze({
    render: async (): Promise<void> => {
      addResponsiveStyles();
      addRTLStyles();
      if (state.showLanguageSwitcher) {
        addLanguageSwitcherStyles();
      }
      await addRecaptchaScript();
      render(state);
    },
    getFormData: (): FormData => getFormData(state),
    updateLanguage: (newLanguage: string, submitButtonLabel: string): void =>
      updateLanguage(state, newLanguage, submitButtonLabel),
  });
};

/**
 * Creates a new div element to be used as an error container.
 * @returns {HTMLDivElement} A new div element to be used as an error container.
 */
const createErrorContainer = (): HTMLDivElement => {
  const errorContainer = document.createElement("div");
  errorContainer.className = "error-message";
  return errorContainer;
};

/**
 * Appends an error message to the specified container.
 * It creates an error icon and a text node, and appends them to the container.
 * @param {HTMLDivElement} container Container element where the error message will be appended.
 * @param {Label|string} message Message to display in the error container, can be a string or a multilingual label object.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 */
const appendError = (
  container: HTMLDivElement,
  message: string | Label, // Label = { [langCode: string]: string }
  state?: FormState
): void => {
  container.innerHTML = "";

  if (message) {
    const icon = document.createElement("img");
    icon.src = "/images/error_icon.svg";
    icon.className = "error-icon";

    icon.onload = () => {
      icon.alt = "error-icon";
      icon.style.display = "inline";
    };

    icon.onerror = () => {
      icon.style.display = "none";
    };

    icon.style.display = "none";

    const textNode = document.createElement("span");
    // If message is object, get multilingual text
    if (typeof message === "object" && state) {
      textNode.textContent = getMultiLangText(state, message);
    } else {
      textNode.textContent = message as string;
    }
    textNode.className = "error-text";

    container.appendChild(icon);
    container.appendChild(textNode);
  }
};

/**
 * Creates a checkbox form element.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and checkbox input.
 */
const createCheckboxField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field checkbox-container ${field.cssClasses?.join(" ") || ""}`;

  const label = document.createElement("label");
  label.htmlFor = field.id;
  label.innerHTML = getLabelText(state, field);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = field.id;
  checkbox.className = "checkbox-input";
  checkbox.name = field.id;
  checkbox.required = Boolean(field.required);
  checkbox.dataset.fieldId = field.id;
  checkbox.checked = Boolean(state.allowedValues?.[field.id] || false);

  if (field.disabled || false) {
    disableField(checkbox);
  }

  const errorContainer = createErrorContainer();

  wrapper.appendChild(checkbox);
  wrapper.appendChild(label);
  // wrapper.appendChild(errorContainer);

  // Optional: Add an event listener to see it working
  checkbox.addEventListener("change", function () {
    let isValid = true;
    let lastError: "required" | number | null = null;
    appendError(errorContainer, "");

    if (field.required && !this.checked) {
      const result = handleRequiredValidation(state, errorContainer);
      lastError = result.lastError;
      isValid = result.isValid;
    }

    state.lastErrors = state.lastErrors || {};
    state.lastErrors[field.id] = lastError;

    checkbox.setCustomValidity(isValid ? "" : "Invalid input");
    checkbox.classList.toggle("error", !isValid);
  });

  const parentNode = document.createElement("div");
  parentNode.className = "form-field-group";

  parentNode.appendChild(wrapper);
  parentNode.appendChild(errorContainer);

  return parentNode;
};

/**
 * Creates a password form element.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and input.
 */
const createPasswordField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field password-container ${field.cssClasses?.join(" ") || ""}`;

  const label = document.createElement("label");
  label.innerHTML = getLabelText(state, field);
  label.htmlFor = field.id;
  wrapper.appendChild(label);

  const input = document.createElement("input");
  input.className = "input_box password-input";
  input.type = "password";
  input.id = field.id;
  input.name = field.id;
  input.required = Boolean(field.required);
  input.dataset.fieldId = field.id;

  input.placeholder = getMultiLangText(state, field.placeholder);

  const eyeIconSpan = document.createElement("span");
  eyeIconSpan.id = `${field.id}_eye`;
  eyeIconSpan.className = "password-eye-icon";

  let eyeIconImg = createPasswordIcon(false);
  eyeIconSpan.appendChild(eyeIconImg);

  eyeIconSpan.addEventListener("click", () => {
    eyeIconSpan.innerHTML = "";
    if (input.type === "password") {
      input.type = "text";
      eyeIconSpan.appendChild(createPasswordIcon(true));
    } else {
      input.type = "password";
      eyeIconSpan.appendChild(createPasswordIcon(false));
    }
  });

  const errorContainer = createErrorContainer();

  const validateInput = () => {
    let isValid = true;
    let lastError: "required" | number | null = null;

    appendError(errorContainer, "");

    const value = input.value.trim();

    // Required validation (multilingual)
    if (field.required && !value) {
      const result = handleRequiredValidation(state, errorContainer);
      lastError = result.lastError;
      isValid = result.isValid;
    }
    // Regex validations
    else if (value && Array.isArray(field.validators)) {
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
    state.lastErrors[field.id] = lastError;

    input.setCustomValidity(isValid ? "" : "Invalid input");
    input.classList.toggle("error", !isValid);
  };

  input.addEventListener("input", validateInput);

  input.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    state.formData[field.id] = target.value;
    input.dispatchEvent(new Event("input"));
  });

  wrapper.appendChild(input);
  wrapper.appendChild(eyeIconSpan);
  wrapper.appendChild(errorContainer);

  // ---- Confirm Password Field ----

  const confirmField = document.createElement("div");
  confirmField.className = "form-field password-container";

  // Build confirm password label with "Confirm" prefix for all languages
  const confirmLabel: Label = {};
  Object.keys(field.label).forEach((lang) => {
    confirmLabel[lang] = `Confirm ${field.label[lang]}`;
  });

  const confirmPlaceholder: Label = {};
  Object.keys(field.placeholder || {}).forEach((lang) => {
    if (field.placeholder !== undefined) {
      confirmPlaceholder[lang] = `Confirm ${field.placeholder[lang]}`;
    }
  });

  const confirmLabelElement = document.createElement("label");
  confirmLabelElement.innerHTML = getMultiLangText(state, confirmLabel);
  confirmLabelElement.htmlFor = `${field.id}_confirm`;
  confirmField.appendChild(confirmLabelElement);

  const confirmInput = document.createElement("input");
  confirmInput.className = "input_box";
  confirmInput.type = "password";
  confirmInput.id = `${field.id}_confirm`;
  confirmInput.name = `${field.id}_confirm`;
  confirmInput.required = Boolean(field.required);
  confirmInput.placeholder = getMultiLangText(state, confirmPlaceholder);

  const confirmEyeIconSpan = document.createElement("span");
  confirmEyeIconSpan.id = `${field.id}_confirm_eye`;
  confirmEyeIconSpan.className = "password-eye-icon";

  let confirmEyeIconImg = createPasswordIcon(false);
  confirmEyeIconSpan.appendChild(confirmEyeIconImg);

  confirmEyeIconSpan.addEventListener("click", () => {
    confirmEyeIconSpan.innerHTML = "";
    if (confirmInput.type === "password") {
      confirmInput.type = "text";
      confirmEyeIconSpan.appendChild(createPasswordIcon(true));
    } else {
      confirmInput.type = "password";
      confirmEyeIconSpan.appendChild(createPasswordIcon(false));
    }
  });

  const confirmError = createErrorContainer();

  const validateConfirm = () => {
    appendError(confirmError, "");

    if (confirmInput.value !== input.value) {
      const mismatchErrors = state.fallbackErrors?.passwordMismatch || {};
      const mismatchError =
        getMultiLangText(state, mismatchErrors, true) ||
        "Passwords do not match";

      appendError(confirmError, mismatchError);
      confirmInput.setCustomValidity(mismatchError);
      confirmInput.classList.add("error");
    } else {
      confirmInput.setCustomValidity("");
      confirmInput.classList.remove("error");
    }
  };

  confirmInput.addEventListener("input", validateConfirm);

  confirmInput.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    state.formData[`${field.id}_confirm`] = target.value;
    confirmInput.dispatchEvent(new Event("input"));
  });

  confirmField.appendChild(confirmInput);
  confirmField.appendChild(confirmEyeIconSpan);
  confirmField.appendChild(confirmError);

  const parentNode = document.createElement("div");
  parentNode.className = "form-field-group";
  parentNode.appendChild(wrapper);
  parentNode.appendChild(confirmField);

  return parentNode;
};

/**
 * Creates a date input form element.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and input.
 */
const createDateField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field ${field.cssClasses?.join(" ") || ""}`;

  const label = document.createElement("label");
  label.innerHTML = getLabelText(state, field);
  label.htmlFor = field.id;
  wrapper.appendChild(label);

  const input = document.createElement("input");
  input.className = "input_box";
  input.type = "date";
  input.id = field.id;
  input.name = field.id;
  input.required = Boolean(field.required);
  input.dataset.fieldId = field.id;

  // Placeholder (optional for date input)
  input.placeholder = getMultiLangText(state, field.placeholder);

  const errorContainer = createErrorContainer();

  const validate = () => {
    let isValid = true;
    let lastError: "required" | null = null;

    appendError(errorContainer, "");

    if (field.required && !input.value) {
      const result = handleRequiredValidation(state, errorContainer);
      lastError = result.lastError;
      isValid = result.isValid;
    }

    state.lastErrors = state.lastErrors || {};
    state.lastErrors[field.id] = lastError;

    input.setCustomValidity(isValid ? "" : "Invalid input");
    input.classList.toggle("error", !isValid);
  };

  input.addEventListener("input", validate);
  input.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    state.formData[field.id] = target.value;
    input.dispatchEvent(new Event("input"));
  });

  wrapper.appendChild(input);
  wrapper.appendChild(errorContainer);

  return wrapper;
};

/**
 * Creates a dropdown select form element.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and select dropdown.
 */
const createDropdownField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field ${field.cssClasses?.join(" ") || ""}`;

  const label = document.createElement("label");
  label.innerHTML = getLabelText(state, field);
  label.htmlFor = field.id;
  wrapper.appendChild(label);

  const select = document.createElement("select");
  select.className = "input_box select-placeholder";
  select.id = field.id;
  select.name = field.id;
  select.required = Boolean(field.required);
  select.dataset.fieldId = field.id;

  // Placeholder
  const placeholder = document.createElement("option");
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

/**
 * This function creates a simple textbox form element that supports multilingual labels and validation.
 * It handles multiple languages, required validation, and regex validation.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and input.
 */
const createSimpleTextbox = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field-group ${field.cssClasses?.join(" ") || ""}`;

  const mainLabel = document.createElement("label");
  mainLabel.innerHTML = getLabelText(state, field);
  wrapper.appendChild(mainLabel);

  if (!state.formData[field.id]) {
    state.formData[field.id] = {};
  }

  const languages = Object.keys(field.label || {});

  // Helper to normalize any lang code to 3-letter code if possible
  const normalizeToThreeLetterCode = (
    lang: string,
    languageMap: Record<string, string>
  ) => {
    if (lang.length === 3) return lang; // already 3-letter
    return languageMap[lang] || lang; // map 2-letter → 3-letter, or fallback
  };

  // Normalize mandatory languages once outside the loop
  const normalizedMandatoryLangs = (state.mandatoryLanguages || []).map((l) =>
    normalizeToThreeLetterCode(l, state.languageMap)
  );

  languages.forEach((lang) => {
    const normalizedLang = normalizeToThreeLetterCode(lang, state.languageMap);

    const langWrapper = document.createElement("div");
    langWrapper.className = `form-field lang-${lang}`;

    const input = document.createElement("input");
    input.className = "input_box";
    input.type = "text";
    input.id = `${field.id}_${lang}`;
    input.name = `${field.id}_${lang}`;
    input.dataset.lang = lang;
    input.dataset.fieldId = field.id;

    input.placeholder = getMultiLangText(
      state,
      field.placeholder,
      false,
      normalizedLang,
      state.defaultLanguage
    );

    const errorContainer = createErrorContainer();
    langWrapper.appendChild(input);
    langWrapper.appendChild(errorContainer);
    wrapper.appendChild(langWrapper);

    const validate = () => {
      let isValid = true;
      let lastError: "required" | number | null = null;
      const value = input.value.trim();

      const currentLang = normalizedLang;
      const defaultLang = normalizeToThreeLetterCode(
        state.languageMap[state.defaultLanguage] || state.defaultLanguage,
        state.languageMap
      );

      errorContainer.innerHTML = ""; // Clear previous errors

      // Check if this language is mandatory (normalized)
      const isMandatoryLang = normalizedMandatoryLangs.includes(currentLang);

      // Required validation only for mandatory languages
      if (isMandatoryLang && field.required && !value) {
        const result = handleRequiredValidation(state, errorContainer);
        lastError = result.lastError;
        isValid = result.isValid;
      }
      // Regex validations
      else if (value && isValid && Array.isArray(field.validators)) {
        const result = handleRegexValidation(
          state,
          errorContainer,
          field.validators,
          value,
          true,
          currentLang,
          defaultLang
        );
        lastError = result.lastError;
        isValid = result.isValid;
      }

      // Store value in form state
      (state.formData[field.id] as Record<string, string>)[normalizedLang] =
        input.value;

      // Store last error type
      state.lastErrors = state.lastErrors || {};
      state.lastErrors[`${field.id}_${lang}`] = lastError;

      input.setCustomValidity(isValid ? "" : "Invalid input");
      input.classList.toggle("error", !isValid);
    };

    input.addEventListener("input", validate);
    input.addEventListener("change", validate);
  });

  return wrapper;
};

/**
 * Creates a string input form element.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and input.
 */
const createStringField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field ${field.cssClasses?.join(" ") || ""}`;

  const label = document.createElement("label");
  label.innerHTML = getLabelText(state, field);
  label.htmlFor = field.id;
  wrapper.appendChild(label);

  const input = document.createElement("input");
  input.className = "input_box";
  input.type = "text";
  input.id = field.id;
  input.name = field.id;
  input.required = Boolean(field.required);
  input.dataset.fieldId = field.id;
  input.value = (state.allowedValues[field.id] as string) || "";
  input.placeholder = getMultiLangText(state, field.placeholder);

  if (field.disabled || false) {
    disableField(input);
  }

  const errorContainer = createErrorContainer();

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
    state.lastErrors[field.id] = lastError;

    input.setCustomValidity(isValid ? "" : "Invalid input");
    input.classList.toggle("error", !isValid);
  });

  input.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    state.formData[field.id] = target.value;
    input.dispatchEvent(new Event("input"));
  });

  wrapper.appendChild(input);
  wrapper.appendChild(errorContainer);

  return wrapper;
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
  const fieldType = field.type || "string";

  switch (field.controlType) {
    case "textbox":
      return fieldType === "simpleType"
        ? createSimpleTextbox(state, field)
        : createStringField(state, field);
    case "password":
      return createPasswordField(state, field);
    case "date":
      return createDateField(state, field);
    case "dropdown":
      return createDropdownField(state, field);
    case "checkbox":
      return createCheckboxField(state, field);
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
const getFormData = (state: FormState): FormData => ({ ...state.formData });

export { JsonFormBuilder };
