# Contributing Guide

Thank you for considering contributing to NgToolCollection!

## Development Workflow

- Install dependencies with pnpm: `pnpm install`
- Start the dev server: `pnpm start`
- Run tests: `pnpm test`
- Lint: `nx lint`

See WARP.md for common commands and repository architecture.

## Branching Strategy

- Main development branch: `main`
- Create feature branches from `main`: `feat/<short-description>`
- Use `fix/`, `chore/`, `docs/`, `refactor/`, `perf/`, `test/` prefixes where appropriate

## Commit Message Convention (Conventional Commits)

```
<type>(scope): <subject>

<body>

<footer>
```

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

Examples:

- `feat(password-generator): add option to include at least one of each selected type`
- `fix(utils): correct range end-exclusive bug`

## Pull Requests

- Keep PRs focused and small
- Include tests when fixing bugs or adding features (when applicable)
- Update documentation as needed (README, WARP.md, guidelines.md)
- Ensure CI passes (lint, test, build)

## Code Style and Practices

- Follow Angular v20+ best practices (see guidelines.md)
- Prefer standalone APIs, signals, and new control flow
- Use TypeScript strict typing; avoid `any` unless documented exceptions

## Reporting Issues

- Use descriptive titles
- Provide steps to reproduce, expected vs. actual behavior, and environment details

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
