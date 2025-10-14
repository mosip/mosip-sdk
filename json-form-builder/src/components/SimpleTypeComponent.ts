import { FormState, FormField, KeyValuePair } from "../types";
import {
  getMultiLangText,
  createErrorContainer,
  handleRequiredValidation,
  handleRegexValidation,
  enableCapsLockCheck,
  createInfoIcon,
  getCapsLockSpan,
  getLabelText,
} from "../utils/utils";

/**
 * This function creates a simple textbox form element that supports multilingual labels and validation.
 * It handles multiple languages, required validation, and regex validation.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and input.
 */
export const createSimpleTextbox = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field-group ${field.cssClasses?.join(" ") || ""}`;

  const labelDiv = document.createElement("div");
  labelDiv.className = "label-div-display";

  const mainLabel = document.createElement("label");
  mainLabel.innerHTML = getLabelText(state, field);

  const capsLockSpan = getCapsLockSpan(state, field);

  if (field.info) {
    const infoIcon = createInfoIcon(getMultiLangText(state, field.info));
    mainLabel.appendChild(infoIcon);
  }

  labelDiv.appendChild(mainLabel);
  labelDiv.appendChild(capsLockSpan);

  wrapper.appendChild(labelDiv);

  if (!state.formData[field.id]) {
    state.formData[field.id] = [];
  }

  const languages = Object.keys(field.labelName || {});

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
      // If that language object is present then update the value
      // otherwise add that object with langage & value
      const entries = state.formData[field.id] as KeyValuePair[];
      const entry = entries.find(
        (e: KeyValuePair) => e.language === normalizedLang
      );
      entry
        ? (entry.value = input.value)
        : entries.push({ language: normalizedLang, value: input.value });

      // Store last error type
      state.lastErrors = state.lastErrors || {};
      state.lastErrors[`${field.id}_${lang}`] = lastError;

      input.setCustomValidity(isValid ? "" : "Invalid input");
      input.classList.toggle("error", !isValid);
    };

    input.addEventListener("input", validate);
    input.addEventListener("change", validate);

    enableCapsLockCheck(field, wrapper, input);
  });

  return wrapper;
};
