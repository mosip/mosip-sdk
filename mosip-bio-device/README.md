# Mosip L1 Biometric Dropdown

A standalone library component for interacting with SBI devices and auth capture Face, Finger & Iris detail.

## Build

To build up the library

```bash
npm run rollup
```

To generate a package from it

```bash
npm pack
```

For publishing the package

```bash
npm publish
```

## Component

```js
<MosipBioDevice 
    transactionId="your_transaction_id"
    labelName="label_name"
    buttonName="button_name"
    biometricEnv={biometricEnv}
    onCapture={myChange}
    onErrored={myError}>
</MosipBioDevice>
```

## Props

Common props you may want to specify include:

| prop           | type     | default value   | note                                                                                                                                                                     |
| -------------- | -------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `labelName`    | `string` | Select a Device | Device dropdown label                                                                                                                                                    |
| `buttonName`   | `string` | Scan and Verify | Capture button label                                                                                                                                                     |
| `transactionId`| `string` | | Transaction id of the current biometric authorization |
| `onCapture`    | `func`   |                 | The function to be called on a successful capture with [Biometric response](https://docs.mosip.io/1.1.5/biometrics/mosip-device-service-specification#capture-response). |
| `onErrored`    | `func`   |                 | optional callback function on capture failure with error msg string.                                                                                                     |
| `jsonCss`      | `Object` | See below       | Json object for customize the css of the component                                                                                                                       |
| `biometricEnv` | `Object` | See below       | Biometric environment detail                                                                                                                                             |

### Prop jsonCss

For more information check [React-JSS integration page](https://cssinjs.org/react-jss)

| field          | type     | note                          |
| -------------- | -------- | ----------------------------- |
| `selectBox`    | `Object` | Css for select dropdown       |
| `selectLabel`  | `Object` | Css for select dropdown label |
| `verifyButton` | `Object` | Css for verify button         |

### Prop biometricEnv
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

- `react-select` - a third party dropdown component, licensed under MIT
- `react-jss` - use to apply css in DOM through JSON object, licensed under MIT
- `axios` - is a promised-based HTTP client for JavaScript licensed under MIT
- `rollup` - is a module bundler for JavaScript which compiles small pieces of code into something larger and more complex, such as a library or application, licensed under MIT
- `rollup-plugin-dts` - a plugin that lets you roll-up your `.d.ts` definition files, licensed under LGPL-3.0
- `rollup-plugin-peer-deps-external` - Automatically externalize peerDependencies in a rollup bundle, licensed under MIT
- `rollup-plugin-postcss` - used for seamless integration between rollup & postcss , licensed under MIT
- `@rollup/plugin-commonjs` - a Rollup plugin to convert CommonJS modules to ES6, so they can be included in a Rollup bundle, licensed under MIT
- `@rollup/plugin-image` - A Rollup plugin which imports JPG, PNG, GIF, SVG, and WebP files, licensed under MIT
- `@rollup/plugin-json` -  A Rollup plugin which Converts .json files to ES6 modules, licensed under MIT
- `@rollup/plugin-node-resolve` - a Rollup plugin which locates modules using the Node resolution algorithm, for using third party modules in `node_modules`, licensed under MIT
- `@rollup/plugin-typescript` - a Rollup plugin for seamless integration between Rollup and Typescript, licensed under MIT
- `jose` - a JavaScript module for JSON Object Signing and Encryption, providing support for JSON Web Tokens (JWT), JSON Web Signature (JWS), JSON Web Encryption (JWE), JSON Web Key (JWK), JSON Web Key Set (JWKS), licensed under MIT
