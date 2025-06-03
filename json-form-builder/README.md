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
    currentLanguage: "eng",
    defaultLanguage: "eng",
    showLanguageSwitcher: true,
  },
  recaptcha: {
    siteKey: "your-recaptcha-site-key",
    enabled: true,
    language: "eng",
  },
  language: {
    currentLanguage: "fra",
    defaultLanguage: "eng",
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
  allowedValues?: AllowedValues;
  errors?: Errors;
  language: LanguageSettings;
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
- `updateLanguage(newLanguage: string)`: Updates the form language and reCAPTCHA language

## Styling

The form builder comes with default styles but can be customized using CSS. The main classes are:

- `.form`: The main form container
- `.form-group`: Groups of fields
- `.form-field`: Individual field container
- `.form-field-group`: Container for multi-language fields
- `.input_box`: Input elements
- `.language-switcher`: Language selection container
- `.recaptcha-container`: reCAPTCHA widget container

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
