# MOSIP Plugins

A collection of plugins and utilities for the MOSIP (Modular Open Source Identity Platform) ecosystem.

## Components

### JSON Form Builder

A TypeScript-based dynamic form builder that generates forms from JSON configuration. This library provides a flexible and type-safe way to create forms with support for multiple languages, validation, and responsive design.

Key features:
- TypeScript support with full type safety
- Multi-language support with language preferences and switching
- Responsive design with mobile-first approach
- Form validation with regex support
- Dynamic form field generation
- Customizable styling
- Password confirmation support
- Google reCAPTCHA integration

For more details, see the [JSON Form Builder documentation](json-form-builder/README.md).

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

### Building

Each component can be built independently. Navigate to the component directory and run:

```bash
npm run build
```

### Testing

Run tests for all components:

```bash
npm test
```

## License

MIT