## Summary

<!-- one or two sentences -->

## Changes

<!-- bullets, focused on what + why -->

-

## Type

- [ ] Bug fix (non-breaking)
- [ ] New feature (non-breaking)
- [ ] Breaking change
- [ ] Spec change (requires bump in `AEO_SPEC_VERSION`)
- [ ] Docs / examples / tooling only

## Verification

- [ ] `bun run build` passes
- [ ] `bun run test` passes
- [ ] `bun run typecheck` passes
- [ ] If touching examples: ran `dualmark verify` against the example end-to-end
- [ ] If touching `/spec/`: ran `bun run --filter dualmark-docs sync-spec` and committed the mirror

## Changeset

- [ ] Added a changeset (`bun run changeset`) for any package with a user-visible change
