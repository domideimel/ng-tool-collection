# NgToolCollection

An Nx-powered Angular 20 monorepo featuring a collection of tools (Password Generator, Currency Converter, URL Rewrites)
built with modern Angular patterns: standalone APIs, signals, new control flow, zoneless change detection, PrimeNG UI,
Tailwind, and Vite.

## Getting Started

- Prerequisites: pnpm 9+, Node 20+
- Install deps: `pnpm install`
- Start dev server: `pnpm start` (or `nx serve`)
- Build: `pnpm build` (or `nx build`)
- Test: `pnpm test` (or `nx test`)

For daily development commands and repo architecture, see WARP.md.

## Project Structure

This is an Nx monorepo. Key areas:

- App entry/config: `src/app/app.config.ts`, routing in `src/app/app.routes.ts`
- Feature libraries under `libs/`:
    - tools (routing layout), password-generator, currency-converter, url-rewrites
    - ui (shared UI components), models, utils, constants, home

More details are documented in WARP.md.

## Modern Angular Conventions

We adopt Angular v20+ best practices:

- Standalone components/directives/pipes (no NgModules)
- Signals for state management and derived state
- New template control flow (@if/@for/@switch)
- OnPush change detection

See guidelines in guidelines.md for examples and coding style.

## Scripts

- `pnpm start` – run the app locally
- `pnpm build` – build production assets
- `pnpm test` – run unit tests
- `nx lint` – lint the workspace

## Contributing

We welcome contributions! Please read CONTRIBUTING.md for commit conventions, branching strategy, and the PR process. By
participating, you agree to abide by the CODE_OF_CONDUCT.md.

## Security

If you discover a security issue, please follow the instructions in SECURITY.md for responsible disclosure.

## License

MIT – see LICENSE.
