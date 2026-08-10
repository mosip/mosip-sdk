# AGENTS.md — json-form-builder

Parent guide: [../AGENTS.md](../AGENTS.md)

## Repository Overview

`@mosip/json-form-builder` is a TypeScript library that renders forms from a
JSON schema. It supports multi-language labels/errors, RTL layout, field
validation (including regex validators), reCAPTCHA integration, and a set of
built-in field components (checkbox, date, dropdown, file upload, password,
phone input, photo, radio, and simple text-type fields — see
`src/components/`).

## Technology Stack

- TypeScript, compiled/bundled with Rollup (`rollup.config.mjs`) into
  `dist/JsonFormBuilder.umd.js` (CJS/UMD), `dist/JsonFormBuilder.esm.js`
  (ESM), and `dist/JsonFormBuilder.d.ts` (types).
- Test runner: Jest (`jest.config.js`), tests under `src/__tests__/`.
- Lint/format: ESLint (`.eslintrc.js`) and Prettier.
- Storybook 8 (`.storybook/main.ts`) for interactive component docs.
- Runtime dependencies: `date-fns`, `mime-types`.
- Peer dependencies: `react` and `react-dom` (`^18.2.0`).

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

`npm run verify` (used by CI) is an alias for `npm run build`.
`npm run dev` / `npm run watch` rebuild on file changes under `src/`.

## Configuration

No `.env` file is required to build or test this module. Consumers configure
the library at runtime via the JSON schema passed into `JsonFormBuilder`
(see the usage example in `README.md`), not via environment variables.

## Project Structure Notes

```text
json-form-builder/
├── src/
│   ├── JsonFormBuilder.ts       Entry point / orchestrator
│   ├── components/              One file per field type (Checkbox, Date, Dropdown, ...)
│   └── __tests__/                Jest tests + test setup
├── .storybook/                  Storybook config
├── rollup.config.mjs
├── jest.config.js
└── package.json
```

## Development Workflow

1. `npm install` inside this directory (this module's `package-lock.json` is
   independent of the other modules').
2. Add or modify a field type under `src/components/`, following the
   pattern of an existing component file.
3. Add/update a Jest test under `src/__tests__/`.
4. Run `npm run lint` and `npm test` before committing.
5. Run `npm run build` to confirm the Rollup bundle and type declarations
   still generate cleanly.

## Pull Request Guidelines

- CI builds this module on pull requests via
  `.github/workflows/push-trigger.yml` (`build-json-form-builder` job, using
  the reusable `mosip/kattu` `npm-build.yml` workflow) — a broken build will
  fail PR checks.
- Publishing to npm (`npm-publish-to-npm-registry.yml`) only runs on pushes
  to `develop`, `release*`, or `MOSIP*`, not on PRs — you do not need to bump
  `version` in `package.json` for a normal PR.

## Repository-Specific Considerations

- `prepublishOnly` runs `npm run lint`, so a lint failure blocks `npm
  publish` (and by extension the CI publish job) even if the build itself
  succeeds.
- The published package only ships the `dist/` directory (`files: ["dist"]`
  in `package.json`); anything a consumer needs at runtime must end up in
  the Rollup output, not left as a source-only file.

## Agent rules

### Do

1. Keep new field components under `src/components/` consistent with the
   existing naming and file structure (`<Type>Component.ts`).
2. Run `npm run lint` and `npm test` in this directory before finishing a
   change here.
3. Update `README.md` in this directory if you change the public schema
   shape or add a new field/controlType.

### Do not

1. Do not hand-edit files under `dist/` or `coverage/` — both are generated
   and gitignored.
2. Do not remove the `prepublishOnly` lint gate from `package.json`.
3. Do not add environment-variable-based configuration to this library — its
   documented configuration surface is the JSON schema passed by the
   consumer.
