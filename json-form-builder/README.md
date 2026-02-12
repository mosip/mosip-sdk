# JSON Form Builder

A flexible and customizable form builder for creating forms from JSON configurations.

## Features

- JSON-based form creation
- Multilingual support
- RTL layout support
- Responsive design
- Built-in field validation
- Google reCAPTCHA integration
- Customizable styling

## Installation

```bash
npm install @mosip/json-form-builder
```

## Usage

### Basic Usage

```javascript
import { JsonFormBuilder } from "@mosip/json-form-builder";

const config = {
  schema: [
    {
      alignmentGroup: "group1",
      capsLockCheck: true,
      controlType: "textbox",
      cssClasses: "name-input-field",
      id: "name",
      info: {
        ara: "عليك إدخال بعض النصوص في هذا الحقل",
        eng: "You must enter some text in this field",
        fra: "Vous devez saisir du texte dans ce champ",
      },
      labelName: {
        ara: "الاسم",
        eng: "Name",
        fra: "Nom",
      },
      placeholder: {
        ara: "أدخل الاسم",
        eng: "Enter name",
        fra: "Entrez le nom",
      },
      required: true,
      type: "string",
      validators: [
        {
          error: {
            ara: "لا يُسمح باستخدام الأحرف الخاصة",
            eng: "Special characters are not allowed",
            fra: "Les caractères spéciaux ne sont pas autorisés",
          },
          langCode: null,
          regex: "^[a-zA-Z0-9]+$",
        },
      ],
    },
    {
      alignmentGroup: "group2",
      controlType: "dropdown",
      id: "gender",
      subType: "gender-options",
      labelName: {
        ara: "الجنس",
        eng: "Gender",
        fra: "Genre",
      },
      required: false,
    },
    {
      alignmentGroup: "group2",
      controlType: "phone",
      disabled: true,
      id: "phone",
      labelName: {
        ara: "رقم الهاتف",
        eng: "Phone Number",
        fra: "Numéro de téléphone",
      },
      placeholder: {
        ara: "أدخل رقم هاتفك",
        eng: "Enter your phone number",
        fra: "Entrez votre numéro de téléphone",
      },
      prefix: ["+91"],
      required: true,
    },
    {
      alignmentGroup: "group3",
      controlType: "password",
      id: "password",
      info: {
        ara: "استخدم 8 أحرف أو أكثر مع مزيج من الحروف ورقم واحد على الأقل.",
        eng: "Use 8 or more characters with a mix of letters and at least one number.",
        fra: "Utilisez 8 caractères ou plus avec un mélange de lettres et au moins un chiffre.",
      },
      labelName: {
        ara: "كلمة المرور",
        eng: "Password",
        fra: "Mot de passe",
      },
      placeholder: {
        ara: "أدخل كلمة المرور",
        eng: "Enter your password",
        fra: "Entrez votre mot de passe",
      },
      required: true,
    },
    {
      alignmentGroup: "group4",
      controlType: "date",
      id: "dob",
      labelName: {
        ara: "تاريخ الميلاد",
        eng: "Date of Birth",
        fra: "Date de naissance",
      },
      minAge: 2,
      maxAge: 3,
      format: "dd-MM-yyyy",
      required: true,
    },
    {
      alignmentGroup: "group5",
      controlType: "checkbox",
      id: "consent",
      labelName: {
        ara: "أوافق على <b><a href='#'>الشروط والأحكام</a></b> و<b><a href='#'>سياسة الخصوصية</a></b>.",
        eng: "I agree to the <b><a href='#'>Terms & Conditions</a></b> and <b><a href='#'>Privacy Policy</a></b>.",
        fra: "J'accepte les <b><a href='#'>conditions générales</a></b> et la <b><a href='#'>politique de confidentialité</a></b>.",
      },
      required: true,
    },
  ],
  allowedValues: {
    "gender-options": {
      male: {
        ara: "ذكر",
        eng: "Male",
        fra: "Homme",
      },
      female: {
        ara: "أنثى",
        eng: "Female",
        fra: "Femme",
      },
      other: {
        ara: "آخر",
        eng: "Other",
        fra: "Autre",
      },
    },
  },
  i18nValues: {
    errors: {
      required: {
        ara: "هذا الحقل مطلوب",
        eng: "This field is required",
        fra: "Ce champ est obligatoire",
      },
      capsLock: {
        ara: "زر الأحرف الكبيرة مفعّل",
        eng: "Caps Lock is on",
        fra: "Verr Maj activé",
      },
    },
  },
  language: {
    mandatory: ["eng"],
    optional: ["fra", "ara"],
    langCodeMap: {
      eng: "en",
      fra: "fr",
      ara: "ar",
    },
  },
};

const additionalConfig = {
  submitButton: {
    label: "Submit",
    action: (data) => {
      console.log("Form data:", data);
    },
  },
  language: {
    currentLanguage: "fra",
    defaultLanguage: "eng",
    showLanguageSwitcher: true,
  },
  recaptcha: {
    siteKey: "your-recaptcha-site-key",
    enabled: true,
    language: "eng",
  },
};

const formBuilder = JsonFormBuilder(config, "form-container", additionalConfig);
formBuilder.render();
```

