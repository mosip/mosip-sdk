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

// Refresh all labels without losing form data
const refreshLabels = (state: FormState): void => {
  state.schema.forEach(field => {
    // Get the label text for the current language
    const labelText = getLabelText(state, field);

    if (field.type === 'simpleType') {
      // For simpleType fields, update the main label
      const fieldGroup = state.container.querySelector(`.form-field-group input[data-field-id="${field.id}"]`)?.closest('.form-field-group');
      const mainLabel = fieldGroup?.querySelector('label');
      if (mainLabel) {
        mainLabel.innerHTML = labelText;
      }

      // Update placeholders for each language input
      const inputs = state.container.querySelectorAll(`input[data-field-id="${field.id}"]`);
      inputs.forEach(input => {
        const lang = (input as HTMLInputElement).dataset.lang;
        if (lang) {
          const placeholderText = field.label[lang] || field.label[state.currentLanguage] || field.label[state.defaultLanguage] || '';
          (input as HTMLInputElement).placeholder = placeholderText;
        }
      });
    } else {
      // For regular fields, update the label
      const labelElement = state.container.querySelector(`label[for="${field.id}"]`);
      if (labelElement) {
        labelElement.innerHTML = labelText;
      }

      // Update placeholder if it exists
      const input = state.container.querySelector(`input#${field.id}`) as HTMLInputElement;
      if (input) {
        const placeholderText = field.label[state.currentLanguage] || field.label[state.defaultLanguage] || '';
        input.placeholder = placeholderText;
      }
    }

    // Update dropdown options if it's a dropdown field
    if (field.controlType === 'dropdown') {
      const select = state.container.querySelector(`select#${field.id}`) as HTMLSelectElement;
      if (select) {
        const selectedValue = select.value;
        select.innerHTML = '';
        
        // Add placeholder option
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Select an Option';
        placeholder.disabled = true;
        placeholder.selected = true;
        placeholder.hidden = true;
        select.appendChild(placeholder);

        // Add options with current language labels
        Object.entries(state.allowedValues[field.id] || {}).forEach(([value, labels]) => {
          const option = document.createElement('option');
          option.value = value;
          option.textContent = labels[state.currentLanguage] || labels[state.defaultLanguage] || Object.values(labels)[0];
          option.selected = value === selectedValue;
          select.appendChild(option);
        });
      }
    }
  });
};

// Helper function to get label text with required indicator
const getLabelText = (state: FormState, field: FormField): string => {
  let labelText = '';

  // Try to get label in current language
  if (field.label[state.currentLanguage]) {
    labelText = field.label[state.currentLanguage];
  } 
  // Fallback to default language
  else if (field.label[state.defaultLanguage]) {
    labelText = field.label[state.defaultLanguage];
  }
  // Fallback to any available label
  else {
    const availableLabels = Object.values(field.label);
    if (availableLabels.length > 0) {
      labelText = availableLabels[0];
    }
  }

  // Add required indicator if needed
  if (field.required) {
    labelText += '<span class="required">*</span>';
  }

  return labelText;
};

// Update language and refresh labels
const updateLanguage = (state: FormState, newLanguage: string): void => {
  state.currentLanguage = newLanguage;
  state.isRTL = state.rtlLanguages.includes(newLanguage);
  state.container.dir = state.isRTL ? 'rtl' : 'ltr';
  state.container.style.direction = state.isRTL ? 'rtl' : 'ltr';
  
  // Update reCAPTCHA language if enabled
  if (state.recaptcha?.enabled !== false && state.recaptcha?.siteKey && window.grecaptcha) {
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (recaptchaContainer) {
      const widgetId = recaptchaContainer.getAttribute('data-widget-id');
      if (widgetId) {
        try {
          // Reset and remove the current widget
          window.grecaptcha.reset(Number(widgetId));
          
          // Create a new container for the reCAPTCHA
          const newContainer = document.createElement('div');
          newContainer.id = 'recaptcha-container';
          newContainer.className = 'recaptcha-container';
          
          // Replace the old container with the new one
          recaptchaContainer.parentNode?.replaceChild(newContainer, recaptchaContainer);
          
          // Create new widget with updated language
          const newWidgetId = window.grecaptcha.render(newContainer, {
            sitekey: state.recaptcha.siteKey,
            callback: (response) => {
              state.formData.recaptchaToken = response;
            },
            'expired-callback': () => {
              delete state.formData.recaptchaToken;
            }
          });
          
          // Update the widget ID
          newContainer.setAttribute('data-widget-id', newWidgetId.toString());
        } catch (error) {
          console.error('Failed to update reCAPTCHA language:', error);
        }
      }
    }
  }
  
  refreshLabels(state);
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
    mandatoryLanguages: config.mandatoryLanguages || ["eng"],
    optionalLanguages: config.optionalLanguages || [],
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
      [...(config.mandatoryLanguages || ["eng"]), ...(config.optionalLanguages || [])],
    rtlLanguages: additionalConfig.language?.rtlLanguages || ['ara', 'ar', 'he', 'fa', 'ur'],
    isRTL: false,
    recaptcha: additionalConfig.recaptcha
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
      el.dispatchEvent(new Event("input"));
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
          // Handle simpleType fields
          if (!state.formData[fieldId]) {
            state.formData[fieldId] = {};
          }
          if (input.value) {
            (state.formData[fieldId] as { [key: string]: string })[lang] = input.value;
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
    updateLanguage: (newLanguage: string): void => updateLanguage(state, newLanguage)
  });
};

const createErrorContainer = (): HTMLDivElement => {
  const errorContainer = document.createElement("div");
  errorContainer.className = "error-message";
  return errorContainer;
};

