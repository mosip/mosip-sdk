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
import { JsonFormBuilder } from "anushase@json-form-builder";

const config = {
  schema: [
    {
      id: "name",
      controlType: "textbox",
      label: {
        eng: "Name",
        fra: "Nom",
      },
      placeholder: {
        eng: "Enter your name",
        fra: "Entrez votre nom"
      },
      capsLock: {
        eng: "Caps Lock is on",
        fra: "Verr Maj activé"
      }
      validator: [
        {
          regex: "^[a-zA-Z]{4,35}$",
          error: {
            eng: "Name should contain letters and must be of length between 4 to 35",
            fra: "Le nom doit contenir des lettres et doit avoir une longueur comprise entre 4 et 35"
          }
        }
      ],
      info: {
        eng: "Your name should contain letters only and should be of length between 4 to 35",
        fra: "Votre nom doit contenir uniquement des lettres et doit avoir une longueur comprise entre 4 et 35"
      }
      required: true,
    },
    // ... more fields
  ],
  errors: {
    required: {
      eng: "This field is required",
      fra: "Ce champ est obligatoire",
    },
  },
  language: {
    mandatory: ["eng"],
    optional: ["fra"],
    langCodeMap: {
      eng: "en",
      fra: "fr",
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
  }
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
    npm link @anushase/json-form-builder
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
