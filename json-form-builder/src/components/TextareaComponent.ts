import { FormState, FormField } from "../types";
import {
    getMultiLangText,
    disableField,
    createErrorContainer,
    appendError,
    handleRequiredValidation,
    handleRegexValidation,
    enableCapsLockCheck,
    createInfoIcon,
    getCapsLockSpan,
    getLabelText,
    emptyInvalidFn,
} from "../utils/utils";

/**
 * Creates a textarea form element.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing type, id, label, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the form field with its label and textarea.
 */
export const createTextareaField = (
    state: FormState,
    field: FormField
): HTMLDivElement => {
    const wrapper = document.createElement("div");
    wrapper.className = `form-field ${field.cssClasses?.join(" ") || ""}`;
    wrapper.dataset.fieldId = field.id;

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

    const textarea = document.createElement("textarea");
    textarea.className = "input_box";
    textarea.id = field.id;
    textarea.name = field.id;
    textarea.rows = field.rows || 2;
    textarea.oninvalid = emptyInvalidFn(textarea);
    textarea.dataset.fieldId = field.id;
    textarea.value = (state.allowedValues?.[field.id] as string) || "";
    textarea.placeholder = getMultiLangText(state, field.placeholder);

    if (field.disabled || false) {
        disableField(textarea);
    }

    if (
        state.prefilledValues && state.prefilledValues[field.id] &&
        typeof state.prefilledValues[field.id] === "string"
    ) {
        const result = (state.prefilledValues[field.id] as string).trim();
        textarea.value = result;
        state.formData[textarea.id] = result;
    }

    const errorContainer = createErrorContainer();

    // Even though caps lock is uncommon for textarea, keeping it "EXACTLY similar"
    enableCapsLockCheck(field, wrapper, textarea);

    textarea.addEventListener("input", () => {
        let isValid = true;
        let lastError: "required" | number | null = null;
        appendError(errorContainer, "");

        const value = textarea.value.trim();

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
                true,
                state.currentLanguage,
                state.currentLanguage
            );
            lastError = result.lastError;
            isValid = result.isValid;
        }

        state.lastErrors = state.lastErrors || {};
        state.lastErrors[field.id] = lastError;

        textarea.setCustomValidity(isValid ? "" : "Invalid input");
        textarea.classList.toggle("error", !isValid);
    });

    textarea.addEventListener("change", (e) => {
        const target = e.target as HTMLTextAreaElement;
        state.formData[field.id] = target.value;
        textarea.dispatchEvent(new Event("input"));
    });

    wrapper.appendChild(textarea);
    wrapper.appendChild(errorContainer);

    return wrapper;
};
