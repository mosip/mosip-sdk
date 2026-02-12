import { FormState } from "../types";
import { appendError } from "./utils";

/**
 * Loads the reCAPTCHA script asynchronously and checks if it is already loaded.
 * @returns {Promise<boolean>} A promise that resolves to true if reCAPTCHA script is loaded successfully, false otherwise.
 */
const loadRecaptcha = (state: FormState): Promise<boolean> => {
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
const addRecaptchaScript = async (state: FormState): Promise<void> => {
  if (state.recaptcha?.enabled !== false && state.recaptcha?.siteKey) {
    const success = await loadRecaptcha(state);
    if (!success) {
      console.error("Failed to initialize reCAPTCHA");
      state.recaptcha.enabled = false;
    }
  }
};

const enableRecaptcha = (state: FormState, form: HTMLElement): void => {
  if (state.recaptcha?.enabled !== false && state.recaptcha?.siteKey) {
    const recaptchaContainer = document.createElement("div");
    recaptchaContainer.id = "recaptcha-container";
    recaptchaContainer.className = "recaptcha-container";
    form.appendChild(recaptchaContainer);
  }
};

const initializeRecaptcha = (state: FormState): void => {
  // Initialize reCAPTCHA if enabled
  if (state.recaptcha?.enabled !== false && state.recaptcha?.siteKey) {
    const recaptchaContainer = document.getElementById("recaptcha-container");
    if (
      recaptchaContainer &&
      window.grecaptcha &&
      typeof window.grecaptcha.render === "function"
    ) {
      try {
        let userInteracted = false;

        const widgetId = window.grecaptcha.render(recaptchaContainer, {
          sitekey: state.recaptcha.siteKey,
          callback: (response) => {
            // Store the response in form data
            state.formData.recaptchaToken = response;
            userInteracted = true;

            // REMOVE error when user completes captcha
            const recaptchaContainer = document.getElementById("recaptcha-container");
            const errorDiv = recaptchaContainer?.querySelector(".recaptcha-error");
            if (errorDiv) errorDiv.innerHTML = "";
          },
          "expired-callback": () => {
            delete state.formData.recaptchaToken;
            userInteracted = true;
          },
        });
        // Store the widget ID for later use
        recaptchaContainer.setAttribute("data-widget-id", widgetId.toString());

        setInterval(() => {
          try {
            const widgetIdAttr = recaptchaContainer.getAttribute("data-widget-id");
            if (!widgetIdAttr) return;

            const response = window.grecaptcha?.getResponse?.(Number(widgetIdAttr));

            if (!response) {
              delete state.formData.recaptchaToken;

              if (!userInteracted) return;

              let errorDiv = recaptchaContainer.querySelector(".recaptcha-error") as HTMLDivElement;

              if (!errorDiv) {
                errorDiv = document.createElement("div");
                errorDiv.className = "recaptcha-error";
                recaptchaContainer.appendChild(errorDiv);
              }

              appendError(errorDiv, "Please complete the reCAPTCHA", state);
            }
          } catch { }
        }, 0);
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

const reInitializeRecaptcha = (state: FormState): void => {
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

              // REMOVE error when user completes captcha
              const recaptchaContainer = document.getElementById("recaptcha-container");
              const errorDiv = recaptchaContainer?.querySelector(".recaptcha-error");
              if (errorDiv) errorDiv.innerHTML = "";
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
};

const validateRecaptcha = (state: FormState): boolean => {
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

          let errorDiv = recaptchaContainer.querySelector(
            ".recaptcha-error"
          ) as HTMLDivElement | null;
          if (!recaptchaResponse) {
            return false;
          }

          // captcha valid → REMOVE error
          if (errorDiv) errorDiv.innerHTML = "";
        } catch (error) {
          console.error("Failed to validate reCAPTCHA:", error);
          return false;
        }
      }
    }
  }
  // If reCAPTCHA is not enabled or site key is not provided, return true
  // If reCaptchaContainer is not found, return true
  // If widgetId is not found, return true
  // If reCAPTCHA response has success, return true
  return true;
};

export {
  enableRecaptcha,
  addRecaptchaScript,
  initializeRecaptcha,
  loadRecaptcha,
  reInitializeRecaptcha,
  validateRecaptcha,
};