## Configuration

### Form Configuration

The form configuration object (`config`) has the following structure:

```typescript
interface FormConfig {
  schema: FormField[];
  language: LanguageSettings;
  allowedValues?: AllowedValues;
  i18nValues?: {
    errors?: Errors;
    labels?: { [id: string]: Label };
    placeholders?: { [id: string]: Label };
  };
}
```

## Schema Properties

The schema consists of the following properties:

### Field Properties Reference (Alphabetical)

| Property            | Type         | Requirement   | Description                                                                                                                                                                                                                                                    |
| ------------------- | ------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `alignmentGroup`    | string       | Optional      | Fields in the same group are aligned horizontally in the UI.                                                                                                                                                                                                   |
| `acceptedFileTypes` | string/array | Optional      | For file/photo uploads: allowed MIME types, e.g., `image/jpeg`, `application/pdf`.                                                                                                                                                                             |
| `controlType`       | string       | **Mandatory** | Type of UI control. Options: `textbox`, `textarea`, `date`, `dropdown`, `password`, `checkbox`, `radio`, `phone`, `photo`, `fileupload`.                                                                                                                       |
| `disabled`          | boolean      | Optional      | Disables the field when `true`. Defaults to `false`.                                                                                                                                                                                                           |
| `format`            | string       | Optional      | For date fields: format in which the date value should be displayed, placeholder rendered, and submitted. Defaults to `yyyy/MM/dd` if not provided.                                                                                                            |
| `id`                | string       | **Mandatory** | Unique identifier for the field, used internally to map values.                                                                                                                                                                                                |
| `info`              | object       | Optional      | Multilingual tooltip info for the field. Displayed as an info icon next to the label.                                                                                                                                                                          |
| `maxAge`            | number       | Optional      | For date fields: maximum allowed age in days from today. Selected date must be ≤ (today + maxAge).                                                                                                                                                             |
| `maxFileSizeMB`     | number       | Optional      | For file uploads: maximum allowed file size in MB.                                                                                                                                                                                                             |
| `minAge`            | number       | Optional      | For date fields: minimum allowed age in days from today. Selected date must be ≥ (today − minAge).                                                                                                                                                             |
| `placeholder`       | object       | Optional      | Multilingual placeholder text displayed inside input fields.                                                                                                                                                                                                   |
| `prefix`            | string/array | Optional      | Single or multiple prefixes for the phone field. Works only when `controlType` is `phone`.                                                                                                                                                                     |
| `required`          | boolean      | Optional      | Whether the field must be filled. Defaults to `false`.                                                                                                                                                                                                         |
| `rows`              | number       | Optional      | For textarea fields: number of visible rows. Defaults to 2 if not provided.                                                                                                                                                                                    |
| `subType`           | string       | Optional      | Optional sub-type for certain controls like `dropdown` and `radio`. Refers to predefined allowed values.                                                                                                                                                       |
| `type`              | string       | Optional      | Input type: `string` for single-language or `simpleType` for multilingual fields (renders one input per language).                                                                                                                                             |
| `validators`        | array        | Optional      | List of validation rules. Each validator has:<br>- `regex` (string, **Mandatory**) – pattern to validate<br>- `error` (object, **Mandatory**) – multilingual error messages<br>- `langCode` (string, Optional) – applies only to specific language if provided |

---

### Special Field Behaviors

#### Date Field

- **Age Validation (`minAge` / `maxAge`)**: minAge/maxAge are in days relative to today.
  - `minAge = 0` → date must be today or later.
  - `maxAge = 5` → date must be today or within the next 5 days.
  - Validation fails if the selected date is outside the allowed range.
