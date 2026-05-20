import { FormState, FormField } from "../types";
import {
  getMultiLangText,
  disableField,
  createErrorContainer,
  appendError,
  handleRequiredValidation,
  handleRegexValidation,
  createInfoIcon,
  getCapsLockSpan,
  getLabelText,
  emptyInvalidFn,
} from "../utils/utils";

/**
 * Get prefix from a list of prefixes based on the phone number.
 * @param {string[] | undefined} prefixList list of prefixes to check against the phone number
 * @param {string} phoneNumber phone number to check against the prefixes
 * @returns returns the first matching prefix from the list or the first prefix as default
 */
const getPrefix = (
  prefixList: string[] | undefined,
  phoneNumber: string | null | undefined
): string => {
  if (!prefixList || prefixList.length === 0) return "";

  if (!phoneNumber || typeof phoneNumber !== "string") {
    // If phoneNumber is null or undefined, return the first prefix as default
    return prefixList[0];
  }

  // Check if the phone number starts with any of the prefixes
  for (const prefix of prefixList) {
    if (phoneNumber.startsWith(prefix)) {
      return prefix;
    }
  }

  // If no prefix matches, return the first prefix as default
  return prefixList[0];
};

/**
 * Creates a prefix dropdown element for a form field.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field object containing prefix options
 * @param {HTMLInputElement} prefixButton Prefix button element to update with selected prefix
 * @returns {HTMLDivElement | null} Prefix dropdown element or null if no prefixes are available
 */
const createPrefixDropdown = (
  state: FormState,
  field: FormField,
  prefixButton: HTMLInputElement
): HTMLDivElement | null => {
  if (field.prefix && field.prefix.length > 1) {
    const prefixDropdown = document.createElement("div");
    prefixDropdown.className = "prefix-dropdown";

    field.prefix.forEach((prefix) => {
      const prefixOption = document.createElement("a");
      prefixOption.className = "prefix-option";
      prefixOption.textContent = prefix;
      prefixOption.addEventListener("click", (e) => {
        e.preventDefault();
        if (prefixButton) {
          prefixButton.value = prefix;
          state.formData[`${field.id}_prefix`] = prefix;
        }
        prefixDropdown.classList.remove("show");
      });
      prefixDropdown.appendChild(prefixOption);
    });
    return prefixDropdown;
  }
  return null;
};

/**
 * Create prefix button for phone input.
 * @param {FormState} state Current form state containing schema, container, and other properties
 * @param {FormField} field Form field object containing type, id, label, required, and other properties
 * @param {HTMLDivElement} wrapper Wrapper HTMLDivElement that contains the form field
 * @param {HTMLDivElement} inputDiv Input HTMLDivElement that will have the prefix button
 * @param {string} prefixValue Prefix value to be displayed in the button
 * @return {HTMLDivElement | null} A div element containing the prefix button and dropdown if applicable
 */
const addPrefixButton = (
  state: FormState,
  field: FormField,
  wrapper: HTMLDivElement,
  inputDiv: HTMLDivElement,
  prefixValue: string
): HTMLInputElement | null => {
  if (!prefixValue) {
    return null;
  }

  const prefixButton = document.createElement("input");
  prefixButton.type = "text";
  prefixButton.className = "input_box prefix-button";
  prefixButton.oninvalid = emptyInvalidFn(prefixButton);
  prefixButton.readOnly = true;

  // if allowedValues exist, use that as the prefix
  // otherwise, use the first prefix value if available
  prefixButton.value = prefixValue;
  state.formData[`${field.id}_prefix`] = prefixValue; // Initialize formData with prefix

  // Add event listener to toggle dropdown on click
  prefixButton.addEventListener("click", (e) => {
    e.preventDefault();

    if (field.prefix && field.prefix.length > 1) {
      const dropdown = wrapper.querySelector(".prefix-dropdown");
      dropdown?.classList.toggle("show");
    }
  });

  // prevent manual input in the prefix button
  prefixButton.addEventListener("keydown", (e) => {
    e.preventDefault();
  });

  inputDiv.appendChild(prefixButton);
  inputDiv.appendChild(document.createElement("hr"));

  if (field.disabled || false) {
    disableField(prefixButton);
  } else {
    const prefixDropdown = createPrefixDropdown(state, field, prefixButton);
    if (prefixDropdown) {
      inputDiv.appendChild(prefixDropdown);
    }
  }
  return prefixButton;
};

