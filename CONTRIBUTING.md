# Contributing to Dualmark

Thanks for your interest in contributing.

## Development setup

Requirements: Node 18+, pnpm 9+.

```bash
pnpm install
pnpm build
pnpm test
```

## Project layout

```
dualmark/
├── packages/
│   ├── core/          @dualmark/core
│   ├── converters/    @dualmark/converters
│   ├── astro/         @dualmark/astro
│   ├── cloudflare/    @dualmark/cloudflare
│   └── cli/           @dualmark/cli
├── examples/
├── apps/
└── spec/
```

## Workflow

1. Fork and branch from `main`.
2. Make changes. Add tests. Run `pnpm test` and `pnpm typecheck`.
3. Add a changeset: `pnpm changeset`. Pick affected packages and bump type.
4. Open a PR. CI must pass.

## Conventions

- TypeScript strict mode.
- No `as any`, no `@ts-ignore`, no `@ts-expect-error` without an inline reason.
- Prefer existing code style. Run `pnpm format` (Prettier) before committing.
- Tests live next to source as `*.test.ts`.

## Code of Conduct

Be excellent to each other. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

## License

By contributing, you agree your work is licensed under the MIT License.
