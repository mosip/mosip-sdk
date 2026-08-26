# AGENTS.md — secure-biometric-interface-integrator

Parent guide: [../AGENTS.md](../AGENTS.md)

## Repository Overview

`@mosip/secure-biometric-interface-integrator` is a framework-free vanilla-JS
library for capturing Face/Finger/Iris biometrics from an SBI device — the
plain-JS counterpart to `../react-secure-biometric-interface-integrator`.
Hand-maintained source lives in `lib/` (`secureBiometricInterface.js`,
`standardConstant.js`, `sbd.css`); the published package ships only the
Rollup-bundled `dist/` (`files: ["dist", "README.md"]`). Examples under
`example/html/` and `example/react/`.

## Technology Stack

- Vanilla JS. `lib/secureBiometricInterface.js` is Rollup's (`rollup.config.js`)
  build **input**; output is `dist/{iife,es,cjs}/index.js` (gitignored,
  generated — don't confuse the two).
- No test runner/`test` script configured.
- Storybook 7 with the HTML renderer (`@storybook/html`).
- Runtime deps: `axios`, `crypto-js`, `i18next`, `jose`. Locale files under
  `assets/locales/` (`default`, `en`, `ar`, `hi`, `kn`, `ta`).

## Build & Test Commands

```bash
cd secure-biometric-interface-integrator
npm install
npm run build       # rollup -c
npm run start        # rollup -c -w (watch mode)
npm run storybook    # storybook dev -p 6006
npm run package      # rollup -c && npm pack
```

`npm run verify` (CI publish workflow) aliases `build`. If you add automated
tests, you must also add the `test` script and a runner — none exists today.

## Configuration

No env file required — runtime config (target environment, capture timeouts,
port range) is passed in by the consuming page/app at call time; see
`README.md` and `example/html/index.html` / `example/react/src/App.js`.

## Project Structure Notes

```text
secure-biometric-interface-integrator/
├── lib/                 Hand-maintained JS + CSS (Rollup build input)
├── utility/             DOM/element helpers, i18n, loading indicator
├── assets/              Images + locale JSON
├── example/{html,react}/  Integration references — keep working when the public API changes
└── stories/              Storybook stories
```

## Pull Request Guidelines

- CI builds this module on PRs (`push-trigger.yml` →
  `build-secure-biometric-interface-integrator`); a broken `build` fails PR
  checks. npm publish only runs on pushes to `develop`/`release*`/`MOSIP*`.

## Repository-Specific Considerations

- No automated tests — verify changes via Storybook or the `example/` apps.
- Shares its MDS capture flow with
  `../react-secure-biometric-interface-integrator`; keep capture/timeout/retry
  behavior consistent between the two.

## Agent rules

### Do

1. Keep `example/html/index.html` and `example/react/` working when the
   public API changes.
2. Update every file under `assets/locales/` when adding a user-facing string.
3. Run `npm run build` before finishing a change (no test suite exists).

### Do not

1. Claim `npm test` exists — it isn't defined for this module.
2. Diverge capture/timeout/retry behavior from
   `../react-secure-biometric-interface-integrator` without a documented reason.
