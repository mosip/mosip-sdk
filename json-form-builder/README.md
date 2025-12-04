# JSON Form Builder

A flexible and customizable form builder that creates forms from JSON configuration. Supports multiple languages, RTL layouts, and Google reCAPTCHA integration.

## Features

- Create forms from JSON configuration
- Support for multiple languages
- RTL language support
- Responsive design
- Field validation
- Google reCAPTCHA integration
- Customizable styling

## Installation

```bash
npm install json-form-builder
```

## Usage

### Basic Usage

```javascript
import { JsonFormBuilder } from "@mosip/json-form-builder";

const config = {
  schema: [
    {
      id: "sampleInputId",
      required: true,
      type: "string",
      label: {
        eng: "Sample Field",
        ara: "حقل تجريبي",
        fra: "Champ d'exemple",
      },
      placeholder: {
        eng: "Enter value",
        ara: "أدخل القيمة",
        fra: "Entrez la valeur",
      },
      info: {
        eng: "You have to input some text in this field",
        ara: "عليك إدخال بعض النصوص في هذا الحقل",
        fra: "Vous devez saisir du texte dans ce champ",
      },
      capsLockCheck: true,
      cssClasses: "sample-input-field",
      controlType: "textbox",
      validators: [
        {
          regex: "^[a-zA-Z0-9]+$",
          langCode: null,
          error: {
            eng: "Special characters are not allowed",
            ara: "لا يُسمح باستخدام الأحرف الخاصة",
            fra: "Les caractères spéciaux ne sont pas autorisés",
          },
        },
      ],
      alignmentGroup: "group1",
    },
    {
      id: "gender",
      controlType: "dropdown",
      label: {
        eng: "Gender",
        fra: "Genre",
        ara: "جنس",
      },
      required: false,
      alignmentGroup: "group2",
    },
    {
      id: "samplePhone",
      controlType: "phone",
      disabled: true,
      required: false,
      prefix: ["+91"],
      label: {
        eng: "Phone Number",
        ara: "رقم الهاتف",
        fra: "Numéro de téléphone",
      },
      placeholder: {
        eng: "Enter your phone number",
        ara: "أدخل رقم هاتفك",
        fra: "Entrez votre numéro de téléphone",
      },
    },
    {
      id: "password",
      controlType: "password",
      label: {
        eng: "Password",
        ara: "كلمة المرور",
        fra: "Mot de passe",
      },
      placeholder: {
        eng: "Enter your password",
        ara: "أدخل كلمة المرور الخاصة بك",
        fra: "Entrez votre mot de passe",
      },
      info: {
        eng: "Use 8 or more characters with a mix of letters and at least one number.",
        ara: "استخدم 8 أحرف أو أكثر بمزيج من الحروف ورقم واحد على الأقل.",
        fra: "Utilisez 8 caractères ou plus avec un mélange de lettres et au moins un chiffre.",
      },
      required: true,
      alignmentGroup: "group3",
    },
    {
      id: "dob",
      controlType: "date",
      label: {
        eng: "Date of Birth",
        ara: "تاريخ الميلاد",
        fra: "Date de naissance",
      },
      minAge: 2,
      maxAge: 3,
      alignmentGroup: "group4",
      required: true,
    },
    {
      id: "consent",
      controlType: "checkbox",
      label: {
        eng: "I agree to the <b><a href='#'>Terms & Conditions</a></b> and <b><a href='#'>Privacy Policy</a></b>.",
        ara: "أوافق على <b><a href='#'>الشروط والأحكام</a></b> و<b><a href='#'>سياسة الخصوصية</a></b>.",
        fra: "J'accepte les <b><a href='#'>conditions générales</a></b> et la <b><a href='#'>politique de confidentialité</a></b>.",
      },
      required: true,
      alignmentGroup: "group5",
    },
  ],
  allowedValues: {
    gender: {
      male: {
        eng: "Male",
        fra: "Masculin",
        ara: "ذكر",
      },
      female: {
        eng: "Female",
        fra: "Féminin",
        ara: "أنثى",
      },
      other: {
        eng: "Other",
        fra: "Autre",
        ara: "آخر",
      },
    },
  },
  errors: {
    required: {
      eng: "This field is required",
      fra: "Ce champ est obligatoire",
      ara: "هذه الخانة مطلوبه",
    },
    passwordMismatch: {
      eng: "Passwords do not match",
      fra: "Les mots de passe ne correspondent pas",
      ara: "كلمات المرور غير متطابقة",
    },
    capsLock: {
      eng: "Caps Lock is on",
      fra: "Verr Maj activé",
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
  errors?: Errors;
}
```

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
  additionalSchema?: {
    // additional schema is for passing some schema's label & placeholder on later
    // stage of form rendering, here id will be the same id given in the schema
    [id: string]: {
      label: Label;
      placeholder: Label;
    };
  };
}
```

## reCAPTCHA Integration

The form builder supports Google reCAPTCHA v2 integration. To enable reCAPTCHA:

1. Add the reCAPTCHA configuration to your `additionalConfig`:

```javascript
recaptcha: {
  siteKey: 'your-recaptcha-site-key', // Required
  enabled: true,                      // Optional, defaults to true
  language: 'en'                      // Optional, defaults to form's current
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
