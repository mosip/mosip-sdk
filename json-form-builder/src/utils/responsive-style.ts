/**
 * Responsive styles for the form elements to ensure they are displayed correctly on different screen sizes.
 * This includes styles for form groups, fields, labels, input boxes, and other elements.
 */
const responsiveStyle = `
.form-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0rem;
}

.form-field,
.form-field-group {
  flex: 1;
  min-width: 250px;
  margin-bottom: 0.5rem;
}

.form-field label,
.form-field-group label {
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
}

.form-field-group > .form-field-group:last-of-type {
  margin-bottom: 0px;
}

.input_box::placeholder,
.input_box::-moz-placeholder,
.input_box:-ms-input-placeholder,
.input_box::-webkit-input-placeholder,
input[type="date"]::-webkit-datetime-edit-text,
select option:first-child {
  color: #a0a8ac;
  font:
    500 14px/21px Inter,
    sans-serif;
}

.input_box.error {
  border-color: #fe6b6b;
}

.input_box.error:focus-visible,
.input_box.error:focus,
.input_box.error:focus-within {
  border-color: #fe6b6b !important;
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

/* Select Input Styling */
.select-input {
  cursor: pointer;
}

/* Select Input Styling end*/

/* Password Input Styling */
.password-container {
  position: relative;
}

.password-eye-icon {
  position: absolute;
  right: 0.75rem; /* Position from the right edge of the input */
  transform: translateY(130%); /* Adjust for perfect vertical centering */
  cursor: pointer;
  color: #6b7280; /* A neutral gray color */
  font-size: 1.25rem; /* Adjust icon size */
  line-height: 1; /* Ensure icon doesn't affect line height */
  user-select: none;
}
/* Password Input Styling End */

/* Checkbox Container Styling */
.checkbox-container {
  display: flex; /* Use flexbox to align checkbox and label */
  gap: 1rem; /* Space between checkbox and label (Tailwind gap-2) */
  align-items: center; /* Vertically center the checkbox and label */
}

.checkbox-container input[type="checkbox"] {
  width: 1.25rem; /* Tailwind w-5 */
  height: 1.25rem; /* Tailwind h-5 */
  border: 1px solid #d1d5db; /* Tailwind border-gray-300 */
  border-radius: 2px; /* Tailwind rounded */
  cursor: pointer;
  flex-shrink: 0; /* Prevent checkbox from shrinking */
}

.checkbox-container label {
  font-size: 14px; /* Tailwind text-base */
  font-weight: 500; /* Tailwind font-medium */
  line-height: 1; /* Tailwind leading-relaxed */
  color: #1f2937; /* Tailwind text-gray-900 */
  cursor: pointer;
  user-select: none; /* Prevent text selection when clicking label */
}
/* Checkbox Container Styling End */

/* Info Icon Styling */
.info-container {
  position: relative; /* Allows info-detail to be positioned relative to this */
  display: inline-block; /* So it doesn't take full width */
  vertical-align: middle; /* Align with text */
  margin-left: 5px;
}

.info-icon {
  cursor: pointer;
  font-weight: bold;
  display: inline-flex; /* For centering the 'i' */
  align-items: center;
  justify-content: center;
  vertical-align: text-top;
  height: 1rem;
  width: 1rem;
}

/* Info Detail Box Styling */
.info-detail {
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  display: none; /* Hidden by default */
  position: absolute;
  top: 100%; /* Position below the icon */
  left: 50%; /* Center horizontally relative to icon */
  transform: translate(10%, -60%); /* Adjust to true center */
  min-width: 250px;
  max-width: 350px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000; /* Ensure it's above other content */
  opacity: 0; /* For fade in/out effect */
  visibility: hidden; /* For proper hiding without taking up space */
  transition:
    opacity 0.3s ease-in-out,
    visibility 0.3s ease-in-out;
}

.info-detail-arrow {
  position: absolute;
  left: 0px;
  transform-origin: 0px 0px;
  transform: translateY(50%) rotate(90deg) translateX(-50%);
  top: 50%;
}

@media screen and (max-width: 640px) {
  .info-detail {
    transform: translate(-40%, 5%); /* Adjust for smaller screens */
  }

  .info-detail-arrow {
    transform-origin: center 0px;
    transform: rotate(180deg);
    left: 94px;
    top: 0px;
  }
}

.info-detail.active {
  display: block; /* Show when active */
  opacity: 1;
  visibility: visible;
}

.label-div-display {
  display: flex;
  justify-content: space-between;
  align-items: end;
}

.caps-lock-span {
  font-size: small;
  color: #2d86ba;
  align-items: center;
}

.caps-lock-text {
  margin-left: 4px;
}

/* Prefix for phone number input */
.prefix-button {
  cursor: pointer;
  text-align: right;
  padding: 0.5em 0.75em !important;
  width: 64px !important;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.prefix-button:disabled {
  cursor: default;
}

/* The container <div> - needed to position the dropdown content */
.phone-div-display {
  position: relative;
  display: flex;
  direction: ltr;
}

/* Dropdown Content (Hidden by Default) */
.prefix-dropdown {
  display: none;
  position: absolute;
  top: 100%; /* Position below the button */
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.prefix-dropdown a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.prefix-dropdown a:hover {
  background-color: #ddd;
}

.prefix-option {
  cursor: pointer;
}

/* Show the dropdown menu (use JS to add this class to the .prefix-dropdown container
      when the user clicks on the dropdown button) */
.show {
  display: block;
}

.input_box ~ .input_box {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  border-left: none !important;
}
/* prefix for phone number input */

/* file input styling */
.file-upload-container {
    position: relative;
}

.file-name {
    flex-grow: 1; /* Allows file name to take available space */
    color: #555;
    overflow: hidden; /* Hide overflow text */
    white-space: nowrap; /* Prevent text wrapping */
    text-overflow: ellipsis; /* Add ellipsis for overflow */
    margin-right: 10px; /* Space between text and icon */
    font-size: 1rem;
}

.hidden-file-input {
    display: none; /* Hide the actual file input */
}

/* Optional: Focus style for accessibility */
.file-upload-container:focus-within .file-upload-label {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    outline: none; /* Remove default outline */
}
/* file input styling end */
`;

