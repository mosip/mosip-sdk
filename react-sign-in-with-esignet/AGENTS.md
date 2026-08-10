# AGENTS.md — react-sign-in-with-esignet

Parent guide: [../AGENTS.md](../AGENTS.md)

## Repository Overview

`@mosip/react-sign-in-with-esignet` renders a React "Sign in with eSignet"
button that starts an OpenID Connect authorization flow against an eSignet
authorization server. Full prop documentation (`oidcConfig`, `buttonConfig`)
lives in this directory's `README.md` — read that before changing the
component's public API.

## Technology Stack

- React 18 + TypeScript (`.tsx`) under `src/lib/`.
- Bundler: Rollup (`rollup.config.ts`) producing `dist/cjs`, `dist/esm`, and
  `dist/index.d.ts`.
- Local dev/test harness: `react-scripts` (Create React App) —
  `npm test` delegates to `react-scripts test`.
- Storybook 7 (`.storybook/main.ts`), with a story at
  `src/stories/SignInWithEsignet.stories.tsx`.
- Styling: CSS module (`SignInWithEsignet.module.css`).

## Build & Test Commands

```bash
cd react-sign-in-with-esignet
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

No `.env` file exists in this directory and none is required to build or
test this module. All behavior (authorization endpoint, `client_id`,
`redirect_uri`, scopes, button theme/shape/label, etc.) is supplied by the
consuming application through the `oidcConfig` and `buttonConfig` props at
render time — see `README.md` for the full field tables. Do not add an
`.env` file to hardcode any of these; they are per-integration values, not
build-time configuration.

## Project Structure Notes

```text
react-sign-in-with-esignet/
├── src/
│   ├── index.ts
│   ├── stories/                              Storybook story
│   └── lib/
│       ├── SignInWithEsignet/                Component, props type, CSS module
│       ├── common/                            Shared types/constants
│       └── assets/esignet_logo.png
├── .storybook/
├── rollup.config.ts
└── package.json
```

## Development Workflow

1. `npm install` inside this directory.
2. Change the component under `src/lib/SignInWithEsignet/`; update
   `ISignInWithEsignetProps.ts` if you add or change a prop.
3. Update the Storybook story under `src/stories/` to exercise any new prop.
4. Run `npm test` and `npm run build` before committing.

## Pull Request Guidelines

- This module is **not** built by `.github/workflows/push-trigger.yml` on
  pull requests (that workflow only builds `sign-in-with-esignet`,
  `secure-biometric-interface-integrator`, `json-form-builder`, and
  `storybook-example` on PRs). It is only built and published on pushes to
  `develop`, `release*`, or `MOSIP*` via
  `.github/workflows/publish-npm.yaml`. Build and test locally before
  opening a PR.
- Update `README.md` in this directory if you add, rename, or remove a prop.

## Repository-Specific Considerations

- This module and its vanilla-JS sibling (`../sign-in-with-esignet`) expose
  the same `oidcConfig`/`buttonConfig` shape for two different consumption
  styles. Keep the two in sync when you change the OIDC flow or the button
  behavior/theming options.
- The published package ships `dist/` and `README.md`
  (`files: ["dist", "README.md"]` in `package.json`) — keep the README
  accurate since it is published alongside the code.

## Agent rules

### Do

1. Read and update the `oidcConfig`/`buttonConfig` prop tables in this
   directory's `README.md` whenever you change the component's public API.
2. Keep this module's behavior consistent with `../sign-in-with-esignet`
   unless a difference is intentional and documented.
3. Build and test locally (`npm test`, `npm run build`) before opening a PR
   — PR-time CI does not build this module.

### Do not

1. Do not assume PR-time CI validates this module's build; it does not.
2. Do not hardcode `client_id`, `redirect_uri`, or other integration-specific
   OIDC values into this library — they must come from the consumer via
   `oidcConfig`.
