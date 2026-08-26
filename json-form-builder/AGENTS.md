# AGENTS.md — json-form-builder

Parent guide: [../AGENTS.md](../AGENTS.md)

## Repository Overview

`@mosip/json-form-builder` renders forms from a JSON schema: multi-language
labels/errors, RTL layout, regex field validation, reCAPTCHA, and built-in
field components (checkbox, date, dropdown, file upload, password, phone,
photo, radio, text — see `src/components/`).

## Technology Stack

- TypeScript, bundled with Rollup (`rollup.config.mjs`) into
  `dist/JsonFormBuilder.umd.js` (CJS/UMD), `.esm.js`, and `.d.ts` types.
- Jest (`jest.config.js`, tests under `src/__tests__/`). ESLint + Prettier.
- Storybook 8 (`.storybook/main.ts`).
- Runtime deps: `date-fns`, `mime-types`. Peer deps: `react`/`react-dom` `^18.2.0`.

## Build & Test Commands

```bash
cd json-form-builder
npm install
npm run build     # rimraf dist && rollup -c
npm test          # jest
npm run lint       # eslint src/**/*.ts
npm run format     # prettier --write "src/**/*.ts"
npm run storybook  # storybook dev -p 6006
```

`npm run verify` (CI) aliases `build`. `npm run dev`/`watch` rebuild on
change. `prepublishOnly` runs `lint` — a lint failure blocks `npm publish`
even if the build succeeds.

## Configuration

No `.env` needed — consumers configure the library via the JSON schema
passed into `JsonFormBuilder` (see `README.md`), not environment variables.

## Project Structure Notes

```text
json-form-builder/src/
├── JsonFormBuilder.ts   Entry point / orchestrator
├── components/          One file per field type
└── __tests__/           Jest tests + setup
```

Published package ships only `dist/` (`files: ["dist"]` in `package.json`) —
anything a consumer needs at runtime must end up in the Rollup output.

## Pull Request Guidelines

- CI builds this module on PRs (`push-trigger.yml` → `build-json-form-builder`
  job, reusable `mosip/kattu` `npm-build.yml`).
- npm publish (`npm-publish-to-npm-registry.yml`) only runs on pushes to
  `develop`/`release*`/`MOSIP*`, not PRs — no need to bump `version` for a PR.

## Agent rules

### Do

1. Keep new field components under `src/components/`, following existing
   naming (`<Type>Component.ts`).
2. Run `npm run lint` and `npm test` before finishing a change here.
3. Update `README.md` if the public schema shape or a field/controlType changes.

### Do not

1. Hand-edit `dist/` or `coverage/` — both generated and gitignored.
2. Remove the `prepublishOnly` lint gate from `package.json`.
3. Add environment-variable configuration — the schema passed by the
   consumer is this library's only configuration surface.
