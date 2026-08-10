# AGENTS.md — sign-in-with-esignet

Parent guide: [../AGENTS.md](../AGENTS.md)

## Repository Overview

`@mosip/sign-in-with-esignet` is a framework-free (vanilla JavaScript /
`lit`-based) web component that renders a "Sign in with eSignet" button and
starts an OpenID Connect authorization flow — the plain-JS counterpart to
`../react-sign-in-with-esignet`. Full prop documentation (`oidcConfig`,
`buttonConfig`) lives in this directory's `README.md`.

## Technology Stack

- TypeScript, built on `lit` (web components), under `src/lib/`.
- Bundler: Rollup (`rollup.config.ts`) producing `dist/cjs`, `dist/esm`, and
  an IIFE bundle at `dist/iife/index.js` (see the `bundle` field in
  `package.json`), plus `dist/index.d.ts`.
- Test runner: Jest (`jest.config.ts`), with a test alongside the source at
  `src/lib/SignInWithEsignet/SignInWithEsignet.test.ts`.
- Storybook 7 with the web-components renderer
  (`@storybook/web-components`).
- Example integrations under `examples/html-example/` (including alternate
  CSS themes) and `examples/react-example/`.

## Build & Test Commands

```bash
cd sign-in-with-esignet
npm install
npm run build       # rimraf dist && rollup -c
npm test            # jest --coverage
npm run storybook    # storybook dev -p 6006
npm run package      # npm run rollup && npm pack
```

`npm run verify` (used by CI's publish workflow) is an alias for `npm run
build`.

## Configuration

No `.env` file exists in this directory and none is required to build or
test this module. All behavior (authorization endpoint, `client_id`,
`redirect_uri`, scopes, button theme/shape/label, etc.) is supplied by the
consuming page/app through the `oidcConfig`/`buttonConfig` object at call
time — see `README.md` and the working examples under
`examples/html-example/index.html` and `examples/react-example/src/App.js`.

## Project Structure Notes

```text
sign-in-with-esignet/
├── src/
│   ├── index.ts
│   └── lib/SignInWithEsignet/     Component, props type, Jest test
├── examples/
│   ├── html-example/               Plain HTML + alternate CSS themes
│   └── react-example/              React integration example (separate package.json)
├── .storybook/
├── rollup.config.ts
├── jest.config.ts
└── package.json
```

Note that `examples/react-example/` has its own `package.json` and
`package-lock.json`, independent of this module's — `npm install` inside
`examples/react-example/` separately if you need to run that example.

## Development Workflow

1. `npm install` inside this directory (not inside `examples/`, unless you
   are specifically working on the React example).
2. Change the component under `src/lib/SignInWithEsignet/`; update
   `ISignInWithEsignetProps.ts` if you add or change a prop.
3. Keep `SignInWithEsignet.test.ts` and the examples under `examples/`
   consistent with any prop or behavior change.
4. Run `npm test` and `npm run build` before committing.

## Pull Request Guidelines

- CI builds this module on pull requests via
  `.github/workflows/push-trigger.yml` (`build-sign-in-with-esignet` job). A
  broken `npm run build` will fail PR checks.
- Publishing to npm only happens on pushes to `develop`/`release*`/`MOSIP*`
  (`.github/workflows/publish-npm.yaml`), not on PRs.
- Update `README.md` in this directory if you add, rename, or remove a prop.

## Repository-Specific Considerations

- This module and `../react-sign-in-with-esignet` expose the same
  `oidcConfig`/`buttonConfig` shape for two consumption styles. Keep them in
  sync when changing the OIDC flow or button theming options.
- The published package ships `dist/` and `README.md`
  (`files: ["dist", "README.md"]` in `package.json`).
- This is the only module in the repo that also produces an IIFE bundle
  (`dist/iife/index.js`), for consumers who load the script directly via a
  `<script>` tag without a bundler (see `examples/html-example/index.html`).

## Agent rules

### Do

1. Read and update the `oidcConfig`/`buttonConfig` prop tables in this
   directory's `README.md` whenever you change the component's public API.
2. Keep this module's behavior consistent with
   `../react-sign-in-with-esignet` unless a difference is intentional and
   documented.
3. Run `npm test` and `npm run build` before opening a PR — CI does build
   this module on PRs, so a broken build blocks the check.

### Do not

1. Do not hardcode `client_id`, `redirect_uri`, or other integration-specific
   OIDC values into this library — they must come from the consumer.
2. Do not remove the `iife` output format from `rollup.config.ts` without
   checking `examples/html-example/index.html`, which depends on the
   `<script>`-tag-loadable bundle.
3. Do not assume `examples/react-example/` shares this module's
   dependencies — it has its own `package.json`/lockfile.
