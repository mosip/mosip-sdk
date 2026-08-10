# AGENTS.md

## Repository Overview

`mosip-sdk` is a collection of independent front-end plugins and utilities for
the MOSIP (Modular Open Source Identity Platform) ecosystem. It is not a
single application — it is six separate, independently-versioned and
independently-published npm packages living side by side in one repo:

| Module | Purpose | Guide |
|---|---|---|
| `json-form-builder` | TypeScript dynamic form builder driven by JSON config | [json-form-builder/AGENTS.md](json-form-builder/AGENTS.md) |
| `react-secure-biometric-interface-integrator` | React component for integrating Secure Biometric Interface (SBI) devices | [react-secure-biometric-interface-integrator/AGENTS.md](react-secure-biometric-interface-integrator/AGENTS.md) |
| `secure-biometric-interface-integrator` | Vanilla JS (framework-free) equivalent of the SBI integrator | [secure-biometric-interface-integrator/AGENTS.md](secure-biometric-interface-integrator/AGENTS.md) |
| `react-sign-in-with-esignet` | React "Sign in with eSignet" OIDC button component | [react-sign-in-with-esignet/AGENTS.md](react-sign-in-with-esignet/AGENTS.md) |
| `sign-in-with-esignet` | Vanilla JS "Sign in with eSignet" OIDC button component | [sign-in-with-esignet/AGENTS.md](sign-in-with-esignet/AGENTS.md) |
| `storybook-example` | Storybook site that aggregates stories from the other plugins for demo/publishing | [storybook-example/AGENTS.md](storybook-example/AGENTS.md) |

Each module has its own `package.json`, its own build tooling, and (except
`storybook-example`) is published to npm under the `@mosip/*` scope. There is
no root `package.json`, no workspace manager (no npm/yarn/pnpm workspaces,
no Lerna/Nx), and no single command that builds or tests everything at once
— each module is built and tested from inside its own directory.

## Technology Stack

- Language: TypeScript (`json-form-builder`, `react-sign-in-with-esignet`,
  `sign-in-with-esignet`) and plain JavaScript
  (`secure-biometric-interface-integrator`,
  `react-secure-biometric-interface-integrator` mixes JS/TS,
  `storybook-example`).
- UI framework: React 18 for the `react-*` modules and `storybook-example`;
  the non-`react-*` modules are framework-free (vanilla JS/DOM).
- Bundler: Rollup, in every publishable module (`rollup.config.js`/`.ts`/`.mjs`).
  `react-secure-biometric-interface-integrator` and
  `react-sign-in-with-esignet` additionally use `react-scripts` (Create React
  App) for local dev/test.
