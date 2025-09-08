# Improvement Tasks Checklist

Date: 2025-08-20 20:33

Note: Items are grouped and ordered to move from foundational setup to architecture, quality, performance,
UX/accessibility, developer experience, and deployment/operations. Each item is actionable and tailored to this
repository.

1. [ ] Establish repository hygiene and conventions
    - [x] Add a comprehensive project README with usage, development, testing, and release information; link to WARP.md
      and guidelines.md
    - [x] Add a CONTRIBUTING.md with commit message conventions, branching strategy, PR process, and code review
      checklist
    - [x] Add CODE_OF_CONDUCT.md and SECURITY.md with responsible disclosure
    - [x] Ensure LICENSE header templates or repo-level license scanning (keep MIT license current)

2. [ ] Define Nx workspace governance
    - [x] Enable/enforce Nx dependency constraints (e.g., enforce that feature libs don’t depend on app; shared libs are
      dependency-safe) via eslint.base.config.ts enforce-module-boundaries
    - [x] Add and document tagging for libraries (e.g., type:feature, type:shared, domain:ui, domain:utils) and
      configure constraints
    - [ ] Generate and commit project graph docs (nx graph export) under docs/architecture/ for visibility

3. [ ] Strengthen TypeScript configuration and strictness
    - [x] Turn on strictest compiler options across tsconfig.\* (noImplicitAny, strictNullChecks, noUnusedLocals,
      noUnusedParameters, exactOptionalPropertyTypes)
    - [x] Remove skipLibCheck where feasible and fix offending types locally
    - [x] Audit any usage of any in models and services; replace with unknown or precise types where possible (keep
      Angular validators exceptions documented)

