# AGENTS.md — storybook-example

Parent guide: [../AGENTS.md](../AGENTS.md)

## Repository Overview

`storybook-example` is a Storybook site that demonstrates the other five
plugins in this repo (`json-form-builder`, `react-secure-biometric-interface-integrator`,
`secure-biometric-interface-integrator`, `react-sign-in-with-esignet`,
`sign-in-with-esignet`) as interactive stories. It is not published to npm —
its `build`/`deploy` scripts publish a static Storybook site to GitHub Pages
instead (`homepage` in `package.json` points at
`http://mosip.github.io/mosip-plugins`).

## Technology Stack

- Storybook 7 (React + Webpack5 builder), configured in `.storybook/`
  (`main.ts`, `manager.ts`, `preview.ts`, `refs.ts`).
- Stories under `stories/*.stories.tsx`, one per plugin, each wrapping a
  thin demo component from `src/*.jsx` (`ReactSbi.jsx`,
  `ReactSignInWithEsignet.jsx`, `SecureBiometricInterfaceIntegrator.jsx`,
  `SignInWithEsignet.jsx`).
- TypeScript + Babel presets (`@babel/preset-env`, `@babel/preset-react`,
  `@babel/preset-typescript`) for story files; React 18 runtime deps.
- `dotenv` + a custom `version_build.js` script drive per-environment setup
  (see Configuration below) — this is not a typical Create React App or
  Rollup module like its sibling plugins.
- Deploy tooling: `gh-pages` (publishes `storybook-static/` to the `gh-pages`
  branch).

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

`npm test` is a placeholder (`echo "Error: no test specified" && exit 1`) —
there is no automated test suite for this module; do not add a test step to
CI expecting it to pass.

## Configuration

- `.env`, `.env.local`, `.env.production` set `BASE_PATH`,
  `PLUGINS_FOLDER` (a comma-separated list of sibling plugin directory
  names), `VERSION_BRANCH`, and `REACT_APP_DEFAULT_LANGUAGE`. None of these
  contain secrets — do not add any.
- `version_build.js` reads the profile named by the `PROFILE` env var,
  parses `PLUGINS_FOLDER` from it, and for each listed sibling directory
  runs `cd ../<plugin> && (npm ci || npm i)` — so `build:version:local` /
  `build:version:production` actually install dependencies in the sibling
  plugin folders as a side effect, not just in this one. Run it from inside
  `storybook-example/` (relative `../<plugin>` paths assume that cwd).

## Project Structure Notes

```text
storybook-example/
├── .storybook/          Storybook config (main.ts, manager.ts, preview.ts, refs.ts)
├── src/                 Thin demo wrapper components, one per plugin
├── stories/             *.stories.tsx, one per plugin, importing from src/
├── .env, .env.local, .env.production
├── version_build.js     Reads PROFILE env, installs deps in sibling plugin folders
└── package.json
```

## Development Workflow

1. `npm install` inside this directory.
2. To add a story for a new or changed plugin: add/update the matching
   `src/<Plugin>.jsx` wrapper and `stories/<Plugin>.stories.tsx`.
3. Run `npm start` to preview stories locally at `http://localhost:6006`.
4. There is no lint/test gate for this module — visually verify the story
   renders correctly before committing.

## Pull Request Guidelines

- CI (`.github/workflows/push-trigger.yml`) builds this module on pull
  requests (`build-storybook-example` job via the reusable `mosip/kattu`
  `npm-build.yml` workflow) — a broken `npm run build` fails PR checks.
- This module is not published to npm; do not add npm-publish steps or
  expect a `publish-npm.yaml` job to run against it.

## Repository-Specific Considerations

- `homepage` in `package.json` still points at the legacy
  `mosip/mosip-plugins` repo/GitHub Pages URL, not `mosip-sdk` — this is
  pre-existing repo metadata, not something to "fix" as part of unrelated
  changes; flag it if you're specifically working on deploy/publishing.
- `PLUGINS_FOLDER` in the `.env*` files must stay in sync with the actual
  sibling plugin directory names in this repo — if a plugin is renamed,
  update it here too, or `version_build.js`'s `npm ci`/`npm i` step will
  fail against a nonexistent path.
- `npm run deploy` pushes directly to the `gh-pages` branch — treat it as a
  publish action, not a routine build step, and don't run it as a side
  effect of unrelated local testing.

## Agent rules

### Do

1. Keep each story's `src/*.jsx` wrapper thin — it should only demonstrate
   the sibling plugin's public API, not reimplement plugin logic here.
2. Update `PLUGINS_FOLDER` in every `.env*` file together if a sibling
   plugin directory is renamed or added.
3. Run `npm run build` locally before committing a story change, since PR
   CI depends on it succeeding.

### Do not

1. Do not add a real test suite without also updating the `test` script
   and this file — the current placeholder is intentional, not an
   oversight to silently fix.
2. Do not run `npm run deploy` (or `npm run publish`, which builds +
   deploys) as part of routine local development — it publishes to GitHub
   Pages.
3. Do not assume `npm run build:version:local`/`:production` only affects
   this module — they also install dependencies in sibling plugin
   directories via `version_build.js`.
