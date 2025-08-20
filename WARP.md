# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Commands

- **Start development server**: `pnpm start` or `nx serve`
- **Build for production**: `pnpm build` or `nx build`
- **Run tests**: `pnpm test` or `nx test`
- **Lint code**: `nx lint`
- **Format code**: `npx prettier --write .`

### Nx-specific Commands

- **Run single project tests**: `nx test <project-name>` (e.g., `nx test password-generator`)
- **Build specific library**: `nx build <project-name>`
- **Lint specific project**: `nx lint <project-name>`
- **Show project graph**: `nx show project <project-name>`
- **List all projects**: `nx show projects`
- **Run tests with coverage**: `nx test --coverage`
- **Run tests in CI mode**: `nx test:ci`

### Package Management

This project uses **pnpm** as the package manager. Always use `pnpm install` instead of `npm install`.

## Architecture Overview

### Project Structure

This is an **Nx monorepo** with an Angular application and multiple feature libraries:

**Main Application**: `ng-tool-collection`

- Entry point: `src/main.ts`
- App configuration: `src/app/app.config.ts`
- Routing: `src/app/app.routes.ts`

**Feature Libraries** (`libs/`):

- **tools**: Main routing and layout for all tools
- **password-generator**: Password generation tool
- **currency-converter**: Currency conversion tool
- **url-rewrites**: URL redirection generator
- **ui**: Shared UI components (form, card, navbar, validators)
- **home**: Website/landing page component
- **constants**: Navigation constants and shared data
- **models**: TypeScript interfaces and enums
- **utils**: Shared utility functions

### Technology Stack

- **Framework**: Angular 20 (with zoneless change detection)
- **Build Tool**: Vite with @analogjs/vite-plugin-angular
- **UI Library**: PrimeNG with Material theme
- **State Management**: @ngrx/signals
- **Styling**: TailwindCSS + PrimeUI
- **Testing**: Vitest
- **Linting**: ESLint with TypeScript and Angular rules
- **Validation**: Valibot
- **PWA**: Angular Service Worker enabled in production

### Route Structure

The application uses lazy-loaded routes:

- Root (`/`) → Redirects to `/tools`
- `/tools` → Loads tools module with:
    - `/tools` → Card grid of available tools
    - `/tools/password-generator` → Password generator tool
    - `/tools/currency-converter` → Currency converter tool
    - `/tools/url-rewrites` → URL redirection tool

### Key Architectural Patterns

1. **Nx Library Architecture**: Each feature is a separate library with its own tests and configuration
2. **Lazy Loading**: All tool components are lazy-loaded via Angular routing
3. **Standalone Components**: Uses Angular's standalone API throughout
4. **Shared Libraries**: Common functionality split into focused libraries (ui, models, constants, utils)
5. **Monorepo Dependencies**: Libraries depend on each other through TypeScript path mapping

### Configuration Files

- **Nx**: `nx.json`, `project.json` for each library
- **Build**: `vite.config.mts` (Vite configuration)
- **Linting**: `eslint.config.ts`, `eslint.base.config.ts`
- **Formatting**: `prettier.config.mjs`
- **TypeScript**: `tsconfig.*.json` files for different contexts
- **PWA**: `ngsw-config.json` for service worker configuration

### Testing Strategy

- **Test Runner**: Vitest with jsdom environment
- **Location**: Tests are colocated with source files (`*.spec.ts`)
- **Setup**: Each testable library has its own `test-setup.ts`
- **Coverage**: V8 provider with reports in `./coverage/`

### Development Workflow

1. Use `nx serve` to start development server
2. Create new features as Nx libraries: `nx g @nx/angular:library <name>`
3. Generate components: `nx g @nx/angular:component <name> --project=<library>`
4. Run tests for specific libraries: `nx test <library-name>`
5. Build production: `nx build` (includes service worker registration)

### Import Paths

Libraries use TypeScript path mapping with `@ng-tool-collection/` prefix:

- `@ng-tool-collection/tools`
- `@ng-tool-collection/password-generator`
- `@ng-tool-collection/ui`
- etc.
