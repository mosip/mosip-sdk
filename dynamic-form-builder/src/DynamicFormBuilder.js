const DynamicFormBuilder = (config, containerId, additionalConfig) => {
  const state = {
    schema: config.schema,
    allowedValues: config.allowedValues || {},
    mandatoryLanguages: config.mandatoryLanguages || ["eng"],
    optionalLanguages: config.optionalLanguages || [],
    container: document.getElementById(containerId),
    formData: {},
    formElements: {},
    submitLabel: additionalConfig.submitButton.label,
    submitAction: additionalConfig.submitButton.action,
  };

  return Object.freeze({
    render: () => render(state),
    getFormData: () => getFormData(state),
  });
};

const generateLabel = (state, field) => {
  const labels = field.label;
  const langs = [...state.mandatoryLanguages, ...state.optionalLanguages];
  let labelText = langs
    .map((lang) => {
      const labelObj = labels.find((l) => l[lang]);
      return labelObj?.[lang] || "";
    })
    .filter(Boolean)
    .join(" / ");

  if (field.required) {
    labelText += '<span class="required">*</span>';
  }

  return labelText;
};

const createErrorContainer = () => {
  const errorContainer = document.createElement("div");
  errorContainer.className = "error-message";
  return errorContainer;
};

const appendError = (container, message) => {
  container.innerHTML = "";

  if (message) {
    const icon = document.createElement("img");
    icon.src = "/images/error-icon.svg";
    icon.className = "error-icon";

    // Set alt only when image loads
    icon.onload = () => {
      icon.alt = "error-icon";
      icon.style.display = "inline";
    };

    // Hide image if it fails to load
    icon.onerror = () => {
      icon.style.display = "none";
    };

    // Hide by default until it loads
    icon.style.display = "none";

    const textNode = document.createElement("span");
    textNode.textContent = message;
    textNode.className = "error-text";

    container.appendChild(icon);
    container.appendChild(textNode);
  }
};