const appendError = (container: HTMLDivElement, message: string): void => {
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
    textNode.textContent = message;
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

  const errorContainer = createErrorContainer();

  input.addEventListener('input', () => {
    let isValid = true;
    appendError(errorContainer, '');

    field.validators?.forEach((v) => {
      if (v.type === 'regex' && !new RegExp(v.validator).test(input.value)) {
        isValid = false;
        appendError(errorContainer, v.errorCode);
      }
    });

    if (field.required && !input.value.trim()) {
      isValid = false;
      if (!errorContainer.textContent)
        appendError(errorContainer, 'This field is required');
    }

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

  // Add confirm password field
  const confirmField = document.createElement('div');
  confirmField.className = 'form-field';

  const confirmLabel = document.createElement('label');
  confirmLabel.innerHTML = `Confirm ${getLabelText(state, field)}`;
  confirmField.appendChild(confirmLabel);

  const confirmInput = document.createElement('input');
  confirmInput.className = 'input_box';
  confirmInput.type = 'password';
  confirmInput.id = `${field.id}_confirm`;
  confirmInput.name = `${field.id}_confirm`;
  confirmInput.required = Boolean(field.required);

  const confirmError = createErrorContainer();

  confirmInput.addEventListener('input', () => {
    appendError(confirmError, '');
    if (confirmInput.value !== input.value) {
      appendError(confirmError, 'Passwords do not match');
      confirmInput.setCustomValidity('Passwords do not match');
      confirmInput.classList.add('error');
    } else {
      confirmInput.setCustomValidity('');
      confirmInput.classList.remove('error');
    }
  });

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

  const errorContainer = createErrorContainer();

  input.addEventListener('input', () => {
    let isValid = true;
    appendError(errorContainer, '');

    if (field.required && !input.value) {
      isValid = false;
      if (!errorContainer.textContent)
        appendError(errorContainer, 'This field is required');
    }

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

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select an Option';
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.hidden = true;
  select.appendChild(placeholder);

  Object.entries(state.allowedValues[field.id] || {}).forEach(([value, labels]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = labels[state.currentLanguage] || labels[state.defaultLanguage] || Object.values(labels)[0];
    select.appendChild(option);
  });

  const errorContainer = createErrorContainer();

  select.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    state.formData[field.id] = target.value;
    select.style.color = target.value ? 'black' : '';
    select.dispatchEvent(new Event('input'));
  });

  select.addEventListener('input', () => {
    let isValid = true;
    appendError(errorContainer, '');

    if (field.required && !select.value) {
      isValid = false;
      if (!errorContainer.textContent)
        appendError(errorContainer, 'This field is required');
    }

    select.setCustomValidity(isValid ? '' : 'Invalid input');
    select.classList.toggle('error', !isValid);
  });

  wrapper.appendChild(select);
  wrapper.appendChild(errorContainer);

  return wrapper;
};

const createSimpleTextbox = (state: FormState, field: FormField): HTMLDivElement => {
  const wrapper = document.createElement('div');
  wrapper.className = `form-field-group ${field.cssClasses?.join(' ') || ''}`;

  // Create single label for the field
  const mainLabel = document.createElement('label');
  mainLabel.innerHTML = getLabelText(state, field);
  wrapper.appendChild(mainLabel);

  // Initialize form data object for this field
  if (!state.formData[field.id]) {
    state.formData[field.id] = {};
  }

  const languages = [...state.mandatoryLanguages, ...state.optionalLanguages];

  languages.forEach((lang) => {
    const langWrapper = document.createElement('div');
    langWrapper.className = `form-field lang-${lang}`;

    const input = document.createElement('input');
    input.className = 'input_box';
    input.type = 'text';
    input.id = `${field.id}_${lang}`;
    input.name = `${field.id}_${lang}`;
    input.dataset.lang = lang;
    input.dataset.fieldId = field.id;
    // Set placeholder to the label in the current language
    input.placeholder = field.label[lang] || field.label[state.currentLanguage] || field.label[state.defaultLanguage] || '';

    const errorContainer = createErrorContainer();

    input.addEventListener('input', () => {
      let isValid = true;
      appendError(errorContainer, '');

      // Get validators specific to this language
      const langValidators = field.validators?.filter(v => !v.langCode || v.langCode === lang) || [];

      langValidators.forEach((v) => {
        if (v.type === 'regex' && !new RegExp(v.validator).test(input.value)) {
          isValid = false;
          appendError(errorContainer, v.errorCode);
        }
      });

      if (
        field.required &&
        state.mandatoryLanguages.includes(lang) &&
        !input.value.trim()
      ) {
        isValid = false;
        if (!errorContainer.textContent)
          appendError(errorContainer, 'This field is required');
      }

      input.setCustomValidity(isValid ? '' : 'Invalid input');
      input.classList.toggle('error', !isValid);

      // Update form data on input
      if (!state.formData[field.id]) {
        state.formData[field.id] = {};
      }
      (state.formData[field.id] as { [key: string]: string })[lang] = input.value;
    });

    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (!state.formData[field.id]) {
        state.formData[field.id] = {};
      }
      (state.formData[field.id] as { [key: string]: string })[lang] = target.value;
      input.dispatchEvent(new Event('input'));
    });

    langWrapper.appendChild(input);
    langWrapper.appendChild(errorContainer);
    wrapper.appendChild(langWrapper);
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

  const errorContainer = createErrorContainer();

  input.addEventListener('input', () => {
    let isValid = true;
    appendError(errorContainer, '');

    field.validators?.forEach((v) => {
      if (v.type === 'regex' && !new RegExp(v.validator).test(input.value)) {
        isValid = false;
        appendError(errorContainer, v.errorCode);
      }
    });

    if (field.required && !input.value.trim()) {
      isValid = false;
      if (!errorContainer.textContent)
        appendError(errorContainer, 'This field is required');
    }

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