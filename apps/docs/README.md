# dualmark-docs

Fumadocs-powered documentation site for Dualmark.

## Run

```bash
bun install
bun run dev      # http://localhost:4000
bun run build
bun run start
```

## Structure

```
apps/docs/
├── app/                 Next.js App Router
│   ├── docs/[[...slug]] Catch-all docs renderer
│   └── api/search       Fumadocs search endpoint
├── content/docs/        MDX source pages
│   ├── integrations/    Astro, Cloudflare, Next.js, manual
│   ├── packages/        @dualmark/* per-package API reference
│   ├── conformance/     CLI + scoring guides
│   └── spec/            AEO Spec v1.0 (synced from /spec/)
├── lib/source.ts        Fumadocs source loader
├── source.config.ts     Fumadocs MDX config
└── scripts/sync-spec.mjs  Pulls /spec/*.md into content/docs/spec/*.mdx
```

The spec lives at `/spec/*.md` (single source of truth). `bun run sync-spec` (auto-run by `dev` and `build`) regenerates the MDX mirror.

## License

MIT