/**
 * This function creates a phone input form element with a prefix dropdown if applicable.
 * @param {FormState} state state of the form containing schema, container, and other properties.
 * @param {FormField} field field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label, input, and prefix dropdown.
 */
export const createPhoneField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field ${field.cssClasses?.join(" ") || ""}`;

  const labelDiv = document.createElement("div");
  labelDiv.className = "label-div-display";

  const label = document.createElement("label");
  label.innerHTML = getLabelText(state, field);
  label.htmlFor = field.id;

  const capsLockSpan = getCapsLockSpan(state, field);

  if (field.info) {
    const infoIcon = createInfoIcon(getMultiLangText(state, field.info));
    label.appendChild(infoIcon);
  }

  labelDiv.appendChild(label);
  labelDiv.appendChild(capsLockSpan);

  wrapper.appendChild(labelDiv);

  const inputDiv = document.createElement("div");
  inputDiv.className = "phone-div-display";

  const prefixValue = getPrefix(
    field.prefix,
    state.prefilledValues ? (state.prefilledValues[field.id] as string) : (state.allowedValues[field.id] as string) || ""
  );

  const prefixButton = addPrefixButton(
    state,
    field,
    wrapper,
    inputDiv,
    prefixValue
  );

  const input = document.createElement("input");
  input.className = "input_box phone_input";
  input.type = "tel";
  input.id = field.id;
  input.name = field.id;
  input.oninvalid = emptyInvalidFn(input);
  input.dataset.fieldId = field.id;
  // remove prefixValue from allowedValues string
  if (
    state.prefilledValues && state.prefilledValues[field.id] &&
    typeof state.prefilledValues[field.id] === "string"
  ) {
    const val = state.prefilledValues[field.id]
    input.value = (val as string).trim().startsWith(prefixValue) ? val.slice(prefixValue.length) : val;
  }
  input.placeholder = getMultiLangText(state, field.placeholder);

  inputDiv.appendChild(input);

  if (field.disabled || false) {
    disableField(input);
  }

  const errorContainer = createErrorContainer();

  // allow only digit in input field
  // TODO: when pasting user able to add alphabet as well
  // had to stop that
  input.addEventListener("keydown", (event) => {
    const allowedKeyCodes = [
      "Backspace",
      "Tab",
      "Control",
      "End",
      "Home",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
    ];

    const allowedMultiKeys = ["a", "c", "x", "v"]; // 'v' is for paste
    const keyCode = event.key;

    const multiKeyChecking = (key: string, ctrl: boolean) => {
      // Removed 'value' as it's not used here for paste
      if (
        ctrl &&
        allowedMultiKeys.includes(key.toLowerCase()) // 'v' is handled in the paste event
      ) {
        return true;
      }
      return false;
    };

    if (
      !allowedKeyCodes.includes(keyCode) &&
      !multiKeyChecking(keyCode, event.ctrlKey) &&
      !/[0-9]/.test(event.key)
    ) {
      event.preventDefault();
    }
  });

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
        false,
        state.currentLanguage,
        state.currentLanguage
      );
      lastError = result.lastError;
      isValid = result.isValid;
    }

    state.lastErrors = state.lastErrors || {};
    state.lastErrors[field.id] = lastError;

    input.setCustomValidity(isValid ? "" : "Invalid input");
    input.classList.toggle("error", !isValid);
    if (prefixButton) {
      // Update formData with prefix and input value
      state.formData[field.id] = `${prefixButton.value}${input.value}`;
      prefixButton.setCustomValidity(isValid ? "" : "Invalid input");
      prefixButton.classList.toggle("error", !isValid);
    }
  });

  input.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    state.formData[field.id] =
      (prefixButton ? prefixButton.value : "") + target.value;
    input.dispatchEvent(new Event("input"));
  });

  wrapper.appendChild(inputDiv);
  wrapper.appendChild(errorContainer);

  return wrapper;
};
