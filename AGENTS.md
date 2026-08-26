# AGENTS.md

## Repository Overview

`mosip-sdk` is six independent, independently-versioned npm packages for the
MOSIP ecosystem — not a single app. No root `package.json`, no workspace
manager, no cross-module build/test command. Always `cd` into a module first.

| Module | Purpose | Guide |
|---|---|---|
| `json-form-builder` | TypeScript dynamic form builder driven by JSON config | [AGENTS.md](json-form-builder/AGENTS.md) |
| `react-secure-biometric-interface-integrator` | React SBI (Secure Biometric Interface) device integration | [AGENTS.md](react-secure-biometric-interface-integrator/AGENTS.md) |
| `secure-biometric-interface-integrator` | Vanilla-JS equivalent of the SBI integrator | [AGENTS.md](secure-biometric-interface-integrator/AGENTS.md) |
| `react-sign-in-with-esignet` | React "Sign in with eSignet" OIDC button | [AGENTS.md](react-sign-in-with-esignet/AGENTS.md) |
| `sign-in-with-esignet` | Vanilla-JS "Sign in with eSignet" OIDC button | [AGENTS.md](sign-in-with-esignet/AGENTS.md) |
| `storybook-example` | Storybook site aggregating stories from the other modules; demo only, not published to npm | [AGENTS.md](storybook-example/AGENTS.md) |

Each module has its own `package.json`/build tooling and (except
`storybook-example`) publishes to npm under `@mosip/*`.

## Technology Stack

- TypeScript/JSX: `json-form-builder`, `react-secure-biometric-interface-integrator`,
  `react-sign-in-with-esignet`, `sign-in-with-esignet`. Plain JS:
  `secure-biometric-interface-integrator`, `storybook-example`.
- React 18 in the `react-*` modules and `storybook-example`; the rest are
  framework-free vanilla JS/DOM.
- Bundler: Rollup everywhere; `react-*` modules also use `react-scripts` (CRA)
  for local dev/test.
- Tests: Jest (directly, or via `react-scripts test` in `react-*` modules) —
  except `secure-biometric-interface-integrator` and `storybook-example`,
  which have no test suite.
- Storybook 7/8 in every module. npm only (each module has its own
  `package-lock.json`, no root lockfile). License: `MPL-2.0`.

## Build & Test Commands

```bash
cd <module>
npm install
npm run build
npm test
```

Script lists differ per module (e.g. `secure-biometric-interface-integrator`
has no `test` script) — check the module's own `AGENTS.md`. Every publishable
module has a `verify` script that npm-publish CI calls.

## Configuration

- Module `.env*` files hold non-secret UI config only (e.g.
  `REACT_APP_DEFAULT_LANGUAGE`; `storybook-example`'s `BASE_PATH`/
  `PLUGINS_FOLDER`/`VERSION_BRANCH`). Never add secrets/tokens to a tracked
  `.env*` file — real secrets (`NPM_AUTH_TOKEN`, `SLACK_WEBHOOK`,
  `SONAR_TOKEN`, `ACTION_PAT`) live only in GitHub Actions repo secrets.
- `sonar-project.properties` configures the SonarCloud scan run by
  `.github/workflows/push-trigger.yml`.
- `.gitignore` excludes `node_modules`, `dist`, `build`, `coverage`, and
  `storybook-static` for every module.

## Project Structure Notes

```text
mosip-sdk/
├── .github/workflows/          CI: build, publish-to-npm, tagging
├── json-form-builder/
├── react-secure-biometric-interface-integrator/
├── secure-biometric-interface-integrator/
├── react-sign-in-with-esignet/
├── sign-in-with-esignet/
├── storybook-example/          published to GitHub Pages, not npm
├── sonar-project.properties
└── README.md
```

Flat by design — no shared `src/`/`common/`, and modules don't import from
one another at build time (`storybook-example` only consumes published/story
output for demos).

## Development Workflow

1. Branch from `develop` (`master` tracks releases).
2. Work inside one module at a time; `npm install` there before
   building/testing.
3. Run that module's `build` (and `test`, where present) before opening a PR.
4. Never hand-edit any `package-lock.json` — let `npm install`/`npm ci`
   regenerate it.

## Pull Request Guidelines

- Target `develop`. Sign off commits (`git commit -s`).
- PR-time CI (`push-trigger.yml`) only builds `sign-in-with-esignet`,
  `secure-biometric-interface-integrator`, `json-form-builder`, and
  `storybook-example` — **not** `react-secure-biometric-interface-integrator`
  or `react-sign-in-with-esignet` (those build/publish only on pushes to
  `release*`/`develop*`/`MOSIP*` via `publish-npm.yaml`). Build/test `react-*`
  modules locally before opening a PR. SonarCloud also only runs on push.
- Scope one module per PR — each has an independent version/release cycle.

## Repository-Specific Considerations

- `secure-biometric-interface-integrator`: `lib/` is hand-maintained source
  input, not shipped output — the published package ships only `dist/`
  (`iife`, `es`, `cjs`). `sign-in-with-esignet` also ships `dist/` plus
  `example/`/`examples/` integration demos. Both modules produce an IIFE
  bundle (`dist/iife/index.js`) for `<script>`-tag consumers.
- `storybook-example` is a demo app, not a library. `build:version:local`/
  `build:version:production` run `version_build.js`, which also `npm ci`/`i`'s
  every sibling plugin directory in `pluginsFolderList` — not side-effect-free.
  `npm run deploy` publishes to GitHub Pages via `gh-pages`. Don't run
  `deploy`/`publish` during routine local development.
- npm publishing is centralized via reusable `mosip/kattu` workflows
  (`npm-publish-to-npm-registry.yml`, `npm-build.yml`) — never `npm publish`
  manually.

## Agent rules

### Do

1. Work inside one module at a time; read its own `AGENTS.md` first.
2. Run that module's `build`/`test` before calling a change complete.
3. Keep `.env*` files secret-free.

### Do not

1. Add a root `package.json`, workspace config, or cross-module build script
   — the split is a deliberate structural decision, not an oversight.
2. Hand-edit any `package-lock.json`, or commit `node_modules`/`dist`/`build`/
   `coverage`/`storybook-static`.
3. Assume PR-time CI covers every module (see Pull Request Guidelines).
4. Run `npm publish` or trigger the publish workflow yourself.
