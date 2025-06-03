import {
  FormConfig,
  FormState,
  FormField,
  FormData,
  SubmitButtonConfig,
  Label,
  AdditionalConfig,
  LanguageConfig
} from './types';

// Add TypeScript declaration for grecaptcha
declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement, options: { sitekey: string; callback?: (response: string) => void; 'expired-callback'?: () => void; }) => number;
      getResponse: (widgetId?: number) => string;
      reset: (widgetId?: number) => void;
    };
  }
}

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

type LanguageMap = Record<string, string>;
type LabelObject = Record<string, string>;

const getMultiLangText = (
  labels: LabelObject | undefined,
  lang: string,
  defaultLang: string,
  languageMap: LanguageMap,
  strictOnly: boolean = false
): string => {
  if (!labels || languageMap[lang] === undefined) return "";

  const langVariants = [
    lang,
    languageMap[lang],
    defaultLang,
    languageMap[defaultLang]
  ].filter((v): v is string => typeof v === "string");

  for (const variant of langVariants) {
    if (variant in labels) return labels[variant];
  }

  // 🚫 Don't fallback to any label if strictOnly is true
  if (strictOnly) return "";

  // ✅ Otherwise, fallback to the first available label
  return Object.values(labels)[0] || "";
};

// Refresh all labels without losing form data
const refreshLabels = (state: FormState): void => {
  const lang = state.currentLanguage;
  const defaultLang = state.defaultLanguage;

  state.schema.forEach(field => {
    const labelText = getLabelText(state, field);

    if (field.type === 'simpleType') {
      const fieldGroup = state.container.querySelector(`.form-field-group input[data-field-id="${field.id}"]`)?.closest('.form-field-group');
      const mainLabel = fieldGroup?.querySelector('label');
      if (mainLabel) {
        mainLabel.innerHTML = labelText;
      }

      const inputs = state.container.querySelectorAll(`input[data-field-id="${field.id}"]`);
      inputs.forEach(input => {
        const datasetLang = (input as HTMLInputElement).dataset.lang || '';
        const inputLang = datasetLang || lang;

        const labelForLang = getMultiLangText(field.label, inputLang, defaultLang, state.languageMap);
        (input as HTMLInputElement).placeholder = labelForLang;
      });

    } else {
      const labelElement = state.container.querySelector(`label[for="${field.id}"]`);
      if (labelElement) {
        labelElement.innerHTML = labelText;
      }

      const input = state.container.querySelector(`input#${field.id}`) as HTMLInputElement;
      if (input) {
        input.placeholder = getMultiLangText(field.label, lang, defaultLang, state.languageMap);
      }

      if (field.controlType === 'password') {
        const confirmLabel: Label = {};
        Object.keys(field.label || {}).forEach(code => {
          const mapped = state.languageMap[code] || code;
          confirmLabel[mapped] = `Confirm ${field.label[code]}`;
        });

        const confirmLabelElement = state.container.querySelector(`label[for="${field.id}_confirm"]`);
        if (confirmLabelElement) {
          confirmLabelElement.innerHTML = getLabelText(
            { ...state, schema: [{ ...field, label: confirmLabel }] },
            { ...field, label: confirmLabel }
          );
        }

        const confirmInput = state.container.querySelector(`input#${field.id}_confirm`) as HTMLInputElement;
        if (confirmInput) {
          confirmInput.placeholder = getMultiLangText(confirmLabel, lang, defaultLang, state.languageMap);
        }
      }
    }

    if (field.controlType === 'dropdown') {
      const select = state.container.querySelector(`select#${field.id}`) as HTMLSelectElement;
      if (select) {
        const selectedValue = select.value;
        select.innerHTML = '';

        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = getMultiLangText(field.label, lang, defaultLang, state.languageMap) || 'Select an Option';
        placeholder.disabled = true;
        placeholder.selected = true;
        placeholder.hidden = true;
        select.appendChild(placeholder);

        Object.entries(state.allowedValues[field.id] || {}).forEach(([value, labels]) => {
          const option = document.createElement('option');
          option.value = value;
          option.textContent = getMultiLangText(labels, lang, defaultLang, state.languageMap);
          option.selected = value === selectedValue;
          select.appendChild(option);
        });
      }
    }

    const errorContainer = state.container.querySelector(`.form-field[data-field-id="${field.id}"] .error-container`);

    if (!state.lastErrors) state.lastErrors = {};

    let lastError: 'required' | number | null = null;

    // Simple validation example for required and regex validators:
    if (field.required) {
      // find the input(s) for this field (assuming first input for simplicity)
      const inputElement = state.container.querySelector(`input[data-field-id="${field.id}"]`) as HTMLInputElement | null;
      if (inputElement && !inputElement.value.trim()) {
        lastError = 'required';
      } else if (Array.isArray(field.validators) && inputElement) {
        for (let i = 0; i < field.validators.length; i++) {
          const validator = field.validators[i];
          if (validator.regex && !validator.regex.test(inputElement.value)) {
            lastError = i;
            break;
          }
        }
      }
    }

    state.lastErrors[field.id] = lastError;

    // Show error messages if error container exists and error present
    if (errorContainer && lastError != null) {
      const normalizedLang = state.languageMap[state.currentLanguage] || state.currentLanguage;
      const normalizedDefault = state.languageMap[state.defaultLanguage] || state.defaultLanguage;

      let errorText = '';

      if (lastError === 'required') {
        const requiredErrors = state.fallbackErrors?.required || {};
        errorText = getMultiLangText(requiredErrors, normalizedLang, normalizedDefault, state.languageMap) || 'Invalid value';
      } else if (typeof lastError === 'number' && Array.isArray(field.validators)) {
        const validator = field.validators[lastError];
        if (validator && validator.error) {
          errorText = getMultiLangText(validator.error, normalizedLang, normalizedDefault, state.languageMap) || 'Invalid value';
        }
      }

      errorContainer.textContent = errorText;
    } else if (errorContainer) {
      errorContainer.textContent = ''; // clear error if none
    }
  });
};

