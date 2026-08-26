# AGENTS.md — react-secure-biometric-interface-integrator

Parent guide: [../AGENTS.md](../AGENTS.md)

## Repository Overview

`@mosip/react-secure-biometric-interface-integrator` is a React component
(`SecureBiometricInterfaceIntegrator`) for capturing Face/Finger/Iris
biometrics from an SBI (Secure Biometric Interface) / MOSIP Device Service
device. Full prop reference (`sbiEnv`, `customStyle`, `onCapture`,
`onErrored`, etc.) is in this directory's `README.md` — read it before
changing the component's public API.

## Technology Stack

- React 18 + TypeScript/JSX under `src/lib/`.
- Rollup (`rollup.config.ts`) → `dist/cjs`, `dist/esm`, `dist/index.d.ts`.
- `react-scripts` (CRA) drives local dev/test (`npm start`/`npm test`).
- Storybook 7. i18n via `i18next`/`react-i18next`
  (`src/lib/assets/locales/`: `default`, `en`, `ar`, `hi`, `kn`, `ta`).
- Key deps: `axios`, `crypto-js`, `jose`, `react-select`.

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

`npm run verify` (CI publish workflow) aliases `build`.

## Configuration

`.env` sets `REACT_APP_DEFAULT_LANGUAGE="en"` (build-time, not a secret) —
the only env var this module uses. Runtime SBI behavior (target environment,
capture timeouts, port range) is configured via the `sbiEnv` prop at render
time, not env vars — see `README.md`'s `sbiEnv` field table.

## Project Structure Notes

```text
react-secure-biometric-interface-integrator/src/
├── index.ts
└── lib/
    ├── SecureBiometricInterfaceIntegrator/   Component + styles
    ├── common/                                Shared UI (LoadingIndicator)
    ├── models/                                TS interfaces/types/constants
    └── assets/                                Images + locale JSON
```

Published package ships only `dist/` (`files: ["dist"]`) — `src/` isn't
published.

## Pull Request Guidelines

- **Not** built by `push-trigger.yml` on PRs (that only builds
  `sign-in-with-esignet`, `secure-biometric-interface-integrator`,
  `json-form-builder`, `storybook-example`). Only built/published on pushes
  to `develop`/`release*`/`MOSIP*` via `publish-npm.yaml` — build and test
  locally before opening a PR; CI won't catch a broken build at PR time.

## Repository-Specific Considerations

- Shares its MDS capture flow with the vanilla-JS sibling
  `../secure-biometric-interface-integrator` (React vs. plain-JS consumption
  of the same device flow). A capture/timeout/retry bugfix here likely
  applies there too — check both.

## Agent rules

### Do

1. Keep `README.md`'s `sbiEnv`/prop tables in sync with any public-API change.
2. Add new user-facing strings to every locale file under
   `src/lib/assets/locales/`, not just `en`.
3. Run `npm test`/`npm run build` locally before opening a PR (PR-time CI
   doesn't build this module).

### Do not

1. Add secrets to `.env` — it holds only a non-secret display-language default.
2. Diverge capture behavior from `../secure-biometric-interface-integrator`
   without a documented reason.
