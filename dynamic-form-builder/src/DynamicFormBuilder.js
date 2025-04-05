// DynamicFormBuilder.js
const DynamicFormBuilder = class {
    constructor(config, containerId) {
        const state = {
            schema: config.schema,
            allowedValues: config.allowedValues || {},
            mandatoryLanguages: config.mandatoryLanguages || ['eng'],
            optionalLanguages: config.optionalLanguages || [],
            container: document.getElementById(containerId),
            formData: {},
            formElements: {}
        };
        return Object.freeze({
            render: () => render(state),
            getFormData: () => getFormData(state)
        });
    }
};

const generateLabel = (state, field) => {
    const labels = field.label;
    const allLanguages = [...state.mandatoryLanguages, ...state.optionalLanguages];
    let labelText = allLanguages
        .map(lang => {
            const labelObj = labels.find(l => l[lang]);
            return labelObj ? labelObj[lang] : '';
        })
        .filter(label => label)
        .join(' / ');

    if (field.required) {
        labelText += ' *';
    }
    return labelText;
};

const createSimpleTextbox = (state, field) => {
    const wrapper = document.createElement('div');
    wrapper.className = `form-field-group ${field.cssClasses?.join(' ') || ''}`;

    const mainLabel = document.createElement('label');
    mainLabel.textContent = generateLabel(state, field);
    wrapper.appendChild(mainLabel);

    [...state.mandatoryLanguages, ...state.optionalLanguages].forEach(lang => {
        const langWrapper = document.createElement('div');
        langWrapper.className = `form-field lang-${lang}`;

        const subLabel = document.createElement('label');
        const labelObj = field.label.find(l => l[lang]);
        subLabel.textContent = labelObj ? labelObj[lang] : '';
        subLabel.htmlFor = `${field.id}_${lang}`;
        subLabel.style.display = 'none'; // Hide individual language labels
        langWrapper.appendChild(subLabel);

        const input = document.createElement('input');
        input.type = 'text';
        input.id = `${field.id}_${lang}`;
        input.name = `${field.id}_${lang}`;
        input.dataset.lang = lang;
        input.placeholder = labelObj ? labelObj[lang] : ''; // Add placeholder

        if (field.validators) {
            const langSpecificValidators = field.validators.filter(v => !v.langCode || v.langCode === lang);
            input.addEventListener('input', () => {
                let isValid = true;
                const errorContainer = langWrapper.querySelector('.error-message');
                if (errorContainer) {
                    errorContainer.textContent = '';
                } else {
                    const newErrorContainer = document.createElement('div');
                    newErrorContainer.className = 'error-message';
                    langWrapper.appendChild(newErrorContainer);
                }
                const currentErrorContainer = langWrapper.querySelector('.error-message');

                langSpecificValidators.forEach(validator => {
                    if (validator.type === 'regex') {
                        const regex = new RegExp(validator.validator);
                        if (!regex.test(input.value)) {
                            isValid = false;
                            if (currentErrorContainer) {
                                currentErrorContainer.textContent = validator.errorCode;
                            }
                        }
                    }
                    // Add other validator types here if needed
                });
                if (state.mandatoryLanguages.includes(lang) && field.required && !input.value.trim()) {
                    isValid = false;
                    if (currentErrorContainer && !currentErrorContainer.textContent) {
                        currentErrorContainer.textContent = 'This field is required';
                    }
                }
                input.setCustomValidity(isValid ? '' : 'Invalid input');
            });
        } else if (state.mandatoryLanguages.includes(lang) && field.required) {
            input.addEventListener('input', () => {
                const errorContainer = langWrapper.querySelector('.error-message');
                if (errorContainer) {
                    errorContainer.textContent = '';
                } else {
                    const newErrorContainer = document.createElement('div');
                    newErrorContainer.className = 'error-message';
                    langWrapper.appendChild(newErrorContainer);
                }
                const currentErrorContainer = langWrapper.querySelector('.error-message');
                if (!input.value.trim()) {
                    input.setCustomValidity('This field is required');
                    if (currentErrorContainer && !currentErrorContainer.textContent) {
                        currentErrorContainer.textContent = 'This field is required';
                    }
                } else {
                    input.setCustomValidity('');
                }
            });
        }

        input.addEventListener('change', (e) => {
            if (!state.formData[field.id]) {
                state.formData[field.id] = {};
            }
            state.formData[field.id][lang] = e.target.value;
            input.dispatchEvent(new Event('input')); // Trigger validation on change
        });

        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        langWrapper.appendChild(errorContainer);

        langWrapper.appendChild(input);
        wrapper.appendChild(langWrapper);
        if (!state.formElements[field.id]) {
            state.formElements[field.id] = {};
        }
        state.formElements[field.id][lang] = input;
    });

    return wrapper;
};