// Helper function to get label text with required indicator
const getLabelText = (state: FormState, field: FormField): string => {
  const lang = state.currentLanguage;
  const defaultLang = state.defaultLanguage;

  let labelText = getMultiLangText(field.label, lang, defaultLang, state.languageMap);

  if (field.required) {
    labelText += '<span class="required">*</span>';
  }

  return labelText;
};

const triggerAllEvents = (state: FormState) => {
  const inputs = state.container.querySelectorAll('input, select');

  inputs.forEach(input => {
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
};

// Update language and refresh labels
const updateLanguage = (state: FormState, newLanguage: string): void => {
  const normalizedLang = newLanguage || state.languageMap[newLanguage];
  state.currentLanguage = normalizedLang;
  state.isRTL = state.rtlLanguages.includes(normalizedLang);
  state.container.dir = state.isRTL ? 'rtl' : 'ltr';
  state.container.style.direction = state.isRTL ? 'rtl' : 'ltr';

  if (state.recaptcha?.enabled !== false && state.recaptcha?.siteKey && window.grecaptcha) {
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (recaptchaContainer) {
      const widgetId = recaptchaContainer.getAttribute('data-widget-id');
      if (widgetId) {
        try {
          window.grecaptcha.reset(Number(widgetId));

          const newContainer = document.createElement('div');
          newContainer.id = 'recaptcha-container';
          newContainer.className = 'recaptcha-container';

          recaptchaContainer.parentNode?.replaceChild(newContainer, recaptchaContainer);

          const newWidgetId = window.grecaptcha.render(newContainer, {
            sitekey: state.recaptcha.siteKey,
            callback: response => {
              state.formData.recaptchaToken = response;
            },
            'expired-callback': () => {
              delete state.formData.recaptchaToken;
            },
          });

          newContainer.setAttribute('data-widget-id', newWidgetId.toString());
        } catch (error) {
          console.error('Failed to update reCAPTCHA language:', error);
        }
      }
    }
  }

  refreshLabels(state);
  triggerAllEvents(state);
};

// Create language switcher
const createLanguageSwitcher = (state: FormState): HTMLDivElement => {
  const container = document.createElement('div');
  container.className = 'language-switcher';

  const label = document.createElement('label');
  label.textContent = 'Language: ';

  const select = document.createElement('select');
  state.availableLanguages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang;
    option.textContent = lang.toUpperCase();
    option.selected = lang === state.currentLanguage;
    select.appendChild(option);
  });

  select.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    updateLanguage(state, target.value);
  });

  container.appendChild(label);
  container.appendChild(select);
  return container;
};

