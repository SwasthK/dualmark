# @dualmark/cloudflare

## 0.2.1

### Patch Changes

- **Hotfix**: 0.2.0 published with unresolved `workspace:*` protocol in dependencies, breaking installation for downstream consumers. 0.2.1 publishes with proper version ranges. Switch from `changeset publish` (which delegates to `npm publish` and doesn't rewrite workspace protocol) to `bun publish` per-package, which correctly resolves `workspace:*` → actual version at pack time.


## 0.2.0

### Minor Changes

- 5e49dc2: Direct `.md` URLs (e.g. `/blog/post.md`) now receive the full set of AEO headers (`Content-Type`, `X-Markdown-Tokens`, `X-Robots-Tag`, `Vary: Accept`, `X-Content-Type-Options: nosniff`) when fetched from `ASSETS` binding. Previously only content-negotiated responses got the full header set, leaving direct `.md` requests at the edge under-decorated.

### Patch Changes

- Updated dependencies [5e49dc2]
  - @dualmark/core@0.2.0