const createSimpleTextbox = (state, field) => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field-group ${field.cssClasses?.join(" ") || ""}`;

  const mainLabel = document.createElement("label");
  mainLabel.innerHTML = generateLabel(state, field);
  wrapper.appendChild(mainLabel);

  const languages = [...state.mandatoryLanguages, ...state.optionalLanguages];

  languages.forEach((lang) => {
    const langWrapper = document.createElement("div");
    langWrapper.className = `form-field lang-${lang}`;

    const labelObj = field.label.find((l) => l[lang]);
    const input = document.createElement("input");
    input.className = "input_box";
    input.type = "text";
    input.id = `${field.id}_${lang}`;
    input.name = `${field.id}_${lang}`;
    input.dataset.lang = lang;
    input.placeholder = labelObj?.[lang] || "";

    const errorContainer = createErrorContainer();

    input.addEventListener("input", () => {
      let isValid = true;
      appendError(errorContainer, "");

      const langValidators =
        field.validators?.filter((v) => !v.langCode || v.langCode === lang) ||
        [];

      langValidators.forEach((v) => {
        if (v.type === "regex" && !new RegExp(v.validator).test(input.value)) {
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
          appendError(errorContainer, "This field is required");
      }

      input.setCustomValidity(isValid ? "" : "Invalid input");
      input.classList.toggle("error", !isValid);
    });

    input.addEventListener("change", (e) => {
      state.formData[field.id] = state.formData[field.id] || {};
      state.formData[field.id][lang] = e.target.value;
      input.dispatchEvent(new Event("input"));
    });

    langWrapper.appendChild(input);
    langWrapper.appendChild(errorContainer);
    wrapper.appendChild(langWrapper);

    state.formElements[field.id] = state.formElements[field.id] || {};
    state.formElements[field.id][lang] = input;
  });

  return wrapper;
};

const createFormElement = (state, field) => {
  if (field.controlType === "textbox" && field.type === "simpleType") {
    return createSimpleTextbox(state, field);
  }

  const wrapper = document.createElement("div");
  wrapper.className = `form-field ${field.cssClasses?.join(" ") || ""}`;

  const label = document.createElement("label");
  label.innerHTML = generateLabel(state, field);
  label.htmlFor = field.id;
  wrapper.appendChild(label);

  let input;
  switch (field.controlType) {
    case "textbox":
    case "password":
    case "date":
      input = document.createElement("input");
      input.className = "input_box";
      input.type =
        field.controlType === "password" ? "password" : field.controlType;
      break;
    case "dropdown":
      input = document.createElement("select");
      input.className = "input_box select-placeholder";

      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Select an Option";
      placeholder.disabled = true;
      placeholder.selected = true;
      placeholder.hidden = true;
      input.appendChild(placeholder);

      Object.entries(state.allowedValues[field.id] || {}).forEach(
        ([value, labels]) => {
          const option = document.createElement("option");
          option.value = value;
          option.textContent = Object.values(labels).join(" / ");
          input.appendChild(option);
        }
      );

      input.addEventListener("change", (e) => {
        state.formData[field.id] = e.target.value;
        input.dispatchEvent(new Event("input"));
        input.style.color = input.value ? "black" : "";
      });
      break;
  }

  input.id = field.id;
  input.name = field.id;
  input.required = field.required && field.type !== "simpleType";

  const placeholderLang = state.mandatoryLanguages[0];
  const labelObj = field.label.find((l) => l[placeholderLang]);
  if (labelObj?.[placeholderLang])
    input.placeholder = labelObj[placeholderLang];

  const errorContainer = createErrorContainer();

  input.addEventListener("input", () => {
    let isValid = true;
    appendError(errorContainer, "");

    field.validators?.forEach((v) => {
      if (v.type === "regex" && !new RegExp(v.validator).test(input.value)) {
        isValid = false;
        appendError(errorContainer, v.errorCode);
      }
    });

    if (field.required && !input.value.trim()) {
      isValid = false;
      if (!errorContainer.textContent)
        appendError(errorContainer, "This field is required");
    }

    input.setCustomValidity(isValid ? "" : "Invalid input");
    input.classList.toggle("error", !isValid);
  });

  input.addEventListener("change", (e) => {
    state.formData[field.id] = e.target.value;
    input.dispatchEvent(new Event("input"));
  });

  wrapper.appendChild(input);
  wrapper.appendChild(errorContainer);
  state.formElements[field.id] = input;

  if (field.controlType === "password") {
    const confirmField = document.createElement("div");
    confirmField.className = "form-field";

    const confirmLabel = document.createElement("label");
    confirmLabel.innerHTML = `Confirm ${generateLabel(state, field)}`;
    confirmField.appendChild(confirmLabel);

    const confirmInput = document.createElement("input");
    confirmInput.className = "input_box";
    confirmInput.type = "password";
    confirmInput.id = `${field.id}_confirm`;
    confirmInput.name = `${field.id}_confirm`;
    confirmInput.required = field.required;

    const confirmError = createErrorContainer();

    confirmInput.addEventListener("input", () => {
      appendError(confirmError, "");
      if (confirmInput.value !== input.value) {
        appendError(confirmError, "Passwords do not match");
        confirmInput.setCustomValidity("Passwords do not match");
        confirmInput.classList.add("error");
      } else {
        confirmInput.setCustomValidity("");
        confirmInput.classList.remove("error");
      }
    });

    confirmInput.addEventListener("change", (e) => {
      state.formData[`${field.id}_confirm`] = e.target.value;
      confirmInput.dispatchEvent(new Event("input"));
    });

    confirmField.appendChild(confirmInput);
    confirmField.appendChild(confirmError);
    wrapper.appendChild(confirmField);
    state.formElements[`${field.id}_confirm`] = confirmInput;
  }

  return wrapper;
};

const groupFields = (state) =>
  state.schema.reduce((acc, field) => {
    const group = field.alignmentGroup || `solo_${field.id}`;
    acc[group] = acc[group] || [];
    acc[group].push(field);
    return acc;
  }, {});

const render = (state) => {
  const form = document.createElement("form");
  const groups = groupFields(state);

  Object.values(groups).forEach((fields) => {
    const groupDiv = document.createElement("div");
    groupDiv.className = "form-group";
    groupDiv.style.display = fields.length > 1 ? "flex" : "block";
    groupDiv.style.justifyContent = "space-between";

    fields.forEach((field) => {
      const el = createFormElement(state, field);
      groupDiv.appendChild(el);
    });

    form.appendChild(groupDiv);
  });

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = state.submitLabel;
  submitButton.className = "form-button";
  submitButton.id = "submit-button";
  form.appendChild(submitButton);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    validateAndSubmit(state);
  });

  state.container.appendChild(form);
};

const validateAndSubmit = (state) => {
  const form = state.container.querySelector("form");
  let isValid = true;

  form.querySelectorAll("input, select").forEach((el) => {
    el.dispatchEvent(new Event("input"));
    if (!el.checkValidity()) isValid = false;
  });

  if (isValid) {
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

const getFormData = (state) => ({ ...state.formData });

if (typeof module !== "undefined" && module.exports) {
  module.exports = DynamicFormBuilder;
} else {
  window.DynamicFormBuilder = DynamicFormBuilder;
}