const JsonFormBuilder = (
  config: FormConfig,
  containerId: string,
  additionalConfig: AdditionalConfig
) => {
  const container = document.getElementById(containerId) || document.querySelector(`#${containerId}`);
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
    showLanguageSwitcher: additionalConfig.language?.showLanguageSwitcher || false,
    languageSwitcherPosition: additionalConfig.language?.languageSwitcherPosition || 'top',
    availableLanguages: additionalConfig.language?.availableLanguages ||
      [...(config.language.mandatory || ["eng"]), ...(config.language.optional || [])],
    rtlLanguages: additionalConfig.language?.rtlLanguages || ['ara', 'ar', 'he', 'fa', 'ur'],
    isRTL: false,
    recaptcha: additionalConfig.recaptcha,
    fallbackErrors: config.errors || {},
    lastErrors: {},
    languageMap: buildBidirectionalLanguageMap(config.language.langCodeMap || {})
  };

  // Load reCAPTCHA script
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
          if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
            resolve(true);
          } else {
            setTimeout(checkGrecaptcha, 100);
          }
        };
        checkGrecaptcha();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?hl=${state.recaptcha?.language || state.currentLanguage}`;
      script.async = true;
      script.defer = true;

      // Add onload handler
      script.onload = () => {
        // Wait for grecaptcha to be available
        const checkGrecaptcha = () => {
          if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
            resolve(true);
          } else {
            setTimeout(checkGrecaptcha, 100);
          }
        };
        checkGrecaptcha();
      };

      // Add error handler
      script.onerror = () => {
        console.error('Failed to load reCAPTCHA script');
        resolve(false);
      };

      document.head.appendChild(script);
    });
  };

  // Add reCAPTCHA script
  const addRecaptchaScript = async (): Promise<void> => {
    if (state.recaptcha?.enabled !== false && state.recaptcha?.siteKey) {
      const success = await loadRecaptcha();
      if (!success) {
        console.error('Failed to initialize reCAPTCHA');
        state.recaptcha.enabled = false;
      }
    }
  };

  // Add responsive styles
  const addResponsiveStyles = (): void => {
    const style = document.createElement('style');
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
    `;
    document.head.appendChild(style);
  };

  // Add language switcher styles
  const addLanguageSwitcherStyles = (): void => {
    const style = document.createElement('style');
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

  // Add RTL styles
  const addRTLStyles = (): void => {
    const style = document.createElement('style');
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
    `;
    document.head.appendChild(style);
  };

  // Update RTL state
  const updateRTLState = (language: string): void => {
    state.isRTL = state.rtlLanguages.includes(language);
    state.container.setAttribute('dir', state.isRTL ? 'rtl' : 'ltr');
    state.container.style.direction = state.isRTL ? 'rtl' : 'ltr';
  };

  // Initialize RTL state
  updateRTLState(state.currentLanguage);

  const render = (state: FormState): void => {
    const form = document.createElement('form');
    form.className = 'form';

    // Add language switcher if enabled
    if (state.showLanguageSwitcher) {
      const languageSwitcher = createLanguageSwitcher(state);
      form.appendChild(languageSwitcher);
    }

    // Group fields by alignment group
    const groupedFields = groupFields(state);

    // Render each group
    Object.entries(groupedFields).forEach(([groupName, fields]) => {
      const group = document.createElement('div');
      group.className = 'form-group';
      group.style.display = 'flex';
      group.style.flexDirection = 'row';

      fields.forEach(field => {
        const fieldElement = createFormElement(state, field);
        group.appendChild(fieldElement);
      });

      form.appendChild(group);
    });

    // Add reCAPTCHA if enabled
    if (state.recaptcha?.enabled !== false && state.recaptcha?.siteKey) {
      const recaptchaContainer = document.createElement('div');
      recaptchaContainer.id = 'recaptcha-container';
      recaptchaContainer.className = 'recaptcha-container';
      form.appendChild(recaptchaContainer);
    }

    // Add submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'form-button';
    submitButton.textContent = state.submitLabel;
    form.appendChild(submitButton);

    // Add form submit handler
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      validateAndSubmit(state);
    });

    // Clear container and append form
    state.container.innerHTML = '';
    state.container.appendChild(form);

    // Initialize reCAPTCHA if enabled
    if (state.recaptcha?.enabled !== false && state.recaptcha?.siteKey) {
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (recaptchaContainer && window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        try {
          const widgetId = window.grecaptcha.render(recaptchaContainer, {
            sitekey: state.recaptcha.siteKey,
            callback: (response) => {
              // Store the response in form data
              state.formData.recaptchaToken = response;
            },
            'expired-callback': () => {
              // Clear the token when it expires
              delete state.formData.recaptchaToken;
            }
          });
          // Store the widget ID for later use
          recaptchaContainer.setAttribute('data-widget-id', widgetId.toString());
        } catch (error) {
          console.error('Failed to initialize reCAPTCHA:', error);
          // Disable reCAPTCHA if initialization fails
          state.recaptcha.enabled = false;
        }
      } else {
        console.warn('reCAPTCHA not available or not properly initialized');
        state.recaptcha.enabled = false;
      }
    }
  };

  const validateAndSubmit = (state: FormState): void => {
    const form = state.container.querySelector("form");
    if (!form) return;

    let isValid = true;

    // Trigger validation on all inputs
    form.querySelectorAll("input, select").forEach((el) => {
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      if (!(el as HTMLInputElement | HTMLSelectElement).checkValidity()) {
        isValid = false;
      }
    });

    // Validate reCAPTCHA if configured and enabled
    if (state.recaptcha?.enabled !== false && state.recaptcha?.siteKey) {
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (recaptchaContainer && window.grecaptcha && typeof window.grecaptcha.getResponse === 'function') {
        const widgetId = recaptchaContainer.getAttribute('data-widget-id');
        if (widgetId) {
          try {
            const recaptchaResponse = window.grecaptcha.getResponse(Number(widgetId));
            if (!recaptchaResponse) {
              isValid = false;
              const errorMessage = document.createElement('div');
              errorMessage.className = 'error-message';
              errorMessage.textContent = 'Please complete the reCAPTCHA';
              recaptchaContainer.appendChild(errorMessage);
            }
          } catch (error) {
            console.error('Failed to validate reCAPTCHA:', error);
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
              (state.formData[fieldId] as { [key: string]: string })[normalizedLang] = input.value;
            }
          }
        }
        else if (input.id) {
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
    updateLanguage: (newLanguage: string): void => updateLanguage(state, newLanguage)
  });
};

const createErrorContainer = (): HTMLDivElement => {
  const errorContainer = document.createElement("div");
  errorContainer.className = "error-message";
  return errorContainer;
};

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
      const normalizedLang = state.languageMap[state.currentLanguage] || state.currentLanguage;
      const normalizedDefault = state.languageMap[state.defaultLanguage] || state.defaultLanguage;
      textNode.textContent = getMultiLangText(message, normalizedLang, normalizedDefault, state.languageMap);
    } else {
      textNode.textContent = message as string;
    }
    textNode.className = "error-text";

    container.appendChild(icon);
    container.appendChild(textNode);
  }
};

const createPasswordField = (state: FormState, field: FormField): HTMLDivElement => {
  const wrapper = document.createElement('div');
  wrapper.className = `form-field ${field.cssClasses?.join(' ') || ''}`;

  const label = document.createElement('label');
  label.innerHTML = getLabelText(state, field);
  label.htmlFor = field.id;
  wrapper.appendChild(label);

  const input = document.createElement('input');
  input.className = 'input_box';
  input.type = 'password';
  input.id = field.id;
  input.name = field.id;
  input.required = Boolean(field.required);
  input.dataset.fieldId = field.id;

  // Language normalization helper function to get current normalized languages on each validation
  const getNormalizedLangs = () => {
    const normalizedLang = state.languageMap[state.currentLanguage] || state.currentLanguage;
    const normalizedDefault = state.languageMap[state.defaultLanguage] || state.defaultLanguage;
    return { normalizedLang, normalizedDefault };
  };

  // Set initial placeholder with current language
  const { normalizedLang: initLang, normalizedDefault: initDefault } = getNormalizedLangs();
  input.placeholder = getMultiLangText(field.label, initLang, initDefault, state.languageMap);

  const errorContainer = createErrorContainer();

  const validateInput = () => {
    const { normalizedLang, normalizedDefault } = getNormalizedLangs();

    let isValid = true;
    let lastError: 'required' | number | null = null;

    appendError(errorContainer, '');

    const value = input.value.trim();

    // Required validation (multilingual)
    if (field.required && !value) {
      const requiredErrors = state.fallbackErrors?.required || {};
      const requiredError = getMultiLangText(
        requiredErrors,
        normalizedLang,
        normalizedDefault,
        state.languageMap,
        true
      ) || 'This field is required';

      appendError(errorContainer, requiredError);
      lastError = 'required';
      isValid = false;

      // Regex validations
    } else if (Array.isArray(field.validators)) {
      for (let i = 0; i < field.validators.length; i++) {
        const validator = field.validators[i];
        if (validator.type === 'regex' && validator.validator) {
          const regex = validator.regex || new RegExp(validator.validator);
          if (!regex.test(value)) {
            let errorMsg = getMultiLangText(
              validator.error,
              normalizedLang,
              normalizedDefault,
              state.languageMap,
              true
            ) || 'Invalid input';

            appendError(errorContainer, errorMsg);
            lastError = i;
            isValid = false;
            break;
          }
        }
      }
    }

    state.lastErrors = state.lastErrors || {};
    state.lastErrors[field.id] = lastError;

    input.setCustomValidity(isValid ? '' : 'Invalid input');
    input.classList.toggle('error', !isValid);
  };

  input.addEventListener('input', validateInput);

  input.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    state.formData[field.id] = target.value;
    input.dispatchEvent(new Event('input'));
  });

  wrapper.appendChild(input);
  wrapper.appendChild(errorContainer);

  // ---- Confirm Password Field ----

  const confirmField = document.createElement('div');
  confirmField.className = 'form-field';

  // Build confirm password label with "Confirm" prefix for all languages
  const confirmLabel: Label = {};
  Object.keys(field.label).forEach(lang => {
    confirmLabel[lang] = `Confirm ${field.label[lang]}`;
  });

  const confirmLabelElement = document.createElement('label');
  confirmLabelElement.innerHTML = getMultiLangText(confirmLabel, initLang, initDefault, state.languageMap);
  confirmLabelElement.htmlFor = `${field.id}_confirm`;
  confirmField.appendChild(confirmLabelElement);

  const confirmInput = document.createElement('input');
  confirmInput.className = 'input_box';
  confirmInput.type = 'password';
  confirmInput.id = `${field.id}_confirm`;
  confirmInput.name = `${field.id}_confirm`;
  confirmInput.required = Boolean(field.required);
  confirmInput.placeholder = getMultiLangText(confirmLabel, initLang, initDefault, state.languageMap);

  const confirmError = createErrorContainer();

  const validateConfirm = () => {
    const { normalizedLang, normalizedDefault } = getNormalizedLangs();

    appendError(confirmError, '');

    if (confirmInput.value !== input.value) {
      const mismatchErrors = state.fallbackErrors?.passwordMismatch || {};
      const mismatchError = getMultiLangText(
        mismatchErrors,
        normalizedLang,
        normalizedDefault,
        state.languageMap,
        true
      ) || 'Passwords do not match';

      appendError(confirmError, mismatchError);
      confirmInput.setCustomValidity(mismatchError);
      confirmInput.classList.add('error');
    } else {
      confirmInput.setCustomValidity('');
      confirmInput.classList.remove('error');
    }
  };

  confirmInput.addEventListener('input', validateConfirm);

  confirmInput.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    state.formData[`${field.id}_confirm`] = target.value;
    confirmInput.dispatchEvent(new Event('input'));
  });

  confirmField.appendChild(confirmInput);
  confirmField.appendChild(confirmError);
  wrapper.appendChild(confirmField);

  return wrapper;
};

const createDateField = (state: FormState, field: FormField): HTMLDivElement => {
  const wrapper = document.createElement('div');
  wrapper.className = `form-field ${field.cssClasses?.join(' ') || ''}`;

  const label = document.createElement('label');
  label.innerHTML = getLabelText(state, field);
  label.htmlFor = field.id;
  wrapper.appendChild(label);

  const input = document.createElement('input');
  input.className = 'input_box';
  input.type = 'date';
  input.id = field.id;
  input.name = field.id;
  input.required = Boolean(field.required);
  input.dataset.fieldId = field.id;

  // Use current language normalized each time for validation, not just once here
  const getNormalizedLangs = () => {
    const normalizedLang = state.languageMap[state.currentLanguage] || state.currentLanguage;
    const normalizedDefault = state.languageMap[state.defaultLanguage] || state.defaultLanguage;
    return { normalizedLang, normalizedDefault };
  };

  // Placeholder (optional for date input)
  const { normalizedLang, normalizedDefault } = getNormalizedLangs();
  input.placeholder = getMultiLangText(
    field.label,
    normalizedLang,
    normalizedDefault,
    state.languageMap
  );

  const errorContainer = createErrorContainer();

  const validate = () => {
    const { normalizedLang, normalizedDefault } = getNormalizedLangs();

    let isValid = true;
    let lastError: 'required' | null = null;

    appendError(errorContainer, '');

    if (field.required && !input.value) {
      const requiredErrors = state.fallbackErrors?.required || {};
      const requiredError = getMultiLangText(
        requiredErrors,
        normalizedLang,
        normalizedDefault,
        state.languageMap,
        true
      ) || 'This field is required';

      appendError(errorContainer, requiredError);
      lastError = 'required';
      isValid = false;
    }

    state.lastErrors = state.lastErrors || {};
    state.lastErrors[field.id] = lastError;

    input.setCustomValidity(isValid ? '' : 'Invalid input');
    input.classList.toggle('error', !isValid);
  };

  input.addEventListener('input', validate);
  input.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    state.formData[field.id] = target.value;
    input.dispatchEvent(new Event('input'));
  });

  wrapper.appendChild(input);
  wrapper.appendChild(errorContainer);

  return wrapper;
};

const createDropdownField = (state: FormState, field: FormField): HTMLDivElement => {
  const wrapper = document.createElement('div');
  wrapper.className = `form-field ${field.cssClasses?.join(' ') || ''}`;

  const label = document.createElement('label');
  label.innerHTML = getLabelText(state, field);
  label.htmlFor = field.id;
  wrapper.appendChild(label);

  const select = document.createElement('select');
  select.className = 'input_box select-placeholder';
  select.id = field.id;
  select.name = field.id;
  select.required = Boolean(field.required);
  select.dataset.fieldId = field.id;

  const normalizedLang = state.languageMap[state.currentLanguage] || state.currentLanguage;
  const normalizedDefault = state.languageMap[state.defaultLanguage] || state.defaultLanguage;

  // Placeholder
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent =
    getMultiLangText(field.label, normalizedLang, normalizedDefault, state.languageMap) ||
    'Select an Option';
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.hidden = true;
  select.appendChild(placeholder);

  // Options
  Object.entries(state.allowedValues[field.id] || {}).forEach(([value, labels]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = getMultiLangText(labels, normalizedLang, normalizedDefault, state.languageMap);
    select.appendChild(option);
  });

  const errorContainer = createErrorContainer();

  const validateSelect = () => {
    const currLang = state.languageMap[state.currentLanguage] || state.currentLanguage;
    const defLang = state.languageMap[state.defaultLanguage] || state.defaultLanguage;

    let isValid = true;
    let lastError: 'required' | null = null;
    appendError(errorContainer, '');

    if (field.required && !select.value) {
      const requiredErrors = state.fallbackErrors?.required || {};
      const requiredError =
        getMultiLangText(requiredErrors, currLang, defLang, state.languageMap, true) ||
        'This field is required';

      appendError(errorContainer, requiredError);
      lastError = 'required';
      isValid = false;
    }

    state.lastErrors = state.lastErrors || {};
    state.lastErrors[field.id] = lastError;

    select.setCustomValidity(isValid ? '' : 'Invalid input');
    select.classList.toggle('error', !isValid);
  };

  select.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    state.formData[field.id] = target.value;
    select.style.color = target.value ? 'black' : '';
    validateSelect();
  });

  select.addEventListener('input', validateSelect);

  wrapper.appendChild(select);
  wrapper.appendChild(errorContainer);

  return wrapper;
};

const createSimpleTextbox = (state: FormState, field: FormField): HTMLDivElement => {
  const wrapper = document.createElement('div');
  wrapper.className = `form-field-group ${field.cssClasses?.join(' ') || ''}`;

  const mainLabel = document.createElement('label');
  mainLabel.innerHTML = getLabelText(state, field);
  wrapper.appendChild(mainLabel);

  if (!state.formData[field.id]) {
    state.formData[field.id] = {};
  }

  const languages = Object.keys(field.label || {});

  // Helper to normalize any lang code to 3-letter code if possible
  const normalizeToThreeLetterCode = (lang: string, languageMap: Record<string, string>) => {
    if (lang.length === 3) return lang; // already 3-letter
    return languageMap[lang] || lang; // map 2-letter → 3-letter, or fallback
  };

  // Normalize mandatory languages once outside the loop
  const normalizedMandatoryLangs = (state.mandatoryLanguages || []).map((l) =>
    normalizeToThreeLetterCode(l, state.languageMap)
  );

  languages.forEach((lang) => {
    const normalizedLang = normalizeToThreeLetterCode(lang, state.languageMap);

    const langWrapper = document.createElement('div');
    langWrapper.className = `form-field lang-${lang}`;

    const input = document.createElement('input');
    input.className = 'input_box';
    input.type = 'text';
    input.id = `${field.id}_${lang}`;
    input.name = `${field.id}_${lang}`;
    input.dataset.lang = lang;
    input.dataset.fieldId = field.id;

    input.placeholder = getMultiLangText(
      field.label,
      normalizedLang,
      state.defaultLanguage,
      state.languageMap
    );

    const errorContainer = createErrorContainer();
    langWrapper.appendChild(input);
    langWrapper.appendChild(errorContainer);
    wrapper.appendChild(langWrapper);

    const validate = () => {
      let isValid = true;
      let lastError: 'required' | number | null = null;
      const value = input.value.trim();

      const currentLang = normalizedLang;
      const defaultLang = normalizeToThreeLetterCode(state.languageMap[state.defaultLanguage] || state.defaultLanguage, state.languageMap);

      errorContainer.innerHTML = ''; // Clear previous errors

      // Check if this language is mandatory (normalized)
      const isMandatoryLang = normalizedMandatoryLangs.includes(currentLang);

      // Required validation only for mandatory languages
      if (isMandatoryLang && field.required && !value) {
        const requiredErrors = state.fallbackErrors?.required || {};
        const requiredError = getMultiLangText(
          requiredErrors,
          currentLang,
          defaultLang,
          state.languageMap,
          true
        ) || 'This field is required';

        appendError(errorContainer, requiredError);
        lastError = 'required';
        isValid = false;
      }

      // Regex validations
      if (isValid && Array.isArray(field.validators)) {
        const langValidators = field.validators.filter((v) => {
          if (!v.langCode) return true;

          const normalizedValidatorLang = normalizeToThreeLetterCode(v.langCode, state.languageMap);
          return normalizedValidatorLang === normalizedLang;
        });

        for (let i = 0; i < langValidators.length; i++) {
          const validator = langValidators[i];
          const regex = validator.regex || (validator.validator && new RegExp(validator.validator));

          if (regex && !regex.test(value)) {
            let errorMsg = getMultiLangText(
              validator.error,
              currentLang,
              defaultLang,
              state.languageMap,
              true
            );

            if (!errorMsg) {
              errorMsg = 'Invalid input';
            }

            appendError(errorContainer, errorMsg);
            lastError = i;
            isValid = false;
            break;
          }
        }
      }

      // Store value in form state
      (state.formData[field.id] as Record<string, string>)[normalizedLang] = input.value;

      // Store last error type
      state.lastErrors = state.lastErrors || {};
      state.lastErrors[`${field.id}_${lang}`] = lastError;

      input.setCustomValidity(isValid ? '' : 'Invalid input');
      input.classList.toggle('error', !isValid);
    };

    input.addEventListener('input', validate);
    input.addEventListener('change', validate);
  });

  return wrapper;
};

const createStringField = (state: FormState, field: FormField): HTMLDivElement => {
  const wrapper = document.createElement('div');
  wrapper.className = `form-field ${field.cssClasses?.join(' ') || ''}`;

  const label = document.createElement('label');
  label.innerHTML = getLabelText(state, field);
  label.htmlFor = field.id;
  wrapper.appendChild(label);

  const input = document.createElement('input');
  input.className = 'input_box';
  input.type = 'text';
  input.id = field.id;
  input.name = field.id;
  input.required = Boolean(field.required);
  input.dataset.fieldId = field.id;

  // Set placeholder once here; update dynamically elsewhere if needed
  const normalizedLang = state.languageMap[state.currentLanguage] || state.currentLanguage;
  const normalizedDefault = state.languageMap[state.defaultLanguage] || state.defaultLanguage;

  input.placeholder = getMultiLangText(
    field.label,
    normalizedLang,
    normalizedDefault,
    state.languageMap
  );

  const errorContainer = createErrorContainer();

  input.addEventListener('input', () => {
    // Move language normalization here to always use current language
    const normalizedLang = state.languageMap[state.currentLanguage] || state.currentLanguage;
    const normalizedDefault = state.languageMap[state.defaultLanguage] || state.defaultLanguage;

    let isValid = true;
    let lastError: 'required' | number | null = null;
    appendError(errorContainer, '');

    const value = input.value.trim();

    if (field.required && !value) {
      const requiredErrors = state.fallbackErrors?.required || {};
      const requiredError = getMultiLangText(
        requiredErrors,
        normalizedLang,
        normalizedDefault,
        state.languageMap,
        true
      ) || 'This field is required';

      appendError(errorContainer, requiredError);
      lastError = 'required';
      isValid = false;

    } else if (Array.isArray(field.validators)) {
      for (let i = 0; i < field.validators.length; i++) {
        const validator = field.validators[i];
        if (validator.regex && !validator.regex.test(value)) {
          let errorMsg = getMultiLangText(
            validator.error,
            normalizedLang,
            normalizedDefault,
            state.languageMap,
            true
          );

          // ✅ Fallback: if no matching error message in currentLang or defaultLang
          if (!errorMsg) {
            errorMsg = 'Invalid input';
          }

          appendError(errorContainer, errorMsg || 'Invalid input');
          lastError = i;
          isValid = false;
          break;
        }
      }
    }

    state.lastErrors = state.lastErrors || {};
    state.lastErrors[field.id] = lastError;

    input.setCustomValidity(isValid ? '' : 'Invalid input');
    input.classList.toggle('error', !isValid);
  });

  input.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    state.formData[field.id] = target.value;
    input.dispatchEvent(new Event('input'));
  });

  wrapper.appendChild(input);
  wrapper.appendChild(errorContainer);

  return wrapper;
};

const createFormElement = (state: FormState, field: FormField): HTMLDivElement => {
  // Set default type to 'string' if not specified
  const fieldType = field.type || 'string';

  switch (field.controlType) {
    case 'textbox':
      return fieldType === 'simpleType' ? createSimpleTextbox(state, field) : createStringField(state, field);
    case 'password':
      return createPasswordField(state, field);
    case 'date':
      return createDateField(state, field);
    case 'dropdown':
      return createDropdownField(state, field);
    default:
      throw new Error(`Unsupported control type: ${field.controlType}`);
  }
};

const groupFields = (state: FormState): { [key: string]: FormField[] } =>
  state.schema.reduce((acc, field) => {
    const group = field.alignmentGroup || `solo_${field.id}`;
    acc[group] = acc[group] || [];
    acc[group].push(field);
    return acc;
  }, {} as { [key: string]: FormField[] });

const getFormData = (state: FormState): FormData => ({ ...state.formData });

export { JsonFormBuilder }; 