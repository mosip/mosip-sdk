import { FormState, FormField } from "../types";
import { format, parse, addDays } from "date-fns";
import {
  getMultiLangText,
  createErrorContainer,
  appendError,
  handleRequiredValidation,
  createInfoIcon,
  getLabelText,
  emptyInvalidFn,
} from "../utils/utils";
import { calendarIconSvg } from "../utils/icons";

export const createDateField = (
  state: FormState,
  field: FormField
): HTMLDivElement => {
  const wrapper = document.createElement("div");
  wrapper.className = `form-field ${field.cssClasses?.join(" ") || ""}`;

  const label = document.createElement("label");
  label.innerHTML = getLabelText(state, field);
  label.htmlFor = field.id;

  if (field.info) label.appendChild(createInfoIcon(getMultiLangText(state, field.info)));

  wrapper.appendChild(label);

  // ---------------------------
  // Input wrapper for icon inside input
  // ---------------------------
  const inputWrapper = document.createElement("div");
  inputWrapper.className = "date-input-wrapper";
  inputWrapper.style.position = "relative";

  // ---------------------------
  // Calendar icon inside input
  // ---------------------------
  const calendarIcon = document.createElement("span");
  calendarIcon.className = "calendar-icon";
  calendarIcon.innerHTML = calendarIconSvg;

  // ---------------------------
  // Display input (read-only)
  // ---------------------------
  const displayInput = document.createElement("input");
  displayInput.type = "text";
  displayInput.className = "input_box date-display-input";
  displayInput.placeholder = field.format || "yyyy/MM/dd";
  displayInput.dataset.fieldId = field.id;
  displayInput.id = field.id;
  displayInput.readOnly = true; // disables typing

  inputWrapper.appendChild(displayInput);
  inputWrapper.appendChild(calendarIcon);

  // ---------------------------
  // Real hidden input
  // ---------------------------
  const realInput = document.createElement("input");
  realInput.type = "date";
  realInput.name = field.id;
  realInput.className = "real-date-input";
  realInput.oninvalid = emptyInvalidFn(realInput);
  inputWrapper.appendChild(realInput);

  const errorContainer = createErrorContainer();

  const today = new Date();
  const minAge = field.minAge;
  const maxAge = field.maxAge;

  let minDate: Date | null = null;
  let maxDate: Date | null = null;

  const isValidNumber = (val: any): val is number =>
    typeof val === "number" && !isNaN(val);

  const bothInvalid =
    (!isValidNumber(minAge) && !isValidNumber(maxAge)) || (minAge === 0 && maxAge === 0);

  if (!bothInvalid) {
    if (isValidNumber(minAge)) minDate = addDays(today, -Math.abs(minAge));
    if (isValidNumber(maxAge)) maxDate = addDays(today, Math.abs(maxAge));
  }

  if (minDate) realInput.min = format(minDate, "yyyy-MM-dd");
  if (maxDate) realInput.max = format(maxDate, "yyyy-MM-dd");

  const toStartOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  // ---------------------------
  // Open native date picker
  // ---------------------------
  const openPicker = () => {
    try { realInput.showPicker(); } catch (_) { }
  };

  displayInput.addEventListener("click", openPicker);
  displayInput.addEventListener("focus", openPicker);

  // ---------------------------
  // Validation
  // ---------------------------
  const validate = () => {
    let isValidField = true;
    let lastError: "required" | null = null;

    appendError(errorContainer, "");

    if (field.required && !realInput.value) {
      const r = handleRequiredValidation(state, errorContainer);
      lastError = r.lastError;
      isValidField = r.isValid;
    }

    if (realInput.value) {
      const selected = toStartOfDay(parse(realInput.value, "yyyy-MM-dd", new Date()));
      const min = minDate ? toStartOfDay(minDate) : null;
      const max = maxDate ? toStartOfDay(maxDate) : null;

      if (min && selected < min) isValidField = false;
      if (max && selected > max) isValidField = false;

      if (!isValidField) {
        appendError(
          errorContainer,
          `Date must be between ${min ? format(min, field.format ?? "yyyy/MM/dd") : "any"} and ${max ? format(max, field.format ?? "yyyy/MM/dd") : "any"
          }`
        );
      }
    }

    state.lastErrors = state.lastErrors || {};
    state.lastErrors[field.id] = lastError;
    realInput.setCustomValidity(isValidField ? "" : "Invalid input");
    displayInput.classList.toggle("error", !isValidField);
  };

  // ---------------------------
  // When user selects date
  // ---------------------------
  realInput.addEventListener("change", () => {
    if (realInput.value) {
      const parsed = parse(realInput.value, "yyyy-MM-dd", new Date());
      const formatted = format(parsed, field.format || "yyyy/MM/dd");
      displayInput.value = formatted;
      state.formData[field.id] = formatted;
    } else {
      displayInput.value = "";
      state.formData[field.id] = "";
    }
    validate();
  });

  wrapper.appendChild(inputWrapper);
  wrapper.appendChild(realInput);
  wrapper.appendChild(errorContainer);

  return wrapper;
};