- **Date Format (`format`)**: Placeholder, selected display, and submitted value must all follow the same format. Defaults to `yyyy/MM/dd` if not provided.

#### Radio Field

- **Final Submitted Value (string type)**: The submitted value is always taken from the **first language listed in mandatoryLanguages**, regardless of current UI language. Both 2-letter and 3-letter language codes are supported.

#### SimpleType Radio Field

- **Final Submitted Value Structure**: Submitted data is an **array of objects**, one per mandatory language.
  ```json
  {
    "language": "<3-letter-language-code>",
    "value": "<selected-option-value>"
  }
  ```

#### File Upload Field (`fileupload` / `photo`)

The file upload field allows users to upload files or photos with additional options and validations.

- **Accepted File Types (`acceptedFileTypes`)**
  - Restricts uploads to specific file types such as `image/jpeg`, `application/pdf`.
  - Multiple types are supported.
  - Example display text: `"JPEG, PNG, PDF (max. 5 MB)"`.

- **Maximum File Size (`maxFileSizeMB`)**
  - Sets the maximum allowed file size in MB.
  - Example: `5` → maximum 5 MB per file.

- **Document Type (`docType`)**
  - Optional dropdown to select the type of document.
  - Supports multilingual labels and placeholders.

- **Reference ID (`refId`)**
  - Optional text input to enter a document reference number.
  - Supports multilingual labels and placeholders.

- **Proof of Document (`proofOfDoc`)**
  - Label displayed above the upload area.
  - Indicates the area where users can upload their file or photo.
  - Supports multilingual labels.

- **Upload Area**
  - Users can click to select a file or drag-and-drop it into the area.
  - Displays supported file types and maximum size as helper text.
  - Can be disabled to prevent uploads.

- **File Preview**
  - **Photos**: Shows a thumbnail of the uploaded image.
  - **Other files**: Shows file name, size, and an icon.
  - Each preview includes a delete button to remove the file.

- **Validation**
  - Required uploads must have a file.
  - Only allowed file types and sizes are accepted.
  - Validation messages are shown in multiple languages if configured.

### Allowed Values Section (optional)

| Property        | Type   | Description                                                                                                                            |
| --------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `allowedValues` | object | Defines predefined options for dropdowns or checkboxes. Keys represent option `subType`/ `id`, and values provide multilingual labels. |

### i18nValues Section (optional)

#### It contains errors, additional labels & placeholders

---

#### Errors Section

| Property           | Type   | Description                                                                                                                       |
| ------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `required`         | object | Multilingual error messages for required fields. Example: `"eng": "This field is required"`                                       |
| `passwordMismatch` | object | Multilingual error messages when passwords do not match. Example: `"eng": "Passwords is not matching please check your password"` |
| `capsLock`         | object | Multilingual error messages when Caps Lock is enabled. Example: `"eng": "Caps Lock is ON"`                                        |

---

#### Labels Section

| Property           | Type   | Description                                                                      |
| ------------------ | ------ | -------------------------------------------------------------------------------- |
| `password_confirm` | object | Multilingual label for confirming password. Example: `"eng": "Confirm Password"` |
| `capturePhoto`     | object | Label for capturing photo. Example: `"eng": "Capture Photo"`                     |
| `clickToUpload`    | object | Label for click-to-upload buttons. Example: `"eng": "Click to upload"`           |
| `docType`          | object | Label for document type selection. Example: `"eng": "Document Type"`             |
| `docRef`           | object | Label for document reference ID. Example: `"eng": "Document Reference ID"`       |
| `proofOfDoc`       | object | Label for proof of document. Example: `"eng": "Proof Of Document"`               |

---

#### Placeholders Section

| Property           | Type   | Description                                                                                    |
| ------------------ | ------ | ---------------------------------------------------------------------------------------------- |
| `password_confirm` | object | Placeholder for confirm password. Example: `"eng": "Enter your confirm password"`              |
| `docType`          | object | Placeholder for document type selection. Example: `"eng": "Select an option"`                  |
| `docRef`           | object | Placeholder for document reference ID. Example: `"eng": "Enter Reference ID here"`             |
| `proofOfDoc`       | object | Placeholder for proof of document upload. Example: `"eng": "Click to upload or drag and drop"` |

### Language Section (mandatory)

