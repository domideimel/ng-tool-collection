# AGENTS.md

Guidance for AI coding agents working in this **Nx 22 + Angular 21 monorepo** (PWA tool collection: password generator,
currency converter, URL rewrites, signal-form demo).

## Architecture

- **App shell**: `src/app/app.config.ts` (zoneless via `provideZonelessChangeDetection`, PrimeNG with custom rose
  Material preset, `GlobalErrorHandler` from `@ng-tool-collection/utils`, service worker enabled in prod). Routes in
  `src/app/app.routes.ts` redirect `/` → `/tools` and lazy-load `libs/tools`.
- **Tool routing hub**: `libs/tools/src/lib/lib.routes.ts` lazy-loads each feature lib by its public alias (
  `@ng-tool-collection/password-generator` etc.). To add a tool: create a feature lib, export the entry component from
  its `src/index.ts`, add a `loadComponent` route here, register a card in `libs/tools/src/lib/card-grid` and
  `libs/constants`.
- **Library layering** (enforced by `@nx/enforce-module-boundaries` in `eslint.base.config.ts`):
  - `type:feature` libs (tools, password-generator, currency-converter, url-rewrites, signal-form, home) may depend on
    `type:shared` and any `domain:*` lib.
  - `type:shared` (ui, ui-core, models, constants, utils) **may only depend on other `type:shared`**. Never import a
    feature lib from a shared lib.
- **Path aliases**: All cross-lib imports use `@ng-tool-collection/<name>` (see `tsconfig.base.json`). Never use deep
  relative paths between libs.
- **State**: Per-feature `signalStore` from `@ngrx/signals`, provided at the wrapper component (
  `providers: [PasswordStore]`), with `withStorageSync` from `@angular-architects/ngrx-toolkit` for localStorage
  persistence and `rxMethod` for async flows. See `libs/password-generator/src/lib/services/passwords.store.ts` as the
  canonical example.
- **Forms**: Tools render via the shared `FormComponent` (`libs/ui`) driven by a `FormModel` config object (
  `as const satisfies FormModel`) — see `generator-form.component.ts`. Validators live in `libs/ui/.../validators` (e.g.
  `atLeastOneCheckedValidator`).

## Coding conventions (enforced; differ from generic Angular)

- **Angular v20+ style only**: standalone components (do **not** set `standalone: true` — it's the default),
  `ChangeDetectionStrategy.OnPush` on every `@Component`, signals (`signal`, `computed`, `input()`, `output()`),
  `inject()` over constructor DI, native control flow `@if/@for/@switch` (no `*ngIf`/`*ngFor`).
- No `ngClass`/`ngStyle` (use `class.x`/`style.x` bindings). No `@HostBinding`/`@HostListener` (use the `host` object).
  No `signal.mutate` (use `update`/`set`).
- Component selector prefixes: app = `app-`, every library = `lib-` (see `project.json` `"prefix"`).
- Split files: logic in `.ts`, template in `.html`, styles in `.css` (Tailwind 4 + PrimeUI utilities). Inline templates
  only for trivial components.
- TypeScript is strict with `exactOptionalPropertyTypes`, `noUnusedLocals/Parameters`. Avoid `any`; prefer `unknown`. UI
  strings are German.
- See `guidelines.md` for the full style guide and a reference component snippet.

## Workflows

- Package manager is **pnpm** (locked via `onlyBuiltDependencies`); never run `npm install`.
- Common: `pnpm start` (dev server), `pnpm build` (runs `nx build` then `tools/scripts/compress.mjs` to gzip/brotli
  `dist/`), `pnpm test`, `nx lint`.
- Per-project: `nx test <lib>`, `nx build <lib>`, `nx lint <lib>`, `nx test --coverage`. List projects with
  `nx show projects`.
- **Tests**: Vitest + jsdom, colocated `*.spec.ts`, each testable lib has its own `vite.config.mts` and
  `src/test-setup.ts` (see `libs/password-generator/vite.config.mts`). Libraries without a `vite.config.mts` (e.g.
  `constants`, `models`, `tools`, `home`, `signal-form`) are intentionally not unit-tested — don't add tests there
  without also adding the vite config and a `test` target.
- **Generators**: `nx g @nx/angular:library <name>` for new libs (then add `tags: ["type:feature", "domain:tools"]` or
  shared equivalents in its `project.json`); `nx g @nx/angular:component <name> --project=<lib>`.
- Pre-commit: husky + `lint-staged` runs `prettier --write` and `eslint --fix` (`prettier-plugin-tailwindcss` reorders
  classes).
- Commits follow Conventional Commits (`feat(scope): ...`, `fix(scope): ...`); see `CONTRIBUTING.md`.

## Integration points

- **PrimeNG 21** is the UI kit (import individual components: `Button`, `InputText`, `InputGroup`, …). Toasts go through
  `MessageService` injected into stores (see `passwords.store.ts`).
- **Valibot** for runtime validation, **validator** lib for primitives, **rxjs** still used inside `rxMethod` pipelines.
- PWA assets configured in `ngsw-config.json`; production build registers the SW automatically via `app.config.ts`.

When unsure, mirror patterns from `libs/password-generator` — it exercises every convention above (signal store, storage
sync, FormModel, lazy route, lib prefix, OnPush wrapper with provided store).
