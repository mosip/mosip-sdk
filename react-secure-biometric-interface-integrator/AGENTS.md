# AGENTS.md — react-secure-biometric-interface-integrator

Parent guide: [../AGENTS.md](../AGENTS.md)

## Repository Overview

`@mosip/react-secure-biometric-interface-integrator` is a React component
(`SecureBiometricInterfaceIntegrator`) for capturing Face, Finger, and Iris
biometrics from a Secure Biometric Interface (SBI) / MOSIP Device Service
(MDS) device. Its full prop reference (`sbiEnv`, `customStyle`, `onCapture`,
`onErrored`, etc.) is documented in this directory's `README.md` — read that
before changing the component's public API.

## Technology Stack

- React 18 + TypeScript/JSX under `src/lib/`.
- Bundler: Rollup (`rollup.config.ts`) producing `dist/cjs`, `dist/esm`, and
  `dist/index.d.ts`.
- Local dev/test harness: `react-scripts` (Create React App) — `npm start`
  and `npm test` both delegate to `react-scripts`.
- Storybook 7 (`.storybook/main.ts`).
- i18n: `i18next` / `react-i18next`, with locale JSON files under
  `src/lib/assets/locales/` (`default.json`, `en`, `ar`, `hi`, `kn`, `ta`).
- Key runtime dependencies: `axios`, `crypto-js`, `jose`, `react-select`.

## Build & Test Commands

```bash
cd react-secure-biometric-interface-integrator
npm install
npm run build       # rollup -c
npm test            # react-scripts test
npm start           # react-scripts start (local dev server)
npm run storybook    # storybook dev -p 6006
npm run package      # rollup -c && npm pack
```

`npm run verify` (used by CI's publish workflow) is an alias for `npm run
build`.

## Configuration

- `.env` in this directory sets `REACT_APP_DEFAULT_LANGUAGE="en"` — a
  Create-React-App-style build-time variable, not a secret. There are no
  other environment variables required to build or test this module.
- Runtime behavior (target SBI environment, capture timeouts, port range,
  etc.) is configured by the consuming application through the `sbiEnv` prop
  at render time, not through environment variables — see `README.md` for
  the full `sbiEnv` field table.

## Project Structure Notes

```text
react-secure-biometric-interface-integrator/
├── src/
│   ├── index.ts
│   └── lib/
│       ├── SecureBiometricInterfaceIntegrator/   Component + styles
│       ├── common/                                Shared UI (LoadingIndicator)
│       ├── models/                                TS interfaces/types/constants
│       └── assets/                                Images + locale JSON
├── .storybook/
├── rollup.config.ts
└── package.json
```

## Development Workflow

1. `npm install` inside this directory.
2. Make changes under `src/lib/`; if you add a new user-facing string, add
   it to every locale file under `src/lib/assets/locales/`, not just `en`.
3. Verify visually with `npm run storybook` where practical, since this
   component talks to a local SBI/MDS device service that Jest cannot
   exercise directly.
4. Run `npm test` and `npm run build` before committing.

## Pull Request Guidelines

- This module is **not** built by `.github/workflows/push-trigger.yml` on
  pull requests (that workflow only builds `sign-in-with-esignet`,
  `secure-biometric-interface-integrator`, `json-form-builder`, and
  `storybook-example` on PRs). It is only built and published on pushes to
  `develop`, `release*`, or `MOSIP*` via
  `.github/workflows/publish-npm.yaml`. Build and test this module locally
  before opening a PR — CI will not catch a broken build at PR time.
- Update `README.md` in this directory if you add, rename, or remove a prop.

## Repository-Specific Considerations

- This module and its vanilla-JS sibling
  (`../secure-biometric-interface-integrator`) implement the same MDS
  capture flow for two different consumption styles (React component vs.
  plain JS). If you fix a bug in the capture/timeout/retry logic here,
  check whether the same issue exists in
  `../secure-biometric-interface-integrator`.
- The published package only ships `dist/` (`files: ["dist"]` in
  `package.json`); source under `src/` is not published.

## Agent rules

### Do

1. Read the `sbiEnv` and prop tables in this directory's `README.md` before
   changing the component's public API, and keep the README in sync with
   any API change.
2. Update every locale file under `src/lib/assets/locales/` when adding a
   user-facing string.
3. Build and test this module locally (`npm test`, `npm run build`) before
   opening a PR — PR-time CI does not build this module.

### Do not

1. Do not assume PR-time CI validates this module's build; it does not.
2. Do not add secrets to `.env` in this directory — it currently holds only
   a non-secret display-language default.
3. Do not diverge the capture behavior from
   `../secure-biometric-interface-integrator` without a documented reason —
   the two modules are meant to behave consistently.
