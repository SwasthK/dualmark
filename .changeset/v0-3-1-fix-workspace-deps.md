---
"@dualmark/core": patch
"@dualmark/cli": patch
"@dualmark/cloudflare": patch
"@dualmark/astro": patch
"@dualmark/converters": patch
---

## v0.3.1 — Hotfix: workspace dep resolution + landing visual polish

Patch release fixing one critical packaging bug introduced upstream by `bun publish` and one set of landing-page visual inconsistencies. **Strongly recommended upgrade for anyone on 0.3.0** — fresh installs of 0.3.0 resolve mismatched workspace versions.

### Critical: workspace dep versions in published tarballs

`@dualmark/cli@0.3.0`, `@dualmark/astro@0.3.0`, `@dualmark/cloudflare@0.3.0`, and `@dualmark/converters@0.3.0` were published with a stale `@dualmark/core` dependency pin of `0.2.1` instead of `0.3.0`. Running `bun add @dualmark/cli@0.3.0` in a fresh project resolves `@dualmark/core@0.2.1` alongside it — a mixed-version install. APIs are byte-equivalent across 0.2.1 and 0.3.0 so it does not crash, but the dependency graph is incorrect.

Root cause: `bun publish` reads workspace dependency versions from `bun.lock` metadata (cached at last install time), not from the current `packages/*/package.json` files. When `changeset version` bumps versions but does not regenerate the lockfile, `bun publish` rewrites `workspace:*` deps to the **previous** version. Tracked upstream as `oven-sh/bun#20477`.

Fixed by:
- Chaining `bun install --lockfile-only` after `changeset version` in the `version-packages` script, so the version PR commits a refreshed lockfile.
- Adding the same step in `release.yml` before `bun publish` runs, as a self-healing safety net for tagged releases.

`@dualmark/cli@0.3.1` and the other adapters now correctly declare `"@dualmark/core": "0.3.1"` in their published `package.json`.

### Landing-page visual fixes

- Removed full-viewport `border-b` from the hero section that produced a stray horizontal hairline below the terminal demo.
- Promoted page-rail z-index above the hero's `BeamsBackground` gradients so the rails are visible end-to-end.
- Scoped the navbar's bottom border to its inner `max-w-7xl` column so it terminates at the rails (was full-viewport).
- Added consistent inter-section dividers between the rails for vertical rhythm — now every section transition has a clean ┬ intersection at both rail crossings.

No package source-code changes; landing fixes affect `apps/docs/` only.

### Migration

- **From 0.3.0**: `bun update @dualmark/*` (or your equivalent). No code changes required.
- **From 0.2.x**: see the v0.3.0 changelog for the relicense + identity changes; this 0.3.1 release rolls those forward with the dep fix.
