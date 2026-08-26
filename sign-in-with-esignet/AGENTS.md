# AGENTS.md — sign-in-with-esignet

Parent guide: [../AGENTS.md](../AGENTS.md)

## Repository Overview

`@mosip/sign-in-with-esignet` is a framework-free `lit`-based web component
rendering a "Sign in with eSignet" button that starts an OIDC authorization
flow — the plain-JS counterpart to `../react-sign-in-with-esignet`. Prop
docs (`oidcConfig`, `buttonConfig`) are in this directory's `README.md`.

## Technology Stack

- TypeScript on `lit` (web components), under `src/lib/`.
- Rollup (`rollup.config.ts`) → `dist/cjs`, `dist/esm`, `dist/iife/index.js`
  (`bundle` field in `package.json`), `dist/index.d.ts`.
- Jest (`jest.config.ts`; test alongside source at
  `src/lib/SignInWithEsignet/SignInWithEsignet.test.ts`).
- Storybook 7 (`@storybook/web-components`).
- Examples: `examples/html-example/` (incl. alternate CSS themes),
  `examples/react-example/` — the latter has its own `package.json`/lockfile,
  install separately if you need to run it.

## Build & Test Commands

```bash
cd sign-in-with-esignet
npm install
npm run build       # rimraf dist && rollup -c
npm test            # jest --coverage
npm run storybook    # storybook dev -p 6006
npm run package      # npm run rollup && npm pack
```

`npm run verify` (CI publish workflow) aliases `build`.

## Configuration

No `.env` — everything (authorization endpoint, `client_id`, `redirect_uri`,
scopes, button theme/shape/label) is supplied by the consumer via
`oidcConfig`/`buttonConfig` at call time; see `README.md` and
`examples/html-example/index.html` / `examples/react-example/src/App.js`.

## Project Structure Notes

```text
sign-in-with-esignet/src/
├── index.ts
└── lib/SignInWithEsignet/     Component, props type, Jest test
```

Published package ships `dist/` + `README.md`. Also produces an IIFE bundle
(`dist/iife/index.js`, alongside `secure-biometric-interface-integrator`)
for `<script>`-tag consumers without a bundler.

## Pull Request Guidelines

- CI builds this module on PRs (`push-trigger.yml` →
  `build-sign-in-with-esignet`); a broken `build` fails PR checks. npm
  publish only runs on pushes to `develop`/`release*`/`MOSIP*`.

## Repository-Specific Considerations

- Shares its `oidcConfig`/`buttonConfig` shape with the React sibling
  `../react-sign-in-with-esignet`. Keep the two in sync when changing the
  OIDC flow or button theming.

## Agent rules

### Do

1. Update `README.md`'s prop tables and `SignInWithEsignet.test.ts`/
   `examples/` whenever the public API or behavior changes.
2. Keep behavior consistent with `../react-sign-in-with-esignet` unless a
   difference is intentional and documented.
3. Run `npm test`/`npm run build` before opening a PR — CI builds this
   module on PRs, so a broken build blocks the check.

### Do not

1. Hardcode `client_id`, `redirect_uri`, or other OIDC values — they must
   come from the consumer.
2. Remove the `iife` output format without checking
   `examples/html-example/index.html`, which depends on it.
3. Assume `examples/react-example/` shares this module's dependencies — it
   has its own `package.json`/lockfile.
