# JSON Form Builder Examples

This directory contains example implementations of the JSON Form Builder library. Each example demonstrates different features and use cases.

## Available Examples

1. **basic.html**
   - Simple form with name and email fields
   - Multi-language support (English, French, Arabic)
   - RTL support
   - Basic validation

2. **advanced.html**
   - Complex form with multiple field types
   - Multi-language support
   - RTL support
   - Language-specific validation
   - Dropdown fields
   - Date fields
   - Password fields

3. **custom.html**
   - Custom styled form
   - Modern UI design
   - Multi-language support
   - RTL support
   - Responsive layout

## Running the Examples

You can run these examples using any HTTP server. Here are a few options:

### Option 1: Using Python's built-in HTTP server

If you have Python installed:

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

Then open your browser and navigate to:
- http://localhost:8080/basic.html
- http://localhost:8080/advanced.html
- http://localhost:8080/custom.html

### Option 2: Using Node.js http-server

If you have Node.js installed:

1. Install http-server globally:
```bash
npm install -g http-server
```

2. Run the server:
```bash
http-server -p 8080
```

Then open your browser and navigate to:
- http://localhost:8080/basic.html
- http://localhost:8080/advanced.html
- http://localhost:8080/custom.html

### Option 3: Using PHP's built-in server

If you have PHP installed:

```bash
php -S localhost:8080
```

Then open your browser and navigate to:
- http://localhost:8080/basic.html
- http://localhost:8080/advanced.html
- http://localhost:8080/custom.html

## Testing Features

When running the examples, you can test:

1. **Multi-language Support**:
   - Use the language switcher to change languages
   - Verify that all labels and placeholders update
   - Check that validation messages appear in the correct language

2. **RTL Support**:
   - Switch to Arabic language
   - Verify that the form layout changes to RTL
   - Check that text alignment is correct
   - Verify that form elements are properly positioned

3. **Validation**:
   - Try submitting the form without filling required fields
   - Enter invalid data to test validation rules
   - Test language-specific validation rules

4. **Responsive Design**:
   - Resize your browser window
   - Test on mobile devices
   - Verify that the layout adjusts correctly

## Note

Make sure you have built the library before running the examples:

```bash
cd ../..  # Go to the root directory
npm run build
```

The examples use the built files from the `dist` directory, so they need to be available for the examples to work correctly. 