4. [ ] Align Angular 20 best practices (standalone + signals)
    - [x] Audit all components/directives/pipes to ensure standalone usage without standalone: true in decorators,
      following guidelines.md
    - [x] Ensure changeDetection: OnPush on all components
    - [x] Migrate any constructor DI to inject() function for consistency
    - [x] Replace legacy control flow (*ngIf/*ngFor) with new @if/@for where not already applied

5. [ ] Library boundaries and public APIs
    - [ ] Ensure each library’s public API is clean and documented via src/index.ts (only export intended symbols)
    - [ ] Add barrel file unit tests to prevent accidental breaking exports (snapshot tests for exported API)
    - [ ] Verify path aliases in tsconfig.base.json align with public APIs; avoid deep imports

6. [ ] Models and validation (valibot)
    - [ ] Co-locate schema and types for all domain models in libs/models; ensure consistency similar to form.model.ts
      and passwordGenerator.model.ts
    - [ ] Add parse/validate helpers to models (e.g., safeParse wrappers) and test coverage for happy/edge cases
    - [ ] Review GenerationProperties length bounds (1–1000): assess performance/UX implications; potentially cap to 256
      with rationale

7. [ ] Utils quality and correctness
    - [x] Add unit tests for utils/lib/utils/lodash.utils.ts (sample/random/range), including boundary conditions and
      randomness distribution sanity checks
    - [ ] Consider seeding strategy or wrapper to make randomness testable/deterministic in CI
    - [ ] Document copy-to-clipboard utilities and directives with usage examples and accessibility notes

8. [ ] ReactiveStorageService hardening
    - [ ] Add initialization guard patterns in consumers (e.g., ensure configure() is called in providers or component
      init) to avoid runtime errors
    - [ ] Add tests covering configure(), suffix behavior, JSON parse failures, and storage quota errors
    - [x] Add try/catch for localStorage access in non-browser or private mode scenarios; provide graceful fallback (
      in-memory)
    - [ ] Ensure providedIn strategy is intentional (currently 'any'); document rationale and evaluate 'root' vs
      component-level providers

9. [ ] Password generator feature improvements
    - [ ] Add property-based/unit tests for PasswordGeneratorService (distribution, length, inclusion of at least one
      selected type if desired)
    - [ ] Optionally enforce at least one char of each selected type; make this a toggle in GenerationProperties and
      document behavior
    - [x] Optimize createSymbolString() to precompute symbols once (memoize) and avoid recreating on each call
    - [ ] Review performance for very large lengths; stream generation or chunking if necessary

10. [ ] UI/UX and accessibility (PrimeNG + Tailwind)
    - [ ] Audit interactive elements for accessible names, roles, and keyboard support (e.g., buttons in
      generator-password-overview)
    - [x] Provide i18n strategy: extract hard-coded German strings to a constants or i18n library; consider Angular i18n
      or lightweight solution
    - [ ] Establish a design tokens layer (Tailwind config + Prime theme alignment) and document usage
    - [ ] Use NgOptimizedImage for static images across ui/home libs (if applicable)

11. [ ] Routing and navigation
    - [x] Add route-level preloading/standby strategies if beneficial; verify titles and SEO metadata per route
    - [x] Validate deep-linking and 404 handling; add a not-found component in tools routes
    - [ ] Ensure lazy-loaded routes do not pull unnecessary shared code (review bundle splits)

12. [ ] Performance and change detection
    - [ ] Verify provideZonelessChangeDetection + signal patterns do not lead to missed updates; add example patterns to
      guidelines
    - [x] Add runtime performance metrics (web-vitals) and log to console in dev, Vercel analytics in prod is already
      configured
    - [ ] Evaluate hydration/SSR readiness with Analog if SSR is desired; create spike tasks

13. [ ] Testing strategy consolidation
    - [ ] Unify on Vitest or Jest across all libs (WARP.md says Vitest; package.json also contains Jest). Remove unused
      runner and configs to reduce drift
    - [ ] Add test-setup.ts per lib where missing; configure jsdom once
    - [ ] Establish minimal coverage thresholds (e.g., statements/branches/functions/lines) and enforce in CI
    - [ ] Add component tests for critical UI (tools grid, password generator form/overview)

14. [ ] Linting and formatting
    - [ ] Ensure a single ESLint config source of truth (eslint.base.config.ts + eslint.config.ts) and enable Angular
      ESLint rules
    - [ ] Add stricter rules: no-floating-promises, exhaustive-deps equivalents, rxjs/no-ignored-subscription (if using
      observables)
    - [ ] Add pre-commit hooks (lint-staged + husky) to run lint and formatting

15. [ ] CI/CD setup
    - [ ] Add GitHub Actions (or Vercel/other) workflows: install, lint, test (with coverage), build, cache pnpm and Nx
    - [ ] Add Nx affected commands to speed up CI (nx affected -t lint,test,build)
    - [ ] Upload coverage reports as artifacts and enforce thresholds

16. [x] PWA and service worker
    - [x] Review ngsw-config.json for asset groups and data groups; ensure versioning and cache busting are correct
    - [x] Add a runtime SW status indicator and update flow (prompt user to refresh on new version)
    - [x] Ensure offline fallbacks exist for tools (basic UX messaging)

17. [ ] Security and dependency management
    - [ ] Enable automated dependency updates (Renovate or Dependabot) with grouping rules for Angular/Nx
    - [ ] Audit dependencies (npm audit, OSV) and keep pnpm overrides up-to-date (currently on-headers, koa, tmp)
    - [ ] Add CSP recommendations and security headers guidance for deployment target

18. [x] Observability and error handling
    - [x] Add a centralized error boundary strategy and global error handler; route to a friendly error UI
    - [x] Integrate lightweight logging with levels (debug/info/warn/error) toggled by environment
    - [x] Integrate Vercel Logs: client warn/error forwarding to /api/log serverless endpoint (captured in Vercel logs)

19. [ ] Documentation improvements
    - [ ] Expand WARP.md with step-by-step common tasks and troubleshooting
    - [ ] Generate typed API docs for shared libs (models, utils, ui) using TypeDoc and publish to docs/site or GitHub
      Pages
    - [ ] Keep guidelines.md aligned with actual lints and examples; add examples for directives, pipes, and service
      patterns

20. [ ] Release management
    - [ ] Define versioning and changelog generation (Conventional Commits + Changesets or standard-version)
    - [ ] Add release workflow (tag, build artifacts, deploy)
    - [ ] If publishing any libs, add buildable/publishable configuration and npm metadata

21. [ ] Backlog triage and grooming
    - [ ] Create GitHub issues for each task in this checklist and label by area (architecture, testing, performance,
      a11y)
    - [ ] Set milestones and priorities; track progress by checking off items here
