# AGENTS.md — storybook-example

Parent guide: [../AGENTS.md](../AGENTS.md)

## Repository Overview

Storybook site demonstrating the other five plugins in this repo as
interactive stories. Not published to npm — `build`/`deploy` publish a
static Storybook site to GitHub Pages instead (`homepage` in `package.json`
still points at the legacy `mosip/mosip-plugins` URL — pre-existing
metadata, not something to "fix" incidentally; flag it only if you're
specifically working on deploy/publishing).

## Technology Stack

- Storybook 7 (React + Webpack5), config in `.storybook/`.
- One story per plugin under `stories/*.stories.tsx`, each wrapping a thin
  demo component in `src/*.jsx`.
- TypeScript + Babel presets for story files; React 18.
- `dotenv` + a custom `version_build.js` drive per-environment setup (see
  Configuration) — unlike its Rollup/CRA sibling plugins.
- `gh-pages` deploys `storybook-static/` to the `gh-pages` branch.

## Build & Test Commands

```bash
cd storybook-example
npm install
npm start                        # storybook dev -p 6006
npm run build                    # storybook build -> storybook-static/
npm run build:version:local      # env PROFILE=.env.local node version_build.js
npm run build:version:production # env PROFILE=.env.production node version_build.js
npm run deploy                   # gh-pages -d storybook-static
```

`npm test` is an intentional placeholder (exits with an error) — there's no
automated test suite; don't "fix" it or expect it to pass in CI.

## Configuration

- `.env`/`.env.local`/`.env.production` set `BASE_PATH`, `PLUGINS_FOLDER`
  (comma-separated sibling plugin dir names — keep in sync if a plugin is
  renamed/added, or the step below fails against a nonexistent path),
  `VERSION_BRANCH`, `REACT_APP_DEFAULT_LANGUAGE`. No secrets here.
- `build:version:local`/`:production` run `version_build.js`, which reads
  `PROFILE`'s `PLUGINS_FOLDER` and, for each listed sibling, runs `cd
  ../<plugin> && (npm ci || npm i)` — **not side-effect-free**, it installs
  deps in sibling plugin directories. Run from inside `storybook-example/`
  (relative `../<plugin>` paths assume that cwd).
- `npm run deploy` (and `publish`, which builds+deploys) push straight to
  `gh-pages` — treat as a publish action, never a routine local step.

## Project Structure Notes

```text
storybook-example/
├── .storybook/          Storybook config
├── src/                 Thin demo wrapper components, one per plugin
├── stories/             *.stories.tsx, one per plugin, importing from src/
├── .env, .env.local, .env.production
└── version_build.js     Reads PROFILE env, installs deps in sibling plugin folders
```

## Pull Request Guidelines

- CI builds this module on PRs (`push-trigger.yml` → `build-storybook-example`,
  reusable `mosip/kattu` `npm-build.yml`) — a broken `build` fails PR checks.
  Not published to npm; no `publish-npm.yaml` job runs against it.

## Agent rules

### Do

1. Keep each `src/*.jsx` wrapper thin — demonstrate the plugin's public API,
   don't reimplement its logic here.
2. Run `npm run build` locally before committing a story change (PR CI
   depends on it).

### Do not

1. Add a real test suite without also updating `package.json`'s `test`
   script and this file — the current placeholder is intentional.
2. Run `npm run deploy`/`publish` as part of routine local development.
3. Assume `build:version:local`/`:production` only affect this module — see
   Configuration.
