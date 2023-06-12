# Secure Biometric Interface

A standalone vanillajs library component for interacting with SBI devices and auth capture Face, Finger & Iris detail.

## Build

To build up the library

```bash
npm run build
```

To generate a package from it

```bash
npm pack
```

For publishing the package

```bash
npm publish
```

## Local

### In Html

Either you build the library or serve the libray

```bash
npm run build

or 

npm run start
```

After that you can serve the index.html file from the below folder
```
secure-biometric-device
└─── example
     └─── html
          │─── index.html
          └─── mbd.js
```

How are we implement the library in vanilla javascript, checkout the `mbd.js` file (see above path), below you can see the snippet also.

```js
SecureBiometricInterface.init({
  container: document.getElementById("secure-biometric-device"),
  sbiEnv: BIOMETRIC_ENV_OBJECT,
  buttonLabel: BUTTON_LABEL,
  disable: DISABLE_OR_NOT,
  transactionId: TRANSACTION_ID,
  onCapture: SUCCESS_CALLBACK_METHOD,
  onErrored: ERROR_CALLBACK_METHOD
})
```

### In React

For running our library in react, first of all build the secure-biometric-device library and bundle up as a pakcage

```bash
npm run package
```

After that you can go to our react example of the project, install the node_modules and run as a react app
```
secure-biometric-device
└─── example
     └─── react
          │─── public
          │─── src
          |    │─── App.js
          |    └─── index.js
          └─── package.json
```

Code snippet of using secure-biometric-device library in react is given below ( you can also find it in `App.js` file of src folder)

```js
// import the library first
import { init } from "secure-biometric-device";

// call the library method
init({
    container: document.getElementById("secure-biometric-device"),
    sbiEnv: BIOMETRIC_ENV_OBJECT,
    buttonLabel: BUTTON_LABEL,
    disable: DISABLE_OR_NOT,
    transactionId: TRANSACTION_ID,
    onCapture: SUCCESS_CALLBACK_METHOD,
    onErrored: ERROR_CALLBACK_METHOD
});

```

## Props

Common props you may want to specify include:

| prop           | type     | default value   | note                                                                                                                                                                     |
| -------------- | -------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `container` | `HTMLElement` | | an html div element from where we will inject `secure-biometric-device` UI |
| `buttonLabel`   | `string` | Scan & Verify | Capture button label                                                                                                                                                     |
| `transactionId`| `string` | | Transaction id of the current biometric authorization |
| `onCapture`    | `func`   |                 | The function to be called on a successful capture with [Biometric response](https://docs.mosip.io/1.1.5/biometrics/mosip-device-service-specification#capture-response). |
| `onErrored`    | `func`   |                 | optional callback function on capture failure with error msg string.                                                                                                     |
| `sbiEnv` | `Object` | See below       | Biometric environment detail                                                                                                                                             |
| `disable` | `boolean` | false | To disable verify button |

### Prop sbiEnv
For more information check [MDS Specification](https://docs.mosip.io/1.1.5/biometrics/mosip-device-service-specification)

| field                | type     | valid values                                                                                                                                                                                                   | default value | note                                                                             |
| -------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------- |
| `env`                | `string` | ("Staging", "Developer", "Pre-Production", "Production")                                                                                                                                                       | "Staging"     | The target environment.                                                          |
| `captureTimeout`     | `number` |                                                                                                                                                                                                                | 30            | Max time the app will wait for the capture api call.                             |
| `discTimeout`        | `number` |                                                                                                                                                                                                                | 30            | Max time the app will wait for the discover api call.                            |
| `dinfoTimeout`       | `number` |                                                                                                                                                                                                                | 30            | Max time the app will wait for the device info api call.                         |
| `domainUri`          | `string` |                                                                                                                                                                                                                | window.origin | URI of the authentication server.                                                |
| `faceCaptureCount`   | `number` | Always set to 1                                                                                                                                                                                                | 1             | Number of biometric data that is collected for face.                             |
| `faceCaptureScore`   | `number` | Floating point number ranges from 0-100.                                                                                                                                                                       | 70            | Expected quality score that should match to complete a successful face capture   |
| `fingerBioSubtypes`  | `string` | ["Left IndexFinger", "Left MiddleFinger", "Left RingFinger", "Left LittleFinger", "Left Thumb", "Right IndexFinger", "Right MiddleFinger", "Right RingFinger", "Right LittleFinger", "Right Thumb", "UNKNOWN"] | "UNKNOWN"     | Array of bioSubType for finger.                                                  |
| `fingerCaptureCount` | `number` | Ranges from 1 to 10                                                                                                                                                                                            | 1             | Number of biometric data that is collected for finger.                           |
| `fingerCaptureScore` | `number` | Floating point number ranges from 0-100.                                                                                                                                                                       | 70            | Expected quality score that should match to complete a successful finger capture |
| `irisBioSubtypes`    | `string` | ["Left", "Right", "UNKNOWN"]                                                                                                                                                                                   | "UNKNOWN"     | Array of bioSubType for iris                                                     |
| `irisCaptureCount`   | `number` | Ranges from 1 to 2                                                                                                                                                                                             | 1             | Number of biometric data that is collected for Iris.                             |
| `irisCaptureScore`   | `number` | Floating point number ranges from 0-100.                                                                                                                                                                       | 70            | Expected quality score that should match to complete a successful iris capture   |
| `portRange`          | `string` | Port should be under that range of 4501 - 4600.                                                                                                                                                                | "4501-4600"   | Range of port that will be scanned for available devices                         |

## License

- `axios` - is a promised-based HTTP client for JavaScript licensed under MIT
- `jose` - a JavaScript module for JSON Object Signing and Encryption, providing support for JSON Web Tokens (JWT), JSON Web Signature (JWS), JSON Web Encryption (JWE), JSON Web Key (JWK), JSON Web Key Set (JWKS), licensed under MIT
- `rollup` - is a module bundler for JavaScript which compiles small pieces of code into something larger and more complex, such as a library or application, licensed under MIT
- `rollup-plugin-postcss` - used for seamless integration between rollup & postcss , licensed under MIT
- `@rollup/plugin-commonjs` - a Rollup plugin to convert CommonJS modules to ES6, so they can be included in a Rollup bundle, licensed under MIT
- `@rollup/plugin-image` - A Rollup plugin which imports JPG, PNG, GIF, SVG, and WebP files, licensed under MIT
- `@rollup/plugin-json` -  A Rollup plugin which Converts .json files to ES6 modules, licensed under MIT
- `@rollup/plugin-node-resolve` - a Rollup plugin which locates modules using the Node resolution algorithm, for using third party modules in `node_modules`, licensed under MIT
- `@rollup/plugin-terser` - a Rollup plugin to compress the output code, licensed under MIT