| Property      | Type   | Description                                                                                |
| ------------- | ------ | ------------------------------------------------------------------------------------------ |
| `mandatory`   | array  | List of mandatory language codes that must be present in the schema.                       |
| `optional`    | array  | List of optional language codes that may be included if available.                         |
| `langCodeMap` | object | Bi-directional mapping between 2-letter and 3-letter language codes (e.g., `eng` ↔ `en`). |

### Additional Configuration

The additional configuration object has the following structure:

```typescript
interface AdditionalConfig {
  submitButton: {
    label: string;
    action: (data: FormData) => void;
  };
  language?: {
    currentLanguage?: string;
    defaultLanguage?: string;
    showLanguageSwitcher?: boolean;
    languageSwitcherPosition?: "top" | "bottom";
    availableLanguages?: string[];
    rtlLanguages?: string[];
  };
  recaptcha?: {
    siteKey: string;
    enabled?: boolean;
    language?: string;
  };
}
```

## reCAPTCHA Integration

The form builder supports Google reCAPTCHA v2 integration. To enable reCAPTCHA:

1. Add the reCAPTCHA configuration to your `additionalConfig`:

```javascript
recaptcha: {
  siteKey: 'your-recaptcha-site-key',  // Required
  enabled: true,                       // Optional, defaults to true
  language: 'eng'                      // Optional, defaults to form's current
}
```

2. The reCAPTCHA widget will be automatically rendered in the form
3. The reCAPTCHA token will be included in the form data as `recaptchaToken`
4. The widget will automatically update its language when the form language changes

### reCAPTCHA Features

- Responsive design that scales appropriately on different screen sizes
- Automatic language synchronization with the form
- Proper cleanup and recreation when language changes
- Validation before form submission
- Error handling for failed initialization

## Field Types

The form builder supports the following field types:

- Textbox (single language)
- Textbox (multiple languages)
- Password
- Date
- Dropdown
- Checkbox
- Phone
- Photo

## Validation

Fields can be validated using regular expressions:

```javascript
{
  id: 'email',
  controlType: 'textbox',
  label: { eng: 'Email', fra: 'E-mail' },
  required: true,
  validators: [
    {
      regex: '^[^@]+@[^@]+\\.[^@]+$',
      error: {
        eng: 'Invalid email format',
        fra: "Format d'e-mail invalide",
      }
    }
  ]
}
```

## RTL Support

The form builder automatically handles RTL layouts for specified languages:

```javascript
language: {
  rtlLanguages: ["ara", "ar", "he", "fa", "ur"];
}
```

## Methods

- `render()`: Renders the form
- `getFormData()`: Returns the current form data
- `updateLanguage(newLanguage: string, submitButtonLabel: string, additonalSchema?: AdditionalSchema)`: Updates the form fields, submit button and reCAPTCHA language

## Styling

The form builder comes with default styles but can be customized using CSS. The main classes are:

- `.form`: The main form container
- `.form-group`: Groups of fields
- `.form-field`: Individual field container
- `.form-field-group`: Container for multi-language fields
- `.input_box`: Input elements
- `.language-switcher`: Language selection container
- `.recaptcha-container`: reCAPTCHA widget container
- `.password-container`: Password container
- `.password-eye-icon`: Eye icon of password input
- `.checkbox-container`: Checkbox Container
- `.info-container`: Info icon container
- `.info-icon`: Info icon besides Input Label
- `.info-detail`: Info box open after clicking Info icon
- `.info-detail-arrow`: Small arrow comes with Info box
- `.label-div-display`: Label container div which contain label, info icon & caps lock info
- `.caps-lock-span`: Caps lock container
- `.caps-lock-icon`: Caps lock icon
- `.caps-lock-text`: Caps lock text

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Build

The project uses Rollup for building. To build the library:

```bash
npm run build
```

This will generate:

- UMD bundle (`dist/JsonFormBuilder.umd.js`)
- ESM bundle (`dist/JsonFormBuilder.esm.js`)
- Source maps for both bundles
- TypeScript declaration files

### Development with an actual Application

#### This should be used only in local for development purpose only

1. First link the current `json-form-builder` library, with below command
   ```bash
   npm link
   ```
2. Now go to the application, where you want to use `json-form-builder` library, and run the below command
   ```bash
   npm link @mosip/json-form-builder
   ```
3. This will create a link between the library and application, after that if any changes has been done in the library, just run the below command and it will reflect in the application as well
   ```bash
   npm run build
   ```

### Development Mode

For development with watch mode:

```bash
npm run dev
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## License

MPL

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
