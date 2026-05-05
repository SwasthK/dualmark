# @dualmark/core

## 0.2.1

### Patch Changes

- **Hotfix**: 0.2.0 published with unresolved `workspace:*` protocol in dependencies, breaking installation for downstream consumers. 0.2.1 publishes with proper version ranges. Switch from `changeset publish` (which delegates to `npm publish` and doesn't rewrite workspace protocol) to `bun publish` per-package, which correctly resolves `workspace:*` → actual version at pack time.


## 0.2.0

### Minor Changes

- 5e49dc2: Consolidate path utilities and analytics types; trim the public API surface. Internal refactor — exported primitives (`detectAIBot`, `negotiateFormat`, `buildMarkdownResponse`, `renderLlmsTxt`, etc.) are unchanged.
