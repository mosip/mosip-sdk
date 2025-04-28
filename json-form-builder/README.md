# JSON Form Builder

A TypeScript-based dynamic form builder that generates forms from JSON configuration. This library provides a flexible and type-safe way to create forms with support for multiple languages, validation, and responsive design.

## Features

- 🎯 TypeScript support with full type safety
- 🌐 Multi-language support with language preferences and switching
- 📱 Responsive design with mobile-first approach
- ✅ Form validation with regex support
- 🔄 Dynamic form field generation
- 🎨 Customizable styling
- 🔒 Password confirmation support
- 🤖 Google reCAPTCHA integration with enable/disable option
- 📝 Support for various input types:
  - Text input
  - Password
  - Date
  - Dropdown
  - Multi-language text input
- 🌍 RTL (Right-to-Left) language support
- 🔤 Language-specific validation rules

## Installation

```bash
npm install json-form-builder
```

## Available Bundles

The library is available in two formats:

1. **UMD Bundle** (`dist/JsonFormBuilder.umd.js`):
   - Compatible with CommonJS, AMD, and global variables
   - Use this for traditional browser usage or when you need global access

2. **ESM Bundle** (`dist/JsonFormBuilder.esm.js`):
   - Modern ES modules format
   - Use this for modern JavaScript applications and bundlers

TypeScript type definitions are included in the `dist` directory.

## Usage

```typescript
import JsonFormBuilder from 'json-form-builder';

const config = {
  schema: [
    {
      id: 'name',
      controlType: 'textbox',
      type: 'simpleType',
      label: {
        eng: 'Name',
        fra: 'Nom',
        ara: 'الاسم'
      },
      required: true,
      validators: [
        {
          type: 'regex',
          validator: '^[a-zA-Z ]+$',
          errorCode: 'Only letters and spaces allowed',
          langCode: 'eng'
        },
        {
          type: 'regex',
          validator: '^[\u0600-\u06FF ]+$',
          errorCode: 'يُسمح فقط بالحروف والمسافات',
          langCode: 'ara'
        }
      ]
    }
  ],
  mandatoryLanguages: ['eng'],
  optionalLanguages: ['fra', 'ara']
};

const additionalConfig = {
  submitButton: {
    label: 'Submit',
    action: (data) => {
      console.log('Form submitted:', data);
    }
  },
  language: {
    currentLanguage: 'eng',
    defaultLanguage: 'eng',
    showLanguageSwitcher: true,
    languageSwitcherPosition: 'top',
    availableLanguages: ['eng', 'fra', 'ara'],
    rtlLanguages: ['ara', 'ar', 'he', 'fa', 'ur']  // List of RTL languages
  }
};

const formBuilder = JsonFormBuilder(config, 'form-container', additionalConfig);
formBuilder.render();
```

## Configuration

### FormConfig Interface

```typescript
interface FormConfig {
  schema: FormField[];
  allowedValues?: AllowedValues;
  mandatoryLanguages?: string[];
  optionalLanguages?: string[];
}
```

### FormField Interface

```typescript
interface FormField {
  id: string;
  controlType: 'textbox' | 'password' | 'date' | 'dropdown';
  type?: 'simpleType' | 'string';
  label: Label;  // Map of language codes to label text
  required?: boolean;
  validators?: Validator[];
  cssClasses?: string[];
  alignmentGroup?: string;
}
```

### Label Interface

```typescript
interface Label {
  [key: string]: string;  // language code -> label text
}
```

### Validator Interface

```typescript
interface Validator {
  type: 'regex';
  validator: string;
  errorCode: string;
  langCode?: string;  // Optional language code for language-specific validation
}
```

### LanguageConfig Interface

```typescript
interface LanguageConfig {
  currentLanguage: string;  // Language to display
  defaultLanguage: string;  // Fallback language
  showLanguageSwitcher?: boolean;  // Enable/disable language switcher
  languageSwitcherPosition?: 'top' | 'bottom';  // Position of language switcher
  availableLanguages?: string[];  // Available languages for switching
  rtlLanguages?: string[];  // List of RTL languages
}
```

## Language-Specific Validation

The form builder supports language-specific validation rules. You can specify different validation rules for different languages using the `langCode` property in the validator:

```typescript
validators: [
  {
    type: 'regex',
    validator: '^[a-zA-Z ]+$',
    errorCode: 'Only letters and spaces allowed',
    langCode: 'eng'
  },
  {
    type: 'regex',
    validator: '^[\u0600-\u06FF ]+$',
    errorCode: 'يُسمح فقط بالحروف والمسافات',
    langCode: 'ara'
  }
]
```

Validators without a `langCode` will apply to all languages.

## RTL Support

The form builder includes built-in support for Right-to-Left (RTL) languages. When using RTL languages like Arabic, the form will automatically adjust its layout. The following features are supported:

1. **Automatic RTL Detection**:
   - The form automatically detects RTL languages based on the `rtlLanguages` configuration
   - Default RTL languages: Arabic ('ara', 'ar'), Hebrew ('he'), Persian ('fa'), Urdu ('ur')

2. **Dynamic Direction Switching**:
   - The form's direction automatically switches when changing languages
   - The `dir` attribute is updated on the container element

3. **RTL-Specific Layout**:
   - Form groups are reversed in RTL mode
   - Form field groups are reversed in RTL mode
   - Language switcher alignment is adjusted
   - Required field indicators are positioned correctly
   - Error messages are right-aligned
   - Form labels are right-aligned
   - Input text is right-aligned
   - Submit button alignment is adjusted
   - reCAPTCHA container alignment is adjusted

4. **Responsive RTL Support**:
   - RTL layout is maintained on mobile devices
   - Form groups stack vertically on small screens while maintaining RTL order

Example configuration:
```typescript
language: {
  currentLanguage: 'eng',
  defaultLanguage: 'eng',
  showLanguageSwitcher: true,
  languageSwitcherPosition: 'top',
  availableLanguages: ['eng', 'fra', 'ara'],
  rtlLanguages: ['ara', 'ar', 'he', 'fa', 'ur']
}
```

## Styling

The form builder includes responsive styles by default. You can customize the appearance by overriding the following CSS classes:

- `.form-group`: Container for grouped fields
- `.form-field`: Individual form field container
- `.form-field-group`: Container for multi-language fields
- `.input_box`: Input field styling
- `.form-button`: Submit button styling
- `.error-message`: Error message container
- `.error-icon`: Error icon styling
- `.error-text`: Error text styling
- `.recaptcha-container`: Container for reCAPTCHA widget
- `.language-switcher`: Container for language switcher
- `.language-switcher select`: Language selector styling
- `.language-switcher label`: Language label styling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

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