/**
 * Styles for right-to-left (RTL) languages to ensure proper layout and alignment.
 * This includes styles for form groups, fields, labels, input boxes, and other elements.
 */
const rtlStyle = `
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

[dir="rtl"] .password-eye-icon {
  left: 0.75rem;
  right: unset;
}

[dir="rtl"] .checkbox-container {
  flex-direction: row-reverse; /* Align checkbox and label in RTL */
}

[dir="rtl"] .info-container {
  margin-left: unset;
  margin-right: 5px;
}

[dir="rtl"] .info-detail {
  transform: translate(-110%, -60%);
} 

[dir="rtl"] .info-detail-arrow {
  left: unset;
  right: 0px;
  transform-origin: 3px -7px;
  transform: translateY(50%) rotate(-90deg) translateX(-50%);
}

@media screen and (max-width: 640px) {
  [dir="rtl"] .info-detail {
    transform: translate(-70%, 5%); /* Adjust for smaller screens */
  }

  [dir="rtl"] .info-detail-arrow {
    transform-origin: center 0px;
    transform: rotate(180deg);
    left: unset;
    right: 28%
  }
}

[dir="rtl"] .caps-lock-text {
  margin-right: 4px;
  margin-left: unset;
}
`;

/**
 * Adds responsive styles to the form elements to ensure they are displayed correctly on different screen sizes.
 */
const addResponsiveStyles = (): void => {
  const style = document.createElement("style");
  style.textContent = responsiveStyle;
  document.head.appendChild(style);
};

/**
 * Adds styles for right-to-left (RTL) languages to ensure proper layout and alignment.
 */
const addRTLStyles = (): void => {
  const style = document.createElement("style");
  style.textContent = rtlStyle;
  document.head.appendChild(style);
};

export { addRTLStyles, addResponsiveStyles };
