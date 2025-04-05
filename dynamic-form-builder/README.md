# Dynamic Form Builder

Construct a dynamic form with validation based on the input JSON-based form structure.

## Installation

```
# using npm
npm i dynamic-form-builder

# using yarn
yarn add dynamic-form-builder
```

## Usage

```html
<script src="DynamicFormBuilder.js"></script>
<div id="formContainer"></div>
```

```js
const formBuilder = new DynamicFormBuilder(formConfig, 'formContainer');
formBuilder.render();
```

## Supported config structure

```json
{
  "schema": [
    {
      "id": "fullName",
      "controlType": "textbox",
      "type": "simpleType",
      "label": [{"eng": "Full Name"}, {"fra": "Nom complet"}],
      "validators": [{"type": "regex", "validator": "^[a-zA-Z\\s]{2,30}$", "langCode": "eng", "errorCode": "UI_100001"}],
      "alignmentGroup": "groupA",
      "cssClasses": ["classA", "classB"],
      "required": true
    },
    {
      "id": "birthDate",
      "controlType": "date",
      "type": "date",
      "label": [{"eng": "Birth Date"}, {"fra": "Date de naissance"}],
      "alignmentGroup": "groupB",
      "cssClasses": ["classA", "classB"],
      "required": true
    },
    {
      "id": "gender",
      "controlType": "dropdown",
      "type": "simpleType",
      "label": [{"eng": "Gender"}, {"fra": "Le genre"}],
      "alignmentGroup": "groupC",
      "cssClasses": ["classA", "classB"],
      "required": true
    },
    {
      "id": "nationality",
      "controlType": "dropdown",
      "type": "string",
      "label": [{"eng": "Nationality"}, {"fra": "Nationalité"}],
      "alignmentGroup": "groupC",
      "cssClasses": ["classA", "classB"],
      "required": true
    },
    {
      "id": "password",
      "controlType": "password",
      "type": "string",
      "label": [{"eng": "Password"}, {"fra": "Password"}],
      "alignmentGroup": "groupD",
      "required": true,
      "validators": [{"type": "regex", "validator": "^[a-zA-Z]{8,30}$", "errorCode": "invalid_pwd"}]
    }
  ],
  "allowedValues": {
    "gender": {
      "MLE": { "eng": "Male", "fra": "Mâle" },
      "FLE": { "eng": "Female", "fra": "Femelle" }
    },
    "nationality": {
      "IND": { "eng": "Indian", "fra": "Indienne" },
      "FR": { "eng": "Foreigner", "fra": "Étrangère" }
    }
  },
  "mandatoryLanguages": ["eng"],
  "optionalLanguages": ["fra"]
}
```