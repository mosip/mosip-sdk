# AGENTS.md — secure-biometric-interface-integrator

Parent guide: [../AGENTS.md](../AGENTS.md)

## Repository Overview

`@mosip/secure-biometric-interface-integrator` is a standalone, framework-free
(vanilla JavaScript) library for interacting with SBI devices and capturing
Face, Finger, and Iris biometrics — the plain-JS counterpart to
`../react-secure-biometric-interface-integrator`. It ships prebuilt output
under `lib/` (`secureBiometricInterface.js`, `standardConstant.js`,
`sbd.css`) and example integrations under `example/html/` and
`example/react/`.

## Technology Stack

- Vanilla JavaScript, bundled with Rollup (`rollup.config.js`) into
  `dist/cjs` and `dist/es`.
- No unit test runner is configured for this module — there is no `test`
  script in `package.json`.
- Storybook 7 with the HTML renderer (`@storybook/html`,
  `.storybook/main.js`).
- Runtime dependencies: `axios`, `crypto-js`, `i18next`, `jose`.
- i18n locale files under `assets/locales/` (`default.json`, `en`, `ar`,
  `hi`, `kn`, `ta`).

## Build & Test Commands

```bash
cd secure-biometric-interface-integrator
npm install
npm run build       # rollup -c
npm run start        # rollup -c -w (watch mode)
npm run storybook    # storybook dev -p 6006
npm run package      # rollup -c && npm pack
```

`npm run verify` (used by CI's publish workflow) is an alias for `npm run
build`. There is no `npm test` script — do not add a task that assumes one
exists; if you add automated tests, you must also add the `test` script and
a test runner dependency.

## Configuration

No environment file is required to build this module. Runtime configuration
(target environment, capture timeouts, port range, etc.) is passed in by the
consuming page/app at call time — see the usage snippets in `README.md` and
the working examples under `example/html/index.html` and
`example/react/src/App.js`.

## Project Structure Notes

```text
secure-biometric-interface-integrator/
├── lib/                 Hand-maintained JS + CSS (Rollup build input)
├── utility/             DOM/element helpers, i18n, loading indicator
├── assets/              Images + locale JSON
├── example/
│   ├── html/            Plain HTML + JS integration example
│   └── react/            React integration example
├── stories/              Storybook stories
└── rollup.config.js
```

## Development Workflow

1. `npm install` inside this directory.
2. Edit source under `utility/`/`lib/` as applicable; keep
   `example/html/index.html` and `example/react/src/App.js` working, since
   they are the documented integration reference for consumers.
3. If you add a user-facing string, update every file under
   `assets/locales/`, not just `en.json`.
4. Run `npm run build` before committing (there is no automated test suite
   to run).

## Pull Request Guidelines

- CI builds this module on pull requests via
  `.github/workflows/push-trigger.yml`
  (`build-secure-biometric-interface-integrator` job). A broken `npm run
  build` will fail PR checks.
- Publishing to npm only happens on pushes to `develop`/`release*`/`MOSIP*`
  (the same workflow's `secure-biometric-interface-integrator` job), not on
  PRs.

## Repository-Specific Considerations

- This module has no automated test coverage; manual verification via
  Storybook or the `example/` apps is the practical way to check a change
  before it merges.
- This module and `../react-secure-biometric-interface-integrator`
  implement the same MDS capture flow for two consumption styles. Keep
  capture/timeout/retry behavior consistent between the two when fixing
  bugs.

## Agent rules

### Do

1. Keep `example/html/index.html` and `example/react/` working when you
   change the public API — they are the primary integration documentation.
2. Update every file under `assets/locales/` when adding a user-facing
   string.
3. Run `npm run build` before finishing a change here.

### Do not

1. Do not claim `npm test` exists or is run in CI for this module — it is
   not defined.
2. Do not diverge capture/timeout/retry behavior from
   `../react-secure-biometric-interface-integrator` without a documented
   reason.
3. Do not confuse `lib/` with generated output — `rollup.config.js` uses
   `lib/secureBiometricInterface.js` as its build **input** and writes to
   `dist/{iife,es,cjs}/index.js`; `lib/` is hand-maintained source, `dist/`
   is generated and gitignored.
