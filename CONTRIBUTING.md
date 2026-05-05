# Contributing to Dualmark

Thanks for your interest in contributing.

## Development setup

Requirements: Node 18+, bun 1.3+.

```bash
bun install
bun run build
bun run test
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
2. Make changes. Add tests. Run `bun run test` and `bun run typecheck`.
3. Add a changeset: `bun run changeset`. Pick affected packages and bump type.
4. Open a PR. CI must pass.

## Conventions

- TypeScript strict mode.
- No `as any`, no `@ts-ignore`, no `@ts-expect-error` without an inline reason.
- Prefer existing code style. Run `bun run format` (Prettier) before committing.
- Tests live next to source as `*.test.ts`.

## Release flow (maintainers)

Releases are split into two explicit steps so a stray commit on `main` can never publish to npm.

### Step 1 — Version PR (automatic)

When changesets land on `main`, the **`Version (PR bot)`** workflow opens or updates a PR titled `chore: version packages`. The PR contains:

- `package.json` version bumps for all affected `@dualmark/*` packages
- Generated `CHANGELOG.md` entries
- Removal of consumed `.changeset/*.md` files

Review and merge that PR when you're ready to cut a release.

### Step 2 — GitHub Release (manual gate)

After the version PR merges:

1. Go to **GitHub → Releases → Draft a new release**.
2. Click **Choose a tag** and create a new tag matching the version, e.g. `v0.2.0`.
3. Set release title and notes (the changelog entry is a good source).
4. Click **Publish release**.

Publishing the release fires the **`Release (npm publish)`** workflow which:

- Checks out the exact tag
- Builds + tests + typechecks all `@dualmark/*` packages
- Verifies at least one package version matches the tag
- Runs `bun run changeset publish` with `NPM_CONFIG_PROVENANCE=true`

If anything fails, the release is on GitHub but nothing is on npm — fix and re-run the workflow via **Actions → Release → Run workflow** with the tag as input.

### Why two workflows

`changesets/action@v1` can do both versioning and publishing in one step, but that means *every* push to `main` with a pending changeset can publish. Splitting them puts the publish behind an explicit human action (drafting a release in the UI), and keeps the version PR loop convenient for contributors.

## Code of Conduct

Be excellent to each other. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

## License

By contributing, you agree your work is licensed under the MIT License.