const createFormElement = (state, field) => {
    if (field.controlType === 'textbox' && field.type === 'simpleType') {
        return createSimpleTextbox(state, field);
    }

    const wrapper = document.createElement('div');
    wrapper.className = `form-field ${field.cssClasses?.join(' ') || ''}`;

    const label = document.createElement('label');
    label.textContent = generateLabel(state, field);
    label.htmlFor = field.id;
    wrapper.appendChild(label);

    let input;
    switch (field.controlType) {
        case 'textbox':
        case 'password':
            input = document.createElement('input');
            input.type = field.controlType === 'password' ? 'password' : 'text';
            break;
        case 'date':
            input = document.createElement('input');
            input.type = 'date';
            break;
        case 'dropdown':
            input = document.createElement('select');
            const options = state.allowedValues[field.id] || {};
            Object.entries(options).forEach(([value, labels]) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = labels[state.mandatoryLanguages[0]];
                input.appendChild(option);
            });
            break;
    }

    input.id = field.id;
    input.name = field.id;
    input.required = field.required && field.type !== 'simpleType'; // Only mandatory for non-simpleType

    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    wrapper.appendChild(errorContainer);

    if (field.validators) {
        input.addEventListener('input', () => {
            let isValid = true;
            errorContainer.textContent = '';
            field.validators.forEach(validator => {
                if (validator.type === 'regex') {
                    const regex = new RegExp(validator.validator);
                    if (!regex.test(input.value)) {
                        isValid = false;
                        errorContainer.textContent = validator.errorCode;
                    }
                }
                // Add other validator types here if needed
            });
            if (field.required && field.type !== 'simpleType' && !input.value.trim()) {
                isValid = false;
                if (!errorContainer.textContent) {
                    errorContainer.textContent = 'This field is required';
                }
            }
            input.setCustomValidity(isValid ? '' : 'Invalid input');
        });
    } else if (field.required && field.type !== 'simpleType') {
        input.addEventListener('input', () => {
            if (!input.value.trim()) {
                input.setCustomValidity('This field is required');
                if (!errorContainer.textContent) {
                    errorContainer.textContent = 'This field is required';
                }
            } else {
                input.setCustomValidity('');
                errorContainer.textContent = '';
            }
        });
    }

    input.addEventListener('change', (e) => {
        state.formData[field.id] = e.target.value;
        input.dispatchEvent(new Event('input')); // Trigger validation on change
    });

    wrapper.appendChild(input);
    state.formElements[field.id] = input;

    if (field.controlType === 'password') {
        const confirmField = document.createElement('div');
        confirmField.className = 'form-field'; // Consistent styling with other fields

        const confirmLabel = document.createElement('label');
        confirmLabel.textContent = `Confirm ${generateLabel(state, field)}`;
        confirmLabel.htmlFor = `${field.id}_confirm`;
        confirmField.appendChild(confirmLabel);

        const confirmInput = document.createElement('input');
        confirmInput.type = 'password';
        confirmInput.id = `${field.id}_confirm`;
        confirmInput.name = `${field.id}_confirm`;
        confirmInput.required = field.required && field.type !== 'simpleType';

        const confirmErrorContainer = document.createElement('div');
        confirmErrorContainer.className = 'error-message';
        confirmField.appendChild(confirmErrorContainer);

        confirmInput.addEventListener('input', () => {
            confirmErrorContainer.textContent = '';
            if (confirmInput.value !== input.value) {
                confirmErrorContainer.textContent = 'Passwords do not match';
                confirmInput.setCustomValidity('Passwords do not match');
            } else {
                confirmInput.setCustomValidity('');
            }
        });

        confirmInput.addEventListener('change', (e) => {
            state.formData[`${field.id}_confirm`] = e.target.value;
            confirmInput.dispatchEvent(new Event('input'));
        });

        confirmField.appendChild(confirmInput);
        wrapper.appendChild(confirmField);
        state.formElements[`${field.id}_confirm`] = confirmInput;
    }

    return wrapper;
};

const groupFields = (state) => {
    const groups = {};
    state.schema.forEach(field => {
        const group = field.alignmentGroup || `solo_${field.id}`;
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(field);
    });
    return groups;
};

const render = (state) => {
    const form = document.createElement('form');
    const groups = groupFields(state);

    Object.values(groups).forEach(groupFields => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'form-group';
        groupDiv.style.display = groupFields.length > 1 ? 'flex' : 'block';

        groupFields.forEach(field => {
            const element = createFormElement(state, field);
            groupDiv.appendChild(element);
        });

        form.appendChild(groupDiv);
    });

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    form.appendChild(submitButton);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        validateAndSubmit(state);
    });

    state.container.appendChild(form);
};

const validateAndSubmit = (state) => {
    const form = state.container.querySelector('form');
    let overallValid = true;
    form.querySelectorAll('input').forEach(input => {
        input.dispatchEvent(new Event('input')); // Trigger all input validations
        if (!input.checkValidity()) {
            overallValid = false;
        }
    });

    if (overallValid) {
        console.log('Form data:', getFormData(state));
    } else {
        form.reportValidity();
    }
};

const getFormData = (state) => ({ ...state.formData });

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicFormBuilder;
} else {
    window.DynamicFormBuilder = DynamicFormBuilder;
}