import { FormField, FormState } from "../types";
import {
    appendError,
    createErrorContainer,
    disableField,
    emptyInvalidFn,
    getLabelText,
    handleRequiredValidation,
} from "../utils/utils";
import { InputType } from "../utils/constants";

/**
 * Creates a radio-button form element.
 * @param {FormState} state Current form state containing schema, container, and other properties.
 * @param {FormField} field Form field object containing id, labelName, required, and other properties.
 * @returns {HTMLDivElement} A div element containing the radio group with its label and options.
 */
export const createRadioField = (
    state: FormState,
    field: FormField
): HTMLDivElement => {
    const wrapper = document.createElement("div");
    wrapper.className = `form-field radio-container ${field.cssClasses?.join(" ") || ""}`;
    wrapper.dataset.fieldId = field.id;

    // Main Label
    const label = document.createElement("label");
    label.className = "radio-group-label";
    label.innerHTML = getLabelText(state, field);

    // Error container
    const errorContainer = createErrorContainer();

    const radioGroup = document.createElement("div");
    radioGroup.className = "radio-group";

    const options = state.allowedValues?.[field.id] || {};

    // Map UI language -> allowedValues language key
    const lang = state.currentLanguage || state.defaultLanguage;
    const langMap: Record<string, string> = state.languageMap || {};
    const allowedValueLangKey = langMap[lang] || lang;

    const savedValue = state.formData?.[field.id];

    Object.entries(options).forEach(([valueKey, labelObj]) => {
        const optionWrapper = document.createElement("div");
        optionWrapper.className = "radio-option";

        const uniqueId = `${field.id}_${valueKey}`;
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.id = uniqueId;
        radio.name = field.id;
        radio.value = valueKey;
        radio.className = "radio-input";
        radio.dataset.fieldId = field.id;
        radio.oninvalid = emptyInvalidFn(radio);

        if (field.disabled) disableField(radio);

        // Check saved value
        if (field.type === InputType.SIMPLE_TYPE && Array.isArray(savedValue)) {
            radio.checked = savedValue.some(
                (v: any) => v.value === labelObj[allowedValueLangKey]
            );
        } else {
            radio.checked = savedValue === valueKey;
        }

        const optionLabel = document.createElement("label");
        optionLabel.htmlFor = uniqueId;
        optionLabel.textContent = labelObj?.[allowedValueLangKey] || valueKey;

        optionWrapper.appendChild(radio);
        optionWrapper.appendChild(optionLabel);
        radioGroup.appendChild(optionWrapper);

        radio.addEventListener("change", function () {
            let isValid = true;
            let lastError: "required" | number | null = null;
            appendError(errorContainer, "");

            const selected = radioGroup.querySelector("input:checked") as HTMLInputElement | null;

            if (field.required && !selected) {
                const result = handleRequiredValidation(state, errorContainer);
                lastError = result.lastError;
                isValid = result.isValid;
            }

            state.lastErrors = state.lastErrors || {};
            state.lastErrors[field.id] = lastError;

            // Update all radios' validity and error class
            radioGroup.querySelectorAll("input").forEach(r => {
                (r as HTMLInputElement).setCustomValidity(isValid ? "" : "Invalid input");
                r.classList.toggle("error", !isValid);
            });

            // Update formData
            if (selected) {
                const originalKey = selected.value;
                const optionLabelRaw = (options as any)[originalKey];

                if (field.type === InputType.SIMPLE_TYPE) {
                    const result = state.mandatoryLanguages.map((lng) => {
                        // Use lang code directly as in allowedValues

                        const mappedLng = state.languageMap[lng] || lng;
                        return {
                            language: mappedLng.length === 3 ? mappedLng : lng,
                            value: optionLabelRaw?.[lng] || optionLabelRaw?.[mappedLng] || ""
                        };
                    });

                    state.formData[field.id] = result;
                }
                else {
                    // Non-simpleType → value should be taken from first mandatory language
                    const mandatoryLangs: string[] = state?.mandatoryLanguages || [];
                    const firstMandatory = mandatoryLangs[0];

                    // fallback: use langMap if needed
                    const mappedMandatory = (state.languageMap && state.languageMap[firstMandatory])
                        ? state.languageMap[firstMandatory]
                        : firstMandatory;

                    // assign final value
                    state.formData[field.id] =
                        optionLabelRaw?.[firstMandatory] ||
                        optionLabelRaw?.[mappedMandatory] ||
                        originalKey;
                }
            }
        });
    });

    wrapper.appendChild(label);
    wrapper.appendChild(radioGroup);

    const parentNode = document.createElement("div");
    parentNode.className = "form-field-group";
    parentNode.appendChild(wrapper);
    parentNode.appendChild(errorContainer);

    return parentNode;
};
