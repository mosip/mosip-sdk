# AGENTS.md — react-sign-in-with-esignet

Parent guide: [../AGENTS.md](../AGENTS.md)

## Repository Overview

`@mosip/react-sign-in-with-esignet` renders a React "Sign in with eSignet"
button that starts an OIDC authorization flow. Full prop docs (`oidcConfig`,
`buttonConfig`) are in this directory's `README.md` — read before changing
the component's public API.

## Technology Stack

- React 18 + TypeScript (`.tsx`) under `src/lib/`.
- Rollup (`rollup.config.ts`) → `dist/cjs`, `dist/esm`, `dist/index.d.ts`.
- `react-scripts` (CRA) drives local dev/test.
- Storybook 7 (`src/stories/SignInWithEsignet.stories.tsx`).
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

`npm run verify` (CI publish workflow) aliases `build`.

## Configuration

No `.env` — everything (authorization endpoint, `client_id`, `redirect_uri`,
scopes, button theme/shape/label) is supplied by the consumer via the
`oidcConfig`/`buttonConfig` props at render time (see `README.md`'s field
tables). Do not hardcode any of these into the library.

## Project Structure Notes

```text
react-sign-in-with-esignet/src/
├── index.ts
├── stories/                    Storybook story
└── lib/
    ├── SignInWithEsignet/      Component, props type, CSS module
    ├── common/                  Shared types/constants
    └── assets/esignet_logo.png
```

Published package ships `dist/` + `README.md` (`files:
["dist", "README.md"]`) — keep the README accurate, it ships with the code.

## Pull Request Guidelines

- **Not** built by `push-trigger.yml` on PRs (that only builds
  `sign-in-with-esignet`, `secure-biometric-interface-integrator`,
  `json-form-builder`, `storybook-example`). Only built/published on pushes
  to `develop`/`release*`/`MOSIP*` via `publish-npm.yaml` — build/test
  locally before opening a PR.

## Repository-Specific Considerations

- Shares its `oidcConfig`/`buttonConfig` shape with the vanilla-JS sibling
  `../sign-in-with-esignet` (React vs. plain-JS consumption). Keep the two in
  sync when changing the OIDC flow or button theming.

## Agent rules

### Do

1. Update `README.md`'s `oidcConfig`/`buttonConfig` tables and the Storybook
   story under `src/stories/` whenever the public API changes.
2. Keep behavior consistent with `../sign-in-with-esignet` unless a
   difference is intentional and documented.
3. Run `npm test`/`npm run build` locally before opening a PR (PR-time CI
   doesn't build this module).

### Do not

1. Hardcode `client_id`, `redirect_uri`, or other OIDC values — they must
   come from the consumer via `oidcConfig`.
