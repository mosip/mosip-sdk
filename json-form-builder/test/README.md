# Form Builder Test Suite

This directory contains test files and examples to help developers test and understand the JSON Form Builder. The test suite includes both automated tests (Jest) and manual test examples.

## Directory Structure

```
test/
├── README.md           # This file
├── index.html         # Main test page
├── examples/          # Example configurations
│   ├── basic.html     # Basic form example
│   ├── advanced.html  # Advanced form with all features
│   └── custom.html    # Custom styled form example
├── assets/           # Test assets
│   └── error_icon.svg # Error icon for validation
└── __tests__/        # Jest test files
    ├── JsonFormBuilder.test.ts
    └── types.test.ts
```

## Testing Approaches

### 1. Automated Tests (Jest)

Run the automated test suite:

```bash
npm test
```

The test suite covers:
- Form initialization
- Field rendering
- Validation logic
- Language switching
- reCAPTCHA integration
- Type definitions
- Error handling

### 2. Manual Testing

#### Basic Testing
- Open `index.html` in a browser to test all features
- Includes language switching, validation, and reCAPTCHA
- Check browser console for form data and validation

#### Example Forms
- `examples/basic.html`: Simple form with basic features
- `examples/advanced.html`: Complex form with all features
- `examples/custom.html`: Custom styled form example

## Features Demonstrated

- Multi-language support
- Form validation
- Field grouping
- Responsive layout
- Error handling
- reCAPTCHA integration
- Language switching
- Custom styling

## Test Configuration

### reCAPTCHA Testing

The test files use a test reCAPTCHA key. For production use, replace it with your own key:

```javascript
recaptcha: {
    siteKey: 'your-site-key', // Replace with your key
    theme: 'light',
    size: 'normal',
    position: 'before',
    enabled: true
}
```

### Language Testing

Test different language configurations:

```javascript
language: {
    currentLanguage: 'eng',
    defaultLanguage: 'eng',
    showLanguageSwitcher: true,
    languageSwitcherPosition: 'top',
    availableLanguages: ['eng', 'fra', 'spa']
}
```

## Browser Support

Test the form builder in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Development Testing

1. **Watch Mode**:
   ```bash
   npm run dev
   ```
   This will start the development server with hot reloading.

2. **Linting**:
   ```bash
   npm run lint
   ```
   Check for code quality and style issues.

3. **Type Checking**:
   ```bash
   npm run type-check
   ```
   Verify TypeScript type definitions.

## Contributing

Feel free to:
- Add more test cases
- Create new example forms
- Improve test coverage
- Add browser-specific tests
- Document edge cases 