- Test runner: Jest directly in `json-form-builder` and
  `sign-in-with-esignet`; Jest via `react-scripts test` in
  `react-secure-biometric-interface-integrator` and
  `react-sign-in-with-esignet`. `secure-biometric-interface-integrator` and
  `storybook-example` have no automated test suite (see each module's guide).
- Component explorer: Storybook 7/8, present in every module.
- Package manager: npm (each module ships its own `package-lock.json`; there
  is no root lockfile).
- License headers: all publishable modules declare `MPL-2.0` in
  `package.json`; the repository root `LICENSE` file is MPL 2.0.

## Build & Test Commands

There is no root build/test command. `cd` into the module you are changing
and run its npm scripts, for example:

```bash
cd json-form-builder
npm install
npm run build
npm test
```

Every publishable module exposes a `verify` script that npm-publish CI calls
(`npm run verify`, which in every module currently just runs the build). See
each module's `AGENTS.md` for its exact script list — they are not identical
across modules (for instance, `secure-biometric-interface-integrator` has no
`test` script at all).

## Configuration

- Module-level `.env` files hold non-secret UI configuration only (for
  example `react-secure-biometric-interface-integrator/.env` sets
  `REACT_APP_DEFAULT_LANGUAGE`, and `storybook-example/.env*` set
  `BASE_PATH`, `PLUGINS_FOLDER`, `VERSION_BRANCH`,
  `REACT_APP_DEFAULT_LANGUAGE`). None of the `.env*` files checked into this
  repo contain secrets or tokens — do not add any (API keys, npm auth
  tokens, Slack webhooks, etc.) to a tracked `.env*` file. Real secrets for
  this repo (`NPM_AUTH_TOKEN`, `SLACK_WEBHOOK`, `SONAR_TOKEN`, `ACTION_PAT`)
  live only in GitHub Actions repository secrets, referenced from
  `.github/workflows/*.yaml`/`.yml`.
- `sonar-project.properties` at the repo root configures the SonarCloud scan
  used by `.github/workflows/push-trigger.yml`.
- `.gitignore` at the root excludes `node_modules`, `dist`, `build`,
  `coverage`, and `storybook-static` for every module — do not commit build
  output or dependency trees.

## Project Structure Notes

```text
mosip-sdk/
├── .github/workflows/          CI: build, publish-to-npm, tagging
├── json-form-builder/          TS form builder (npm package)
├── react-secure-biometric-interface-integrator/   React SBI integrator (npm package)
├── secure-biometric-interface-integrator/         Vanilla JS SBI integrator (npm package)
├── react-sign-in-with-esignet/ React eSignet sign-in button (npm package)
├── sign-in-with-esignet/       Vanilla JS eSignet sign-in button (npm package)
├── storybook-example/          Combined Storybook site (published to GitHub Pages)
├── sonar-project.properties
└── README.md
```

The repo is flat by design — there is no shared `src/` or `common/`
directory, and the modules do not import from one another at build time
(`storybook-example` only consumes the others' published/story output for
demo purposes). Treat each module directory as its own project when reading
or editing code.

## Development Workflow

1. Fork the repo and clone your fork.
2. Create a feature branch from `develop` (the active integration branch;
   `master` tracks releases).
3. Work inside a single module directory at a time; run `npm install` inside
   that module before building or testing it.
4. Run that module's `build` (and `test`, where one exists) before opening a
   PR — see the module's own `AGENTS.md` for its exact commands.
5. Do not edit `package-lock.json` by hand; let `npm install`/`npm ci`
   regenerate it.

## Pull Request Guidelines

- Target the `develop` branch.
- CI (`.github/workflows/push-trigger.yml`) runs an npm build on pull
  requests for `sign-in-with-esignet`, `secure-biometric-interface-integrator`,
  `json-form-builder`, and `storybook-example`. It does **not** build
  `react-secure-biometric-interface-integrator` or
  `react-sign-in-with-esignet` on pull requests — those two are only built
  and published on pushes to `release*`/`develop*`/`MOSIP*` branches via
  `.github/workflows/publish-npm.yaml`. If you change a `react-*` module,
  build and test it locally before opening the PR, since CI will not catch
  build breakage for you at PR time.
- SonarCloud analysis (`sonarcloud` job) only runs on pushes, not on pull
  requests.
- Keep changes scoped to one module per PR where practical, since each
  module has an independent version and release/publish cycle.
- Follow the commit sign-off convention used in this repo's history
  (`git commit -s`); recent commits include `Signed-off-by:` trailers.

## Repository-Specific Considerations

- Package versions are independent per module (see the `version` field in
  each `package.json`); bumping one module's version does not affect the
  others.
- `secure-biometric-interface-integrator` and `sign-in-with-esignet` ship
  pre-built output under `lib/`/`dist` conventions and vendor their own
  `example/`/`examples/` folders demonstrating integration in plain HTML and
  React — update these examples if you change the public API.
- `storybook-example` is a consumer/demo app, not a library: its `build`
  script (`build:version:production` / `build:version:local`) runs
  `version_build.js` against the `PROFILE` env file before invoking
  `storybook build`, and `npm run deploy` publishes the result to GitHub
  Pages via `gh-pages`. It has no meaningful `test` script (`npm test` is a
  placeholder that exits with an error by design).
- Publishing to the npm registry is automated centrally through the reusable
  `mosip/kattu` workflows (`npm-publish-to-npm-registry.yml`,
  `npm-build.yml`) — do not attempt to `npm publish` a module manually from
  a local machine as part of routine changes.

## Agent rules

### Do

1. Work inside one module directory at a time and use that module's own
   `package.json` scripts — do not assume a script exists in another module
   just because it exists here.
2. Read a module's own `AGENTS.md` (linked in the table above) before
   editing files inside it.
3. Run the relevant module's `build` (and `test`, if present) before
   proposing a change as complete.
4. Keep secrets and tokens out of every `.env*` file; only add non-secret UI
   configuration there, consistent with the existing files.
5. Preserve each module's independent `version` in `package.json` unless the
   task is specifically a release/version bump.

### Do not

1. Do not add a root-level `package.json`, workspace config, or a
   cross-module build script — the repo is intentionally un-unified; that is
   a structural decision, not an oversight.
2. Do not commit `node_modules/`, `dist/`, `build/`, `coverage/`, or
   `storybook-static/` — they are already `.gitignore`d.
3. Do not assume PR-time CI validates every module; it does not build
   `react-secure-biometric-interface-integrator` or
   `react-sign-in-with-esignet` on pull requests (see Pull Request
   Guidelines above).
4. Do not hand-edit any module's `package-lock.json`.
5. Do not run `npm publish` or trigger the publish workflow yourself —
   publishing is handled by the CI workflows against repository secrets